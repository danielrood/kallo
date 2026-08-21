# Kallo

One card while someone speaks into the laptop microphone. She writes it in the paper book.

**Live:** https://danielrood.github.io/kallo/

GitHub Pages is served from `main` `/` (root). If that URL 404s, enable Pages in the repo settings: Deploy from a branch → `main` → `/`.

The mark and Helen's sit top left; teal **On the line** top right. One verb — BOOKED, MOVED, or CANCELLED — then the name, service, and time. **That's right** confirms the card. Footer: “Write it down. Not a live line.” No diary, inbox, or live phone. The Tuesday sitting uses the browser microphone (Web Speech). No API keys.

## Tuesday path

Default card: Priya Nair · Tuesday 2:30 · Booked.

1. Book Priya → Booked → That's right
2. Move to a later slot the same week → Moved → That's right
3. Cancel that booking → Cancelled → That's right

If the microphone is blocked, add `?type=1`.

## Local

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`. Then:

```bash
node tests/fixtures.test.mjs
```
