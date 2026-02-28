# Saarthi — Free API Keys & Services Reference

This document lists all external services used by Saarthi and where to get free API keys or set up free tiers.

---

## Authentication

### NextAuth.js
- **What:** Session & OAuth (Google, credentials).
- **Cost:** Free (self-hosted).
- **Keys:** None for NextAuth itself. You need a **secret** for signing sessions:
  - Generate: `openssl rand -base64 32` or use any long random string.
  - Set in `.env.local`: `NEXTAUTH_SECRET=your_secret_here`

### Google OAuth (for “Sign in with Google”)
- **Where:** [Google Cloud Console](https://console.cloud.google.com/)
- **Steps:**
  1. Create a project (or select one).
  2. Go to **APIs & Services → Credentials**.
  3. **Create credentials → OAuth client ID**.
  4. Application type: **Web application**.
  5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (and your production URL later).
  6. Copy **Client ID** and **Client Secret**.
- **Env vars:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Free tier:** Yes; no charge for standard OAuth usage.

---

## Database

### MongoDB Atlas
- **Where:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Steps:**
  1. Sign up / log in.
  2. Create a **free cluster** (M0 — 512 MB).
  3. Go to **Database Access** → Add user (username + password).
  4. **Network Access** → Add IP (e.g. `0.0.0.0/0` for dev, or your IP).
  5. **Database** → Connect → Choose “Connect your application” → copy connection string.
- **Env var:** `MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`
- **Free tier:** 512 MB storage, enough for MVP.

---

## File Storage (Images)

### Cloudinary
- **Where:** [Cloudinary](https://cloudinary.com/)
- **Steps:**
  1. Sign up for a free account.
  2. In **Dashboard** you’ll see: **Cloud name**, **API Key**, **API Secret**.
- **Env vars:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Free tier:** 25 GB storage, 25 GB bandwidth/month.

---

## Email

### Resend
- **Where:** [Resend](https://resend.com/)
- **Steps:**
  1. Sign up.
  2. **API Keys** → Create API Key.
  3. (Optional) Add and verify a domain for sending.
- **Env var:** `RESEND_API_KEY`
- **Free tier:** 3,000 emails/month.

---

## AI / Chatbot (Optional)

### Google Gemini (used for the in-app chatbot)
- **Where:** [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Steps:**
  1. Sign in with your Google account.
  2. Click **Get API key** → Create API key (create a new project if prompted).
  3. Copy the key and add it to `.env.local`.
- **Env var:** `GEMINI_API_KEY`. Optional: `GEMINI_CHAT_MODEL` (default: `gemini-2.0-flash`; use e.g. `gemini-2.5-flash` or `gemini-pro` if you get a 404).
- **Free tier:** Generous free tier. No credit card required. See [Gemini API pricing](https://ai.google.dev/pricing) and [models](https://ai.google.dev/gemini-api/docs/models).

The floating chat button uses Gemini to answer questions like *"I need a mess near Lajpat Nagar under ₹3000"* and guides users to use filters and search on Saarthi.

### OpenRouter (alternative for chatbot / smart search)
- **Where:** [OpenRouter](https://openrouter.ai/)
- **Steps:**
  1. Sign up.
  2. **Keys** → Create key.
  3. Use free models (e.g. Mistral 7B) in your requests.
- **Env var:** `OPENROUTER_API_KEY`
- **Free tier:** Depends on model; many models have free tiers.

### Hugging Face Inference API (optional, for NLP)
- **Where:** [Hugging Face](https://huggingface.co/)
- **Steps:**
  1. Create account.
  2. **Settings → Access Tokens** → Create token (read or write as needed).
- **Env var:** `HUGGINGFACE_API_KEY` (if you use it in code).
- **Free tier:** ~30,000 requests/month for inference API.

---

## Maps & Location

### OpenStreetMap / Nominatim (geocoding)
- **What:** Used for address → lat/lng (e.g. in `useLocation` or search).
- **Where:** No key required for [Nominatim](https://nominatim.org/) (use with reasonable rate limits and a proper User-Agent).
- **Cost:** Free.

### Leaflet + OpenStreetMap Tiles
- **What:** Map display (no Google Maps).
- **Where:** No API key; use Leaflet + OSM tile URLs in code.
- **Cost:** Free.

---

## Deployment

### Vercel
- **Where:** [Vercel](https://vercel.com/)
- **Steps:**
  1. Sign up (e.g. with GitHub).
  2. Import your repo and deploy.
  3. Add env vars in **Project → Settings → Environment Variables**.
- **Free tier:** 100 GB bandwidth/month, serverless limits.

---

## Summary Table

| Service           | Purpose              | Get key / signup                    | Env variable(s)                          |
|-------------------|----------------------|-------------------------------------|------------------------------------------|
| NextAuth          | Auth sessions        | Generate secret                     | `NEXTAUTH_SECRET`, `NEXTAUTH_URL`        |
| Google OAuth      | “Sign in with Google”| [Google Cloud Console](https://console.cloud.google.com/) | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| MongoDB Atlas     | Database             | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | `MONGODB_URI`                |
| Cloudinary        | Image uploads        | [Cloudinary](https://cloudinary.com/) | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Resend            | Email (OTP, etc.)    | [Resend](https://resend.com/)       | `RESEND_API_KEY`                          |
| Google Gemini     | In-app chatbot       | [Google AI Studio](https://aistudio.google.com/app/apikey) | `GEMINI_API_KEY`           |
| OpenRouter        | AI (alternative)     | [OpenRouter](https://openrouter.ai/) | `OPENROUTER_API_KEY`                    |
| Hugging Face      | NLP (optional)       | [Hugging Face](https://huggingface.co/) | `HUGGINGFACE_API_KEY` (if used)       |
| OpenStreetMap     | Maps / geocoding     | No key (use responsibly)            | —                                         |
| Vercel            | Hosting              | [Vercel](https://vercel.com/)       | Set in Vercel dashboard                   |

---

## Minimal setup to run locally

1. **Required:** `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `MONGODB_URI`
2. **For Google login:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
3. **For image uploads:** Cloudinary env vars
4. **For email:** `RESEND_API_KEY`
5. **For chatbot:** `GEMINI_API_KEY` (optional – get free at [Google AI Studio](https://aistudio.google.com/app/apikey))

Copy `.env.local` from the project and fill in the values using the links above.
