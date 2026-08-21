(function () {
  const reception = window.kalloReception;
  const ears = window.kalloSpeech;
  const session = reception.createSession();
  const showType =
    /(?:\?|&)type=1\b/.test(window.location.search || "") || !ears.canListen;

  const ui = {
    salon: document.querySelector("[data-salon]"),
    verb: document.querySelector("[data-verb]"),
    who: document.querySelector("[data-who]"),
    what: document.querySelector("[data-what]"),
    when: document.querySelector("[data-when]"),
    fallback: document.querySelector("[data-fallback]"),
    form: document.querySelector("[data-fallback-form]"),
    input: document.querySelector("[data-say]"),
  };

  let listening = false;

  function render() {
    const shown = reception.view(session);
    if (ui.salon) ui.salon.textContent = session.salon;
    ui.verb.textContent = shown.verb;
    ui.who.textContent = shown.who;
    ui.what.textContent = shown.what;
    ui.when.textContent = shown.when;
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
    if (!ears.canListen) {
      showFallback();
      return;
    }
    if (listening) return;
    listening = true;
    try {
      const text = await ears.listenOnce();
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

  render();
  if (showType) showFallback();

  if (ui.form) {
    ui.form.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = ui.input.value;
      ui.input.value = "";
      applySpoken(value);
    });
  }

  document.addEventListener("pointerdown", listenLoop);
  document.addEventListener("keydown", listenLoop);
  listenLoop();
})();
