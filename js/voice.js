(function () {
  function pickName() {
    try {
      return new URLSearchParams(window.location.search).get("voice") || "mock";
    } catch (err) {
      return "mock";
    }
  }

  function mockBackend() {
    return {
      id: "mock",
      speak: window.kalloSpeech.speak,
      listenOnce: window.kalloSpeech.listenOnce,
      canListen: window.kalloSpeech.canListen,
    };
  }

  // Vendor adapters stay interchangeable. This Pages demo has no keys,
  // so Grok Voice and Vertex / Gemini Live use the same mock shop line.
  function viaMock(id) {
    return Object.assign(mockBackend(), { id: id, via: "mock" });
  }

  const backends = {
    mock: mockBackend,
    grok: function () {
      return viaMock("grok");
    },
    vertex: function () {
      return viaMock("vertex");
    },
    gemini: function () {
      return viaMock("gemini");
    },
  };

  window.kalloVoice = {
    pick: function (name) {
      const id = String(name || pickName()).toLowerCase();
      const make = backends[id] || backends.mock;
      return make();
    },
  };
})();
