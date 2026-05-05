# Changelog

All notable changes to ChipIn will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

*Nothing pending.*

---

## [1.7.0] — Open Graph previews — 2026-05-05

### Added
- `app/cagnotte/[slug]/opengraph-image.tsx` — dynamic OG image (1200×630) generated per fundraiser via Next.js `ImageResponse`; displays the fundraiser title, description, and amount raised
- `public/OG.png` — static fallback OG image used for all global pages (home, about, login)

### Changed
- `app/layout.tsx` — added `openGraph.images` and `twitter.images` pointing to `/OG.png` as the global fallback
- `app/cagnotte/[slug]/page.tsx` — upgraded `twitter.card` from `"summary"` to `"summary_large_image"` to enable rich previews on X/Twitter

---

## [1.6.0] — Legal pages — 2026-05-05

### Added
- `components/AProposTabs.tsx` — client component with 4 tabs embedded in the `/a-propos` page: **About**, **Legal notice**, **Privacy policy (GDPR)**, **Terms of Service**
- `components/ui/tabs.tsx` — shadcn/ui Tabs component installed

### Changed
- `app/a-propos/page.tsx` — page restructured around the `AProposTabs` component; inline content replaced by tabbed layout
- Legal notice (LCEN art. 6 III), privacy policy (GDPR) and Terms of Service are now all accessible from a single URL (`/a-propos`)
- Unified typography across all tabs (`text-3xl` headings, `text-base` body text)
- Per-tab color accents: indigo (legal notice), violet (privacy), emerald (terms)

---

## [1.5.0] — SEO & metadata — 2026-05-04

### Added
- `app/robots.ts` — generates `/robots.txt` via Next.js: allows `/` and `/a-propos`, blocks `/dashboard`, `/admin`, `/api`, `/login`, `/cagnotte`
- `app/sitemap.ts` — generates `/sitemap.xml` with the two public pages (`/` and `/a-propos`)
- `docs_skipped/image.md` — JSX template to generate the Open Graph image via og-playground.vercel.app

### Changed
- `app/layout.tsx` — enriched metadata: `metadataBase`, title template (`%s | ChipIn`), French description, keywords, full Open Graph, Twitter Card, explicit robots directive
- `app/a-propos/page.tsx` — added dedicated `metadata` export (title + description + openGraph)
- `app/page.tsx` — added `WebApplication` JSON-LD block (schema.org) to help Google understand the app

---

## [1.4.0] — Integrated Stripe flow + Fund withdrawal — 2026-04-15

### Added
- `app/api/stripe/dashboard-link/route.ts` — generates a one-time Stripe Express dashboard login link so creators can manage payouts and withdraw funds directly from ChipIn
- **"Retirer mes fonds"** button in the dashboard Stripe-connected banner, linking to the Express dashboard
- `connect=missing` query-param banner on the dashboard for edge-case redirects

### Changed
- `app/api/stripe/connect/route.ts` — switched account creation from `type: "standard"` to `type: "express"` (enables programmatic login links and a controlled payout experience)
- `components/CagnotteForm.tsx` — now accepts a `stripeConnected` boolean prop; when Stripe is not linked, the "Nouvelle cagnotte" dialog shows a guided **Step 0** (connect Stripe first) instead of the form, eliminating the dead-end where creators could try to create a fundraiser without a payout account
- `app/dashboard/page.tsx` — passes `stripeConnected` to `CagnotteForm`; Stripe-connected banner is now a flex row with the withdraw action; handles `connect=missing` status

---

## [1.3.0] — About page + Navigation — 2026-04-15

### Added
- `app/a-propos/page.tsx` — new "About" page presenting ChipIn's mission, four feature cards (Speed, Secure payments, Openness, Privacy), and a contact section
- "À propos" navigation link added to all page headers: home, `/cagnotte/[slug]`, `/cagnotte/[slug]/succes`, `/dashboard`, `/dashboard/cagnotte/[id]`, `/dashboard/guide`, and `/admin`

### Fixed
- `app/api/stripe/checkout/route.ts` — removed unused `@ts-expect-error` directive (TypeScript lint warning)

### Changed
- `supabase/schema.sql` — added `stripe_account_id TEXT` column to `users` table to align the reference schema with the v1.1.0 migration

---

## [1.2.0] — UI Polish + i18n — 2026-04-14

### Added
- Colored icon badges on feature cards (emerald, violet, orange) with tinted backgrounds
- Hover lift effect + shadow on feature cards
- Glassmorphism (`backdrop-blur-sm`, `bg-card/50`) on feature cards

### Changed
- **Login page** — fully translated to French
- Feature cards layout centered (icon, title, description aligned center)
- Cards use `rounded-2xl` for softer appearance

---

## [1.1.0] — Stripe Connect + UX — 2026-04-07

### Added
- **Stripe Connect** — creators can link their Stripe account from the dashboard; contributions are routed directly to their account via `transfer_data.destination` + `application_fee_amount`
- `app/api/stripe/connect/route.ts` — creates a Stripe Standard account and generates an Account Links onboarding URL
- `app/api/stripe/connect/callback/route.ts` — fallback redirect after onboarding
- `components/DashboardSearch.tsx` — accessible combobox search bar (ARIA `combobox`/`listbox`/`option`, keyboard navigation ↑↓ Enter Escape) in the dashboard header, desktop only
- `app/dashboard/guide/page.tsx` — creator guide page explaining the full flow (Stripe Connect → create → share → receive → withdraw), with dynamic fee percentage from `PLATFORM_FEE_PERCENT`
- `docs_skipped/CONNECT.md` — Stripe Connect setup guide
- `PLATFORM_FEE_PERCENT` env variable — platform commission per contribution in % (default: `5`)
- `scripts.dev:stripe` in `package.json` — shortcut for `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Changed
- **Checkout flow** — replaced `PaymentIntent` + `stripe.confirmPayment()` (broken, no card fields) with a hosted **Checkout Session**; `ParticipationForm` now redirects via `window.location.href`
- **Webhook** — contributions created directly as `paid` via `checkout.session.completed`; `payment_intent.succeeded/failed` handlers removed
- **Webhook idempotency** — duplicate key errors (`23505`) silently ignored on `participations` and `cagnottes` inserts to handle Stripe retries
- **Webhook** — added `payment_status !== "paid"` guard on contribution handling
- `app/cagnotte/[slug]/page.tsx` — fixed `p.amount / 100` bug (amount stored in euros); total raised turns `text-green-700` when > 0
- `app/cagnotte/[slug]/succes/page.tsx` — success heading updated
- `app/dashboard/page.tsx` — Stripe Connect banners; connect Stripe CTA; active badge green/white; stats grid responsive below 430px
- `lib/database.types.ts` — added `stripe_account_id` to `users` types

### Fixed
- Removed deprecated `export const config = { api: { bodyParser: false } }` from webhook route (Next.js App Router warning)

### Migration SQL required
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_account_id TEXT UNIQUE;
```

---

## [1.0.0] — Production Release — 2026-04-04

### Summary
First stable release of ChipIn. All features complete, accessibility audited, admin monitoring enriched.

### Changed
- Version bumped to `1.0.0`
- `README.md` — complete production deployment guide (Vercel + Supabase migrations + Stripe production webhooks)

---

## [0.10.0] — UI Polish + Accessibility + Animations + Admin Monitoring — 2026-04-04

### Added
- `components/SignOutButton.tsx` — client component with `signOut({ callbackUrl: "/" })` from next-auth/react
- `app/not-found.tsx` — custom 404 page
- `app/dashboard/loading.tsx` — skeleton loading state for dashboard
- `app/cagnotte/[slug]/loading.tsx` — skeleton loading state for public fundraiser page
- `app/admin/loading.tsx` — skeleton loading state for admin dashboard
- `supabase/add_login_events.sql` — migration SQL: table `login_events(id, user_id, created_at)` with RLS (service role only) and indexes
- `lib/database.types.ts` — added `login_events` table type

### Updated
- `app/layout.tsx` — added skip link for keyboard navigation (WCAG 2.4.1)
- `app/page.tsx` — `id="main-content"`; landing hero + feature cards now animate in with `animate-in fade-in-0 slide-in-from-bottom` and staggered delays (tw-animate-css)
- `app/dashboard/page.tsx` — added sign out button in header; `id="main-content"`; `role="progressbar"` + `aria-value*` on progress bars
- `app/admin/page.tsx` — added sign out button in header; `id="main-content"`; `scope="col"` on `<th>`; `overflow-x-auto` on tables; new "This month" KPI row (monthly + yearly revenue, new users, fundraisers created, conversion rate, total + unique logins); user growth AreaChart side-by-side with contributions chart
- `app/cagnotte/[slug]/page.tsx` — Open Graph + Twitter card meta tags; `id="main-content"`; `role="progressbar"` on progress bar
- `app/cagnotte/[slug]/succes/page.tsx` — `id="main-content"` on `<main>`
- `app/dashboard/cagnotte/[id]/page.tsx` — `id="main-content"`; `role="progressbar"`; `scope="col"` on `<th>`; `overflow-x-auto` on table
- `components/ThemeToggle.tsx` — `aria-hidden="true"` on Sun/Moon icons
- `components/SignOutButton.tsx` — `aria-label` instead of `title` on button; `aria-hidden` on icon
- `components/AdminCharts.tsx` — added `userGrowthData` prop + `growthOnly` mode for user growth AreaChart; `role="img"` + `aria-label` on both chart wrappers
- `components/ParticipationForm.tsx` — `aria-pressed` on quick-pick amount buttons; `aria-required` on name field; sr-only required fields note
- `app/api/auth/[...nextauth]/route.ts` — `signIn` callback now inserts a row in `login_events` on every Google login

---

## [0.9.0] — Admin Dashboard — 2026-04-04

### Added
- `app/admin/page.tsx` — full admin dashboard: KPI cards (users, fundraisers, contributions, fee revenue), area chart (contributions/30 days), top fundraisers table, recent users table
- `components/AdminCharts.tsx` — Recharts `AreaChart` with CSS variable theming (dark mode compatible)
- `app/api/admin/users/[id]/role/route.ts` — PATCH endpoint to promote/demote users (admin only, cannot demote self)

### Updated
- `app/dashboard/page.tsx` — added "Admin" link in header (visible to admin role only)

---

## [0.8.0] — Creator Dashboard — 2026-04-04

### Added
- `app/dashboard/cagnotte/[id]/page.tsx` — per-fundraiser management page: stats, full participants table (with emails), close/reopen toggle, copy public link
- `app/api/cagnotte/[id]/toggle/route.ts` — PATCH endpoint to toggle `is_active` (owner or admin only)
- `components/ToggleActiveButton.tsx` — client button to close/reopen a fundraiser
- `components/CopyLinkButton.tsx` — client button to copy the public link to clipboard

### Updated
- `app/dashboard/page.tsx` — added global stats bar (total raised, total contributions, active fundraisers) + manage link per card

---

## [0.7.0] — Public Fundraiser Page — 2026-04-04

### Added
- `app/cagnotte/[slug]/page.tsx` — public fundraiser page: title, progress bar, participants list, contribution form
- `app/cagnotte/[slug]/succes/page.tsx` — payment success confirmation page
- `components/ParticipationForm.tsx` — contribution form with quick-pick amounts, anonymous checkbox, email, message
- `app/page.tsx` — landing page with hero section and feature cards (replaces default Next.js template)
- `app/api/stripe/checkout/route.ts` updated to return `slug` alongside `clientSecret`
- `components/ui/checkbox.tsx` added via shadcn CLI

---

## [0.6.0] — Fundraiser Creation — 2026-04-04

### Added
- `components/CagnotteForm.tsx` — shadcn Dialog modal with title, description, goal + create button (€4.99)
- `components/CreationBanner.tsx` — success/cancelled banner dismisses after 5 s and clears query params
- `app/dashboard/page.tsx` — creator dashboard listing all fundraisers with progress bars
- `total_raised INTEGER` column added to `cagnottes` table (stores cents)
- `increment_total_raised` PostgreSQL RPC function for atomic counter increment
- `supabase/schema.sql` updated with new column + RPC
- `lib/database.types.ts` updated with `total_raised` and `increment_total_raised` RPC type
- `app/api/stripe/webhook/route.ts` updated to call RPC on `payment_intent.succeeded`
- `date-fns` installed for relative date formatting
- `components/ui/textarea.tsx` added via shadcn CLI

---

## [0.5.0] — Stripe Webhooks — 2026-04-04

### Added
- `app/api/stripe/webhook/route.ts` — unified webhook handler
  - `payment_intent.succeeded` → marks participation as `paid`
  - `payment_intent.payment_failed` → marks participation as `failed`
  - `checkout.session.completed` → creates fundraiser + fee record from metadata
  - Stripe signature verification on every request
- `app/api/stripe/checkout/route.ts` — creates PaymentIntent + pending participation row
- `app/api/stripe/creation-checkout/route.ts` — creates €4.99 Stripe Checkout Session with fundraiser metadata
- `nanoid` installed for collision-resistant slug generation

---

## [0.4.0] — Google Auth — 2026-04-04

### Added
- `app/api/auth/[...nextauth]/route.ts` — NextAuth v4 with Google provider
  - Auto-upserts user in Supabase on every login
  - Auto-promotes user to `admin` if email matches `ADMIN_EMAIL` env var
  - Attaches `id` and `role` to the session via JWT callback
- `lib/auth.ts` — typed `getServerSession` helper for server components and API routes
- `types/next-auth.d.ts` — session type augmentation (`id`, `role`)
- `middleware.ts` — route protection for `/dashboard` and `/admin`, admin-only guard
- `app/login/page.tsx` — login page with Google sign-in button (shadcn Card)

### Fixed
- `lib/database.types.ts` — added required `Views`, `Functions`, `Enums`, `CompositeTypes` fields for supabase-js v2 compatibility

---

## [0.3.0] — UI Setup — 2026-04-04

### Added
- `shadcn/ui` initialized with Tailwind v4 and CSS variables
- Components installed: `button`, `card`, `input`, `label`, `dialog`, `badge`, `progress`, `sonner`, `separator`, `avatar`, `dropdown-menu`, `skeleton`
- `components/ThemeProvider.tsx` — `next-themes` wrapper
- `components/ThemeToggle.tsx` — sun/moon icon button for dark/light toggle
- `app/layout.tsx` updated: `ThemeProvider`, `Toaster` (sonner), app metadata

---

## [0.2.0] — Database Schema — 2026-04-04

### Added
- `supabase/schema.sql` — full PostgreSQL schema with RLS policies
  - `users` table with `role` field (`admin` | `creator`)
  - `cagnottes` table (fundraisers)
  - `participations` table with status enum (`pending` | `paid` | `failed` | `refunded`)
  - `cagnotte_fees` table — tracks every €4.99 creation fee
  - Indexes on all frequent lookup columns
- `lib/database.types.ts` — TypeScript types matching the full schema
- `lib/supabase.ts` — server-side Supabase client (service role)
- `lib/stripe.ts` — Stripe client with `CREATION_FEE_AMOUNT` helper
- `COMMANDS.md` — step-by-step git command reference

---

## [0.1.0] — Project Init — 2026-04-04

### Added
- Next.js 14 with TypeScript, Tailwind CSS, App Router
- Dependencies: `@supabase/supabase-js`, `stripe`, `@stripe/stripe-js`, `next-auth`, `next-themes`, `recharts`
- `.env.local.example` template with all required variables
- `next.config.ts` configured with Google avatar image domain
- Professional `README.md` with full setup instructions
- `ROADMAP.md` — branching strategy and feature plan
- `CHANGELOG.md` — this file

---

<!-- Links (to update when repo is on GitHub) -->
[Unreleased]: https://github.com/ton-username/chipin/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ton-username/chipin/releases/tag/v0.1.0
