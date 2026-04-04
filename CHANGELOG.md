# Changelog

All notable changes to ChipIn will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

*Nothing pending.*

---

## [1.0.0] — Production Release — 2026-04-04

### Summary
First stable release of ChipIn. All features complete, accessibility audited, admin monitoring enriched.

### Changed
- Version bumped to `1.0.0`
- `README.md` — complete production deployment guide (Vercel + Supabase migrations + Stripe production webhooks)

---

## [0.10.0] — UI Polish + Accessibilité + Animations + Admin Monitoring — 2026-04-04

### Added
- `components/SignOutButton.tsx` — client component with `signOut({ callbackUrl: "/" })` from next-auth/react
- `app/not-found.tsx` — custom 404 page
- `app/dashboard/loading.tsx` — skeleton loading state for dashboard
- `app/cagnotte/[slug]/loading.tsx` — skeleton loading state for public fundraiser page
- `app/admin/loading.tsx` — skeleton loading state for admin dashboard
- `supabase/add_login_events.sql` — migration SQL: table `login_events(id, user_id, created_at)` with RLS (service role only) and indexes
- `lib/database.types.ts` — added `login_events` table type

### Updated
- `app/layout.tsx` — added skip link ("Passer au contenu principal") for keyboard navigation (WCAG 2.4.1)
- `app/page.tsx` — `id="main-content"`; landing hero + feature cards now animate in with `animate-in fade-in-0 slide-in-from-bottom` and staggered delays (tw-animate-css)
- `app/dashboard/page.tsx` — added sign out button in header; `id="main-content"`; `role="progressbar"` + `aria-value*` on progress bars
- `app/admin/page.tsx` — added sign out button in header; `id="main-content"`; `scope="col"` on `<th>`; `overflow-x-auto` on tables; new "Ce mois-ci" KPI row (revenus mois + année, nouveaux inscrits, cagnottes créées, taux de conversion, connexions totales + uniques); user growth AreaChart side-by-side with contributions chart
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
- `app/admin/page.tsx` — full admin dashboard: KPI cards (users, cagnottes, contributions, fee revenue), area chart (contributions/30 days), top fundraisers table, recent users table
- `components/AdminCharts.tsx` — Recharts `AreaChart` with CSS variable theming (dark mode compatible)
- `app/api/admin/users/[id]/role/route.ts` — PATCH endpoint to promote/demote users (admin only, cannot demote self)

### Updated
- `app/dashboard/page.tsx` — added "Admin" link in header (visible to admin role only)

---

## [0.8.0] — Creator Dashboard — 2026-04-04

### Added
- `app/dashboard/cagnotte/[id]/page.tsx` — per-cagnotte management page: stats, full participants table (with emails), close/reopen toggle, copy public link
- `app/api/cagnotte/[id]/toggle/route.ts` — PATCH endpoint to toggle `is_active` (owner or admin only)
- `components/ToggleActiveButton.tsx` — client button to close/reopen a fundraiser
- `components/CopyLinkButton.tsx` — client button to copy the public link to clipboard

### Updated
- `app/dashboard/page.tsx` — added global stats bar (total raised, total contributions, active cagnottes) + "Gérer" link per card

---

## [0.7.0] — Public Cagnotte Page — 2026-04-04

### Added
- `app/cagnotte/[slug]/page.tsx` — public fundraiser page: title, progress bar, participants list, contribution form
- `app/cagnotte/[slug]/succes/page.tsx` — payment success confirmation page
- `components/ParticipationForm.tsx` — contribution form with quick-pick amounts, anonymous checkbox, email, message
- `app/page.tsx` — landing page with hero section and feature cards (replaces default Next.js template)
- `app/api/stripe/checkout/route.ts` updated to return `slug` alongside `clientSecret`
- `components/ui/checkbox.tsx` added via shadcn CLI

---

## [0.6.0] — Cagnotte Creation — 2026-04-04

### Added
- `components/CagnotteForm.tsx` — shadcn Dialog modal with title, description, goal + “Créer (4,99 €)” button
- `components/CreationBanner.tsx` — success/cancelled banner dismisses after 5 s and clears query params
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
- Dependencies: `@supabase/supabase-js`, `stripe`, `@stripe/stripe-js`, `next-auth`, `resend`, `next-themes`, `recharts`
- `.env.local.example` template with all required variables
- `next.config.ts` configured with Google avatar image domain
- Professional `README.md` with full setup instructions
- `ROADMAP.md` — branching strategy and feature plan
- `CHANGELOG.md` — this file

---

<!-- Links (to update when repo is on GitHub) -->
[Unreleased]: https://github.com/ton-username/chipin/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ton-username/chipin/releases/tag/v0.1.0
