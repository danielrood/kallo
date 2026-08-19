# Kallo

Public prototype of an AI receptionist for UK shop owners.

**Live:** https://danielrood.github.io/kallo/

GitHub Pages is served from `main` `/` (root). If that URL 404s, enable Pages in the repo settings: Deploy from a branch → `main` → `/`. The Cloud Agent token cannot create the Pages site.

- `/` landing
- `/talk/` collect shop name, trade, and existing number; ask if any fact is missing
- `/inbox/` clickable owner inbox after those three facts (urgency, summary, quote accept)

The trial uses the browser microphone (`webkitSpeechRecognition` / `SpeechRecognition`) and `speechSynthesis`. It does not place live phone calls or collect an email address. Sample jobs are labelled **Demo**.

## Local

Serve the folder over HTTP (the mic needs a secure origin, so use localhost):

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.
