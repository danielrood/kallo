(function () {
  const reception = window.kalloReception;
  const storeKey = "kallo.diary.v1";
  const backend = window.kalloVoice.pick();
  const session = reception.createSession();
  const showType =
    /(?:\?|&)type=1\b/.test(window.location.search || "") || !backend.canListen;

  const ui = {
    salon: document.querySelector("[data-salon]"),
    verb: document.querySelector("[data-verb]"),
    who: document.querySelector("[data-who]"),
    what: document.querySelector("[data-what]"),
    when: document.querySelector("[data-when]"),
    turn: document.querySelector("[data-turn]"),
    confirm: document.querySelector("[data-confirm]"),
    fallback: document.querySelector("[data-fallback]"),
    form: document.querySelector("[data-fallback-form]"),
    input: document.querySelector("[data-say]"),
  };

  let listening = false;

  function persist() {
    try {
      sessionStorage.setItem(storeKey, JSON.stringify(session.diary));
    } catch (err) {
      /* ignore */
    }
  }

  function restore() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storeKey) || "null");
      if (saved && Array.isArray(saved.records)) session.diary = saved;
    } catch (err) {
      /* keep the default fixture */
    }
  }

  function render() {
    if (ui.salon) ui.salon.textContent = session.salon;
    const showTurn = Boolean(session.proposal);
    if (ui.turn) ui.turn.hidden = !showTurn;
    if (!showTurn) return;
    ui.verb.textContent = session.proposal.verb;
    ui.who.textContent = session.proposal.who;
    ui.what.textContent = session.proposal.what;
    ui.when.textContent = session.proposal.when;
    if (ui.confirm) ui.confirm.hidden = !session.pending;
  }

  function showFallback() {
    if (ui.fallback) ui.fallback.hidden = false;
    if (ui.input) ui.input.focus();
  }

  function applySpoken(raw) {
    const text = String(raw || "").trim();
    if (!text) return;
    reception.hear(session, text);
    render();
  }

  async function listenLoop() {
    if (!backend.canListen) {
      showFallback();
      return;
    }
    if (listening) return;
    listening = true;
    try {
      const text = await backend.listenOnce();
      listening = false;
      applySpoken(text);
      listenLoop();
    } catch (err) {
      listening = false;
      const reason = String((err && err.message) || "");
      if (/not-allowed|service-not-allowed|speech-recognition-unavailable/i.test(reason)) {
        showFallback();
        return;
      }
      listenLoop();
    }
  }

  async function openLine() {
    if (window.kalloSpeech) window.kalloSpeech.warmVoices();
    try {
      await backend.speak(session.salon + ", how can I help?");
    } catch (err) {
      /* speech can be blocked; the mic is still the shop line */
    }
    listenLoop();
  }

  restore();
  render();
  if (showType) showFallback();

  if (ui.confirm) {
    ui.confirm.addEventListener("click", function () {
      const record = reception.thatsRight(session);
      persist();
      render();
      backend.speak(record.verb);
      listenLoop();
    });
  }

  if (ui.form) {
    ui.form.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = ui.input.value;
      ui.input.value = "";
      applySpoken(value);
    });
  }

  openLine();
})();
