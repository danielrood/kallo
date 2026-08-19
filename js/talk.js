(function () {
  const firstPrompt =
    "Say your shop name, your trade, and the number you already use.";
  const example = "Northgate Motors, garage, 01632 960447";
  const draftKey = "kallo.trial.draft.v1";

  const ui = {
    status: document.querySelector("[data-status]"),
    live: document.querySelector("[data-live]"),
    start: document.querySelector("[data-start]"),
    fallback: document.querySelector("[data-fallback]"),
    fallbackForm: document.querySelector("[data-fallback-form]"),
    fallbackInput: document.querySelector("[data-utterance]"),
    error: document.querySelector("[data-error]"),
    facts: document.querySelector("[data-facts]"),
  };

  let profile = window.emptyProfile();
  try {
    const saved = JSON.parse(sessionStorage.getItem(draftKey) || "null");
    if (saved) profile = window.mergeFacts(profile, saved);
  } catch (err) {
    profile = window.emptyProfile();
  }

  function setStatus(text) {
    if (ui.status) ui.status.textContent = text;
  }

  function setLive(text) {
    if (ui.live) ui.live.textContent = text || "Waiting for the next fact.";
  }

  function setError(text) {
    if (!ui.error) return;
    ui.error.hidden = !text;
    ui.error.textContent = text || "";
  }

  function saveDraft() {
    sessionStorage.setItem(draftKey, JSON.stringify(profile));
  }

  function renderFacts() {
    if (!ui.facts) return;
    const rows = [
      { key: "shop", label: "Shop name", value: profile.shopName },
      { key: "trade", label: "Trade", value: profile.tradeLabel },
      { key: "number", label: "Existing number", value: profile.number },
    ];
    ui.facts.innerHTML = rows
      .map(function (row) {
        return (
          '<li class="fact' +
          (row.value ? " is-set" : "") +
          '" data-fact="' +
          row.key +
          '">' +
          '<span class="fact__label">' +
          row.label +
          "</span>" +
          '<span class="fact__value">' +
          (row.value || "Waiting") +
          "</span>" +
          "</li>"
        );
      })
      .join("");
  }

  function openInbox() {
    window.kalloStore.write(profile);
    sessionStorage.removeItem(draftKey);
    window.location.href = window.kalloHref("inbox/");
  }

  function showFallback(message) {
    if (ui.fallback) ui.fallback.hidden = false;
    if (ui.start) ui.start.disabled = false;
    if (message) setStatus(message);
    if (ui.fallbackInput) ui.fallbackInput.focus();
  }

  async function listenRound(promptText) {
    if (ui.start) ui.start.disabled = true;
    setError("");
    setStatus("Kallo is speaking, then listening.");
    if (promptText) await window.kalloSpeech.speak(promptText);
    if (!window.kalloSpeech.canListen) {
      showFallback("This browser cannot listen. Type the missing facts.");
      return;
    }
    try {
      setStatus("Listening.");
      const text = await window.kalloSpeech.listenOnce(setLive);
      if (ui.start) ui.start.disabled = false;
      await applyUtterance(text);
    } catch (err) {
      showFallback("Microphone did not start. Type the missing facts.");
      setError("Mic needs HTTPS and permission. Nothing is sent to a voice API.");
    }
  }

  async function applyUtterance(raw) {
    const spoken = String(raw || "").trim();
    if (!spoken) {
      setError("Nothing was captured.");
      const ask = window.askForMissing(profile);
      setStatus(ask);
      if (window.kalloSpeech.canListen) {
        await listenRound(ask);
      } else {
        showFallback(ask);
      }
      return;
    }
    setLive(spoken);
    profile = window.mergeFacts(profile, window.parseUtterance(spoken));
    saveDraft();
    renderFacts();
    if (!window.isComplete(profile)) {
      const ask = window.askForMissing(profile);
      setStatus(ask);
      if (window.kalloSpeech.canListen) {
        await listenRound(ask);
      } else {
        showFallback(ask);
      }
      return;
    }
    setStatus("You are in.");
    if (ui.start) ui.start.disabled = true;
    await window.kalloSpeech.speak("You are in.");
    openInbox();
  }

  if (window.kalloSpeech) window.kalloSpeech.warmVoices();
  setLive("");
  renderFacts();
  if (!window.kalloSpeech.canListen && ui.fallback) ui.fallback.hidden = false;

  if (ui.start) {
    ui.start.addEventListener("click", function () {
      const prompt = window.isComplete(profile)
        ? firstPrompt
        : window.missingFacts(profile).length === 3
          ? firstPrompt
          : window.askForMissing(profile);
      listenRound(prompt);
    });
  }
  if (ui.fallbackForm) {
    ui.fallbackForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = ui.fallbackInput.value;
      ui.fallbackInput.value = "";
      applyUtterance(value);
    });
  }

  document.querySelector("[data-example]").textContent = example;
})();
