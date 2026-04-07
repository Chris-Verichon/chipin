# ChipIn

> Online group fundraising — create, share, collect.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?logo=stripe)](https://stripe.com)

---

## Overview

**ChipIn** is a web application that allows creators to launch fundraising pools and collect contributions by credit card via Stripe.

### Roles

| Role | Access |
|---|---|
| **Admin** | Global dashboard, statistics, creator management |
| **Creator** | Create fundraisers (€4.99/fundraiser), manage and withdraw funds |
| **Participant** | Anonymous contribution to a fundraiser via shared link |

---

## Tech Stack

- **[Next.js 14](https://nextjs.org)** — App Router, Server Components, API Routes
- **[Supabase](https://supabase.com)** — PostgreSQL + Row Level Security
- **[Stripe](https://stripe.com)** — Card payments + Webhooks
- **[NextAuth.js](https://next-auth.js.org)** — Google OAuth
- **[shadcn/ui](https://ui.shadcn.com)** — Accessible UI components
- **[Tailwind CSS](https://tailwindcss.com)** — Utility-first styling
- **[next-themes](https://github.com/pacocoursey/next-themes)** — Dark mode
- **[Recharts](https://recharts.org)** — Admin dashboard charts
- **[Resend](https://resend.com)** — Transactional emails

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- A Google OAuth project ([console.cloud.google.com](https://console.cloud.google.com))

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/chipin.git
cd chipin/chipin

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Fill in all values in .env.local

# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# 4. Initialize the database
# Run the SQL from /supabase/schema.sql in the Supabase SQL editor

# 5. Initialize shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label dialog badge progress toast separator avatar dropdown-menu skeleton

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Google OAuth — Authorized redirect URI

In [console.cloud.google.com](https://console.cloud.google.com):
**APIs & Services → Credentials → OAuth 2.0 Client ID → Authorized redirect URIs**

Add this exact URI:

```
http://localhost:3000/api/auth/callback/google
```

---

### Stripe Webhooks (local)

```bash
# Install Stripe CLI, then:
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the displayed webhook secret into STRIPE_WEBHOOK_SECRET
```

---

## Project Structure

```
chipin/
├── app/
│   ├── page.tsx                           # Homepage
│   ├── login/page.tsx                     # Login page
│   ├── dashboard/page.tsx                 # Creator space (protected)
│   ├── admin/page.tsx                     # Admin dashboard (protected)
│   ├── cagnotte/[slug]/page.tsx           # Public fundraiser page
│   ├── cagnotte/[slug]/succes/page.tsx    # Payment confirmation
│   └── api/
│       ├── auth/[...nextauth]/route.ts    # Google OAuth
│       ├── cagnottes/route.ts             # Create fundraiser (POST)
│       ├── participations/[id]/route.ts   # Participation details (GET)
│       ├── admin/stats/route.ts           # Admin statistics (GET)
│       └── stripe/
│           ├── checkout/route.ts          # PaymentIntent for contribution
│           ├── creation-checkout/route.ts # €4.99 creation Checkout Session
│           └── webhook/route.ts           # Stripe webhook handler
├── components/
│   ├── ui/                                # shadcn/ui components
│   ├── CagnotteForm.tsx                   # Fundraiser creation modal
│   ├── ParticipationForm.tsx              # Contribution form
│   ├── ProgressBar.tsx                    # Fundraiser progress bar
│   ├── ParticipantList.tsx                # Participants list
│   ├── ThemeToggle.tsx                    # Dark/light mode toggle
│   └── AdminChart.tsx                     # Recharts admin charts
├── lib/
│   ├── supabase.ts                        # Supabase client (service role)
│   ├── stripe.ts                          # Stripe client
│   └── auth.ts                            # NextAuth config
└── supabase/
    └── schema.sql                         # Full database schema
```

---

## Environment Variables

See [`.env.local.example`](.env.local.example) for the full list.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session encryption |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `ADMIN_EMAIL` | Your Google email (auto-promoted to admin on first login) |
| `CREATION_FEE_AMOUNT` | Creation fee in cents (default: `499` = €4.99) |
| `PLATFORM_FEE_PERCENT` | Platform commission per contribution in % (default: `5`) |

---

## Deployment (Vercel)

### 1 — Push to GitHub

```bash
git checkout main
git push origin main
```

### 2 — Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import** your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: leave empty (the `chipin/` folder is the root)

### 3 — Environment variables

In **Settings → Environment Variables**, add every variable from the table below. Set them for **Production**, **Preview**, and **Development**.

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (service_role key) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Created in step 5 below |
| `NEXTAUTH_URL` | Your production URL, e.g. `https://chipin.vercel.app` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials |
| `ADMIN_EMAIL` | Your Google email (auto-promoted to admin on first login) |
| `NEXT_PUBLIC_APP_URL` | Your production URL, e.g. `https://chipin.vercel.app` |
| `CREATION_FEE_AMOUNT` | `499` (= €4.99) |

### 4 — Supabase: run all migrations

In your **Supabase SQL Editor**, run in order:

```sql
-- 1. Base schema (tables, RLS, functions)
-- Content of: supabase/schema.sql

-- 2. Login tracking
-- Content of: supabase/add_login_events.sql
```

### 5 — Google OAuth: add production redirect URI

In [console.cloud.google.com](https://console.cloud.google.com):
**APIs & Services → Credentials → your OAuth 2.0 client → Authorized redirect URIs**

Add:
```
https://your-domain.vercel.app/api/auth/callback/google
```

### 6 — Stripe: create a production webhook

1. **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. URL: `https://your-domain.vercel.app/api/stripe/webhook`
3. Events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
4. Copy the **Signing secret** → paste into `STRIPE_WEBHOOK_SECRET` in Vercel

### 7 — Redeploy

After adding all env vars, trigger a new deployment:
**Vercel Dashboard → Deployments → Redeploy** (or push a new commit).

---

## Security

- `SUPABASE_SERVICE_ROLE_KEY` is never exposed to the client
- All `/api/*` routes verify the NextAuth session when required
- Stripe webhooks are always verified with `stripe.webhooks.constructEvent`
- Row Level Security (RLS) is enabled on all Supabase tables
- `/admin/*` routes verify `role === 'admin'` server-side

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

---

## License

MIT — © 2026 ChipIn
