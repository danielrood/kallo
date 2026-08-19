(function () {
  function Recognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function pickVoice() {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const preferred = voices.find(function (voice) {
      return /en-GB/i.test(voice.lang) && /female|uk|british|google/i.test(voice.name);
    });
    return (
      preferred ||
      voices.find(function (voice) {
        return /en-GB/i.test(voice.lang);
      }) ||
      voices.find(function (voice) {
        return /^en/i.test(voice.lang);
      }) ||
      null
    );
  }

  function speak(text) {
    return new Promise(function (resolve) {
      if (!window.speechSynthesis) {
        resolve(false);
        return;
      }
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-GB";
      utter.rate = 1;
      utter.pitch = 1;
      const voice = pickVoice();
      if (voice) utter.voice = voice;
      utter.onend = function () {
        resolve(true);
      };
      utter.onerror = function () {
        resolve(false);
      };
      speechSynthesis.speak(utter);
    });
  }

  function listenOnce(onPartial) {
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
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalText += piece;
          else interim += piece;
        }
        if (typeof onPartial === "function") onPartial((finalText + " " + interim).trim());
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
    canSpeak: Boolean(window.speechSynthesis),
    speak: speak,
    listenOnce: listenOnce,
    warmVoices: function () {
      if (!window.speechSynthesis) return;
      speechSynthesis.getVoices();
      if (typeof speechSynthesis.onvoiceschanged !== "undefined") {
        speechSynthesis.onvoiceschanged = function () {
          speechSynthesis.getVoices();
        };
      }
    },
  };
})();
