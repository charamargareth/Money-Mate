# MoneyMate

AI-powered personal finance platform — expense tracking, AI receipt scanning,
split bills, budgeting, analytics, and bill reminders — built with Next.js 15,
TypeScript, Tailwind CSS, and Supabase.

## What's real vs. what's simulated

This is a complete, production-structured frontend with a real Supabase
backend contract. To keep the app instantly runnable and reviewable without
your own API keys, three things are simulated with realistic mock data and
clearly marked in code:

| Feature | Status |
|---|---|
| UI, design system, animations, all 15+ pages | **Fully real** |
| Auth forms (login/register/reset/OAuth trigger) | **Fully real** — wired to Supabase Auth |
| Database schema + Row Level Security | **Fully real** — `supabase/schema.sql` |
| Transactions, budgets, bills, split bills (data) | **Mock data** in `lib/mock-data.ts`, shaped 1:1 with the schema |
| AI receipt scanner | **Simulated pipeline** in `components/receipt/receipt-scanner.tsx` — swap in Google Vision/Tesseract + OpenAI (see below) |
| Google OAuth | **Real call**, needs your Google credentials configured in Supabase |

Swapping mock data for live Supabase queries is a matter of replacing the
`lib/mock-data.ts` imports in each page with `supabase.from(...)` calls using
the client in `lib/supabase/client.ts` / `server.ts` — the types in
`types/index.ts` already match the database schema exactly.

## Getting started

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Visit `http://localhost:3000`.

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
   This creates every table, Row Level Security policy, the auto-profile
   trigger, the budget-threshold notification trigger, and the `receipts`
   storage bucket.
3. Go to **Project Settings → API** and copy your **Project URL** and
   **anon public key** into `.env.local`.
4. (Optional) Go to **Authentication → Email Templates** to customize the
   verification and password-reset emails.

## Setting up Google OAuth

1. In the [Google Cloud Console](https://console.cloud.google.com/), create
   an OAuth 2.0 Client ID (Web application).
2. Add `https://<your-project>.supabase.co/auth/v1/callback` as an
   authorized redirect URI.
3. In Supabase Dashboard → **Authentication → Providers → Google**, paste
   your Client ID and Client Secret, and enable the provider.
4. The "Continue with Google" button already calls
   `supabase.auth.signInWithOAuth({ provider: "google" })` — no code changes
   needed. New Google sign-ups land on `/onboarding` to claim a username.

## Wiring up real AI receipt scanning

`components/receipt/receipt-scanner.tsx` currently simulates the OCR + AI
categorization pipeline with a timed mock result so the UI/UX is fully
reviewable offline. To make it real:

1. **OCR** — send the uploaded file to Google Cloud Vision
   (`documentTextDetection`) or run Tesseract.js client-side. Do this from a
   Next.js Route Handler (e.g. `app/api/scan-receipt/route.ts`) so your API
   key never reaches the browser.
2. **Categorization** — pass the OCR'd text to the OpenAI API with a prompt
   like *"Extract merchant, date, total, line items, and suggest an expense
   category from this list: [...]. Respond as JSON."*
3. Replace the `MOCK_EXTRACTION` object and the `runPipeline()` timers in
   `receipt-scanner.tsx` with a `fetch("/api/scan-receipt")` call, keeping
   the same `ExtractedReceipt` shape from `types/index.ts` so the review
   form needs no changes.
4. Upload the original file to the `receipts` Supabase Storage bucket
   (already created by the schema, with RLS scoped per-user folder) and
   save its path to `transactions.receipt_url`.

## Project structure

```
app/
  (auth)/            Login, register, reset password, Google-OAuth onboarding
  (app)/              Authenticated app shell (sidebar + topbar + mobile nav)
    dashboard/        Summary cards, charts, recent activity, quick actions
    transactions/     Searchable/filterable/sortable/paginated table
    scan-receipt/     AI receipt scanner (upload -> process -> review)
    split-bill/       List, create, and per-bill detail (QR + share link)
    budget/           Monthly budgets with 80%/100% warnings
    analytics/        Filterable charts and financial summary stats
    bills/            Recurring bill reminders (list + calendar view)
    reports/          Export transactions to PDF / Excel / CSV
    settings/         Profile, preferences, security
    help/             Searchable FAQ
    support/          Contact form
  not-found.tsx       Custom 404
components/
  ui/                 Design-system primitives (button, card, dialog, ...)
  dashboard/ transactions/ receipt/ split-bill/ budget/ bills/ analytics/
  layout/             Sidebar, topbar, mobile nav, FAB, global search (Cmd+K)
lib/
  supabase/           Browser client, server client, middleware session helper
  mock-data.ts        Realistic seed data, shaped like the real schema
  export.ts           PDF / Excel / CSV export helpers
supabase/
  schema.sql          Full schema + RLS policies + triggers
types/index.ts        Shared TypeScript types mirroring the schema
```

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as
environment variables in the Vercel project settings before deploying to
production.

## Design system

- **Colors**: cream `#FFFCE1`, sky blue `#CFEBFF`, navy `#23324A`, plus
  semantic green/red/orange - defined as CSS variables in `app/globals.css`
  with a full dark-mode palette.
- **Type**: Space Grotesk (display/headings), Inter (body), JetBrains Mono
  (all currency and numeric values, for tabular alignment).
- **Radii**: 20px on cards, softened at 12-16px on inputs/buttons.
- Toggle dark mode from the sun/moon icon in the topbar, or Settings ->
  Preferences.

## Known limitations of this scaffold

- Data operations (add/edit/delete transaction, budgets, bills, split bills)
  update local React state only — wire them to `supabase.from(...)` calls
  to persist. The dialogs already collect fully-validated data in the right
  shape.
- Rate limiting and input validation beyond Zod schemas (e.g. API-level
  throttling) should be added at the Supabase Edge Function / route handler
  layer if you expose custom endpoints.
- The build in this sandbox couldn't reach `fonts.googleapis.com` to verify
  font fetching (network egress is restricted here) — this works normally
  in any environment with internet access, including Vercel.
