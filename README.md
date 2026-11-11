# Kishan Saathi: farm loan assistant

```
kishan-saathi-app/
├── frontend/   React + TanStack Start (your original app, with chat fixes)
└── backend/    Node + Express chat API (new)
```

## Run it (two terminals)

You need **Node.js 22.9 or newer**.

**1. Backend** (port 8000)
```bash
cd backend
cp .env.example .env        # then open .env and paste your GROQ_API_KEY (gsk_...)
npm install
npm start
```
Check it works: open http://localhost:8000/api/health

**2. Frontend**
```bash
cd frontend
npm install                 # or: bun install
npm run dev
```
Open the URL it prints (e.g. http://localhost:5173) and ask a question.

The frontend finds the backend through `VITE_CHAT_API_URL` (default `http://localhost:8000`). Copy `frontend/.env.example` to `frontend/.env` only if you change the backend address.

Get a free key at https://console.groq.com/keys (no payment needed for the free tier). **Keep the key only in `backend/.env`. Never put it in the frontend.** If your frontend runs on a port other than 5173, 8080 or 3000, add it to `CORS_ORIGINS` in `backend/.env`.

Check the backend log on start: it should say `AI provider: groq:llama-3.3-70b-versatile`, and /api/health should show `"aiConfigured": true`.

No API key yet? The three quick-reply chips (What is KCC? / Loan documents / Loan eligibility) still work, because they are answered from the built-in knowledge base.

## What changed

**Frontend (`frontend/src/components/FarmingApp.tsx`, `styles.css`)**
- The question box now clears after you send (it used to keep the old text).
- Real conversation: earlier messages are shown and sent back, so follow-ups like "and what documents for that?" work.
- Answer-language buttons: Auto / English / हिन्दी / मराठी.
- Clear error messages from the server (rate limit, not configured, etc.), plus a 45-second timeout.
- The "Prototype" footer now reads as a guidance-only disclaimer.
- Everything else (design, sections, API URL contract) is unchanged.

**Backend (`backend/`, new)**
- Uses **Groq's free tier** by default (`llama-3.3-70b-versatile`). If you hit its free limit, it automatically retries with the smaller `llama-3.1-8b-instant`. Free limits are per day and change, so check https://console.groq.com/docs/rate-limits. You can switch to a paid Anthropic key later by setting `ANTHROPIC_API_KEY` instead.
- `POST /api/chat` takes `{ message, history, language }`, returns `{ reply }`.
- Answers are grounded in `data/knowledge.json` (schemes, documents, eligibility, safety tips, helplines), so the model does not make up loan numbers.
- Quick-reply chip questions get instant, verified answers with no API cost.
- Input limits, rate limiting (20 requests/min per IP), CORS allow-list, safe error handling.
- 11 automated tests: `cd backend && npm test`.

## Before you show this to real farmers

1. **Verify `backend/data/knowledge.json`.** I wrote it from general public knowledge. Interest subsidy, loan limits and rules change every year. Check each item against NABARD, your bank, pmkisan.gov.in and agriinfra.dac.gov.in, then set `last_reviewed`. Restart the backend after editing.
2. Have a bank officer or agriculture-extension worker review Hindi and Marathi answers.
3. Deploy the backend (Render, Railway, etc.), set `GROQ_API_KEY` and `CORS_ORIGINS` there, and set `VITE_CHAT_API_URL` to the backend's public https URL when you build the frontend.

## Good next steps
EMI calculator, eligibility form, weather (Open-Meteo), mandi prices (data.gov.in), voice input, login with phone OTP.
