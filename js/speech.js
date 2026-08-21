(function () {
  function Recognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function listenOnce() {
    return new Promise(function (resolve, reject) {
      const Ctor = Recognition();
      if (!Ctor) {
        reject(new Error("speech-recognition-unavailable"));
        return;
      }
      const rec = new Ctor();
      rec.lang = "en-GB";
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;
      let finalText = "";
      rec.onresult = function (event) {
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
        }
      };
      rec.onerror = function (event) {
        reject(new Error(event.error || "speech-error"));
      };
      rec.onend = function () {
        resolve(finalText.trim());
      };
      rec.start();
    });
  }

  window.kalloSpeech = {
    canListen: Boolean(Recognition()),
    listenOnce: listenOnce,
  };
})();
