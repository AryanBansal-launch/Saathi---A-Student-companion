# Saarthi – Scripts

Scripts for MongoDB setup and dummy data.

## Prerequisites

- Node.js (from project root)
- `MONGODB_URI` in `.env.local`

## 1. Seed dummy data

Creates collections and inserts dummy users, vendors, listings, reviews, and interactions. **Drops existing `users`, `listings`, `reviews`, `vendors`, `interactions`** before seeding.

```bash
node scripts/seed.js
```

**Demo logins (password for all: `password123`):**

| Role   | Email                |
|--------|----------------------|
| Admin  | admin@saarthi.com     |
| Vendor | vendor1@saarthi.com   |
| Vendor | vendor2@saarthi.com  |
| Student| rahul@example.com   |
| Student| priya@example.com    |

## 2. Create collections and indexes

Ensures all collections exist and creates indexes as in the Mongoose models. Run after `seed.js` if you want indexes without starting the Next app.

```bash
node scripts/create-collections-and-indexes.js
```

## 3. Optional: npm scripts

In `package.json` you can add:

```json
"scripts": {
  "seed": "node scripts/seed.js",
  "db:indexes": "node scripts/create-collections-and-indexes.js"
}
```

Then run:

```bash
npm run seed
npm run db:indexes
```

## Files

- `load-env.js` – Loads `.env.local` into `process.env` (used by other scripts).
- `seed.js` – Seeds dummy data; drops and recreates the five collections.
- `create-collections-and-indexes.js` – Syncs indexes for User, Listing, Review, Vendor, Interaction.
