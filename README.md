# Saarthi

Your guide in a new city. One stop solution for students & bachelors — hostels, mess, bike rental, accommodation, laundry, furniture, books and more.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # or create .env.local with MONGODB_URI, NEXTAUTH_*
npm run dev
```

## Demo logins

After running `npm run seed`, you can sign in with these accounts. **Password for all: `password123`**

| Role   | Email |
|--------|-------|
| Admin  | admin@saarthi.com |
| Vendor | vendor1@saarthi.com, vendor2@saarthi.com |
| Student| rahul@example.com, priya@example.com |

## Scripts

- `npm run seed` — Seed MongoDB with dummy data (see `scripts/README.md`)
- `npm run db:indexes` — Create/sync database indexes

## Chatbot

A floating chat button (bottom-right) lets users ask questions like *"I need a mess near Lajpat Nagar under ₹3000"*. It’s powered by **Google Gemini** (free tier). Add `GEMINI_API_KEY` to `.env.local`; get a key at [Google AI Studio](https://aistudio.google.com/app/apikey).

## Docs

- [API keys & free services](API_KEYS_AND_SERVICES.md)
- [Scripts (seed, indexes)](scripts/README.md)
