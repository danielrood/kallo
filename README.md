# Kallo

Public prototype of an AI receptionist for UK shop owners.

**Live:** https://danielrood.github.io/kallo/

- `/` landing
- `/talk/` one spoken sentence starts the trial
- `/inbox/` clickable owner inbox (urgency, summary, quote accept)

The trial uses the browser microphone (`webkitSpeechRecognition` / `SpeechRecognition`) and `speechSynthesis`. It does not place live phone calls, collect email, or book a demo. Sample jobs are labelled **Demo**.

## Local

Serve the folder over HTTP (the mic needs a secure origin, so use localhost):

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.
