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

# 4. Initialize the database
# Run the SQL from /supabase/schema.sql in the Supabase SQL editor

# 5. Initialize shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label dialog badge progress toast separator avatar dropdown-menu skeleton

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

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

---

## Deployment (Vercel)

```bash
# 1. Push to GitHub
git add . && git commit -m "chore: ready for deploy" && git push

# 2. Import on vercel.com → New Project → Import GitHub repo

# 3. Add all environment variables (Settings → Environment Variables)

# 4. Update NEXT_PUBLIC_APP_URL with your Vercel URL

# 5. Create a Stripe production webhook
# → Stripe Dashboard → Webhooks → Add endpoint
# → URL: https://your-domain.vercel.app/api/stripe/webhook
# → Events: payment_intent.succeeded, payment_intent.payment_failed, checkout.session.completed
```

---

## Security

- `SUPABASE_SERVICE_ROLE_KEY` is never exposed to the client
- All `/api/*` routes verify the NextAuth session when required
- Stripe webhooks are always verified with `stripe.webhooks.constructEvent`
- Row Level Security (RLS) is enabled on all Supabase tables
- `/admin/*` routes verify `role === 'admin'` server-side

---

## Changelog

See [CHANGELOG.md](../CHANGELOG.md).

---

## License

MIT — © 2026 ChipIn

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?logo=stripe)](https://stripe.com)

---

## Présentation

**ChipIn** est une application web permettant à des créateurs de lancer des cagnottes en ligne et de collecter des contributions par carte bancaire via Stripe.

### Rôles

| Rôle | Accès |
|---|---|
| **Admin** | Tableau de bord global, statistiques, gestion des créateurs |
| **Créateur** | Création de cagnottes (4.99€/cagnotte), gestion et retrait des fonds |
| **Participant** | Contribution anonyme à une cagnotte via lien partagé |

---

## Stack technique

- **[Next.js 14](https://nextjs.org)** — App Router, Server Components, API Routes
- **[Supabase](https://supabase.com)** — PostgreSQL + Row Level Security
- **[Stripe](https://stripe.com)** — Paiements CB + Webhooks
- **[NextAuth.js](https://next-auth.js.org)** — Google OAuth
- **[shadcn/ui](https://ui.shadcn.com)** — Composants UI accessibles
- **[Tailwind CSS](https://tailwindcss.com)** — Styles utilitaires
- **[next-themes](https://github.com/pacocoursey/next-themes)** — Dark mode
- **[Recharts](https://recharts.org)** — Graphiques dashboard admin
- **[Resend](https://resend.com)** — Emails transactionnels

---

## Installation

### Prérequis

- Node.js >= 18
- Un projet [Supabase](https://supabase.com)
- Un compte [Stripe](https://stripe.com)
- Un projet Google OAuth ([console.cloud.google.com](https://console.cloud.google.com))

### Setup

```bash
# 1. Cloner le repo
git clone https://github.com/ton-username/chipin.git
cd chipin/chipin

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.local.example .env.local
# → Remplir toutes les valeurs dans .env.local

# 4. Initialiser la base de données
# → Exécuter le SQL de /supabase/schema.sql dans l'éditeur Supabase

# 5. Initialiser shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label dialog badge progress toast separator avatar dropdown-menu skeleton

# 6. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Webhooks Stripe en local

```bash
# Installer Stripe CLI puis :
stripe listen --forward-to localhost:3000/api/stripe/webhook
# → Copier le webhook secret affiché dans STRIPE_WEBHOOK_SECRET
```

---

## Structure du projet

```
chipin/
├── app/
│   ├── page.tsx                           # Homepage
│   ├── login/page.tsx                     # Page de connexion
│   ├── dashboard/page.tsx                 # Espace créateur (protégé)
│   ├── admin/page.tsx                     # Dashboard admin (protégé)
│   ├── cagnotte/[slug]/page.tsx           # Page publique d'une cagnotte
│   ├── cagnotte/[slug]/succes/page.tsx    # Confirmation de paiement
│   └── api/
│       ├── auth/[...nextauth]/route.ts    # Google OAuth
│       ├── cagnottes/route.ts             # Création de cagnotte (POST)
│       ├── participations/[id]/route.ts   # Détails participation (GET)
│       ├── admin/stats/route.ts           # Statistiques admin (GET)
│       └── stripe/
│           ├── checkout/route.ts          # PaymentIntent participation
│           ├── creation-checkout/route.ts # Checkout 4.99€ création
│           └── webhook/route.ts           # Webhook Stripe
├── components/
│   ├── ui/                                # Composants shadcn/ui
│   ├── CagnotteForm.tsx                   # Modal création cagnotte
│   ├── ParticipationForm.tsx              # Formulaire de don
│   ├── ProgressBar.tsx                    # Barre de progression
│   ├── ParticipantList.tsx                # Liste des participants
│   ├── ThemeToggle.tsx                    # Toggle dark/light mode
│   └── AdminChart.tsx                     # Graphiques Recharts
├── lib/
│   ├── supabase.ts                        # Client Supabase (service role)
│   ├── stripe.ts                          # Client Stripe
│   └── auth.ts                            # Config NextAuth
└── supabase/
    └── schema.sql                         # Schéma complet de la BDD
```

---

## Variables d'environnement

See [`.env.local.example`](.env.local.example) for the full list.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de ton projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service Supabase (serveur uniquement) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe |
| `NEXTAUTH_SECRET` | Secret aléatoire pour NextAuth |
| `GOOGLE_CLIENT_ID` | ID client Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Secret client Google OAuth |
| `ADMIN_EMAIL` | Ton email Google (promu admin au 1er login) |
| `CREATION_FEE_AMOUNT` | Frais de création en centimes (défaut: `499`) |

---

## Déploiement (Vercel)

```bash
# 1. Push sur GitHub
git add . && git commit -m "chore: ready for deploy" && git push

# 2. Importer sur vercel.com → New Project → Import GitHub repo

# 3. Ajouter toutes les variables d'environnement (Settings → Environment Variables)

# 4. Mettre à jour NEXT_PUBLIC_APP_URL avec l'URL Vercel

# 5. Créer un webhook Stripe en production
# → Stripe Dashboard → Webhooks → Add endpoint
# → URL: https://ton-domaine.vercel.app/api/stripe/webhook
# → Events: payment_intent.succeeded, payment_intent.payment_failed, checkout.session.completed
```

---

## Sécurité

- `SUPABASE_SERVICE_ROLE_KEY` n'est jamais exposée côté client
- Toutes les routes `/api/*` vérifient la session NextAuth quand nécessaire
- Les webhooks Stripe sont systématiquement vérifiés avec `stripe.webhooks.constructEvent`
- Row Level Security (RLS) activé sur toutes les tables Supabase
- Les routes `/admin/*` vérifient `role === 'admin'` côté serveur

---

## Changelog

See [CHANGELOG.md](../CHANGELOG.md).

---

## Licence

MIT — © 2026 ChipIn

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
