# Kallo

Inbound receptionist demo. The laptop microphone is the shop line.

**Live:** https://danielrood.github.io/kallo/

GitHub Pages is served from `main` `/` (root). If that URL 404s, enable Pages in the repo settings: Deploy from a branch → `main` → `/`.

The screen is one object: the existing mark, Helen's, and **On the line**. A turn is one verb — Booked, Moved, or Cancelled — plus who, what, and when. **That's right** writes a labelled Demo record into a mock diary.

No live phone calls. No Twilio. No signup. Speech stays in the browser (`webkitSpeechRecognition` / `SpeechRecognition` and `speechSynthesis`) on the mock backend. Grok Voice and Vertex / Gemini Live are adapters; this build does not need API keys.

## Tuesday path

Default fixture: Priya Nair · cut and blow dry · Tuesday 2:30.

1. Book that slot → Booked → That's right
2. Move to a later slot the same week → Moved → That's right
3. Cancel that booking → Cancelled → That's right

If the microphone is blocked, add `?type=1` for a typed fallback. Dummy UK numbers, if any appear, stay in the 01632 / 07700 900 ranges.

## Local

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`. Then:

```bash
node tests/fixtures.test.mjs
```
