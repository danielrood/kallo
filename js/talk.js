(function () {
  const prompt =
    "Say your shop name, your trade, and the number you already use. One sentence is enough.";
  const example = "Northgate Motors, garage, 01632 960447";

  const ui = {
    status: document.querySelector("[data-status]"),
    live: document.querySelector("[data-live]"),
    start: document.querySelector("[data-start]"),
    fallback: document.querySelector("[data-fallback]"),
    fallbackForm: document.querySelector("[data-fallback-form]"),
    fallbackInput: document.querySelector("[data-utterance]"),
    error: document.querySelector("[data-error]"),
  };

  function setStatus(text) {
    if (ui.status) ui.status.textContent = text;
  }

  function setLive(text) {
    if (ui.live) ui.live.textContent = text || "Waiting for one sentence.";
  }

  function setError(text) {
    if (!ui.error) return;
    ui.error.hidden = !text;
    ui.error.textContent = text || "";
  }

  function openInbox(profile) {
    window.kalloStore.write(profile);
    window.location.href = window.kalloHref("inbox/");
  }

  function finish(raw) {
    const spoken = String(raw || "").trim();
    if (!spoken) {
      setError("Nothing was captured. Try again in one sentence.");
      setStatus("Ready when you are.");
      return;
    }
    setLive(spoken);
    setStatus("Opening your owner inbox.");
    const profile = window.parseUtterance(spoken);
    openInbox(profile);
  }

  async function startTalk() {
    setError("");
    ui.start.disabled = true;
    setStatus("Kallo is speaking, then listening.");
    await window.kalloSpeech.speak(prompt);
    if (!window.kalloSpeech.canListen) {
      ui.start.disabled = false;
      ui.fallback.hidden = false;
      setStatus("This browser cannot listen. Type the same sentence.");
      if (ui.fallbackInput) ui.fallbackInput.focus();
      return;
    }
    try {
      setStatus("Listening — one sentence.");
      const text = await window.kalloSpeech.listenOnce(setLive);
      ui.start.disabled = false;
      finish(text);
    } catch (err) {
      ui.start.disabled = false;
      ui.fallback.hidden = false;
      setStatus("Microphone did not start. Type the same sentence.");
      setError("Mic needs HTTPS and permission. Nothing is sent to a voice API.");
    }
  }

  if (window.kalloSpeech) window.kalloSpeech.warmVoices();
  setLive("");
  if (!window.kalloSpeech.canListen && ui.fallback) ui.fallback.hidden = false;

  if (ui.start) ui.start.addEventListener("click", startTalk);
  if (ui.fallbackForm) {
    ui.fallbackForm.addEventListener("submit", function (event) {
      event.preventDefault();
      finish(ui.fallbackInput.value);
    });
  }

  document.querySelector("[data-example]").textContent = example;
})();
