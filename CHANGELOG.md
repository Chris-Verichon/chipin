# Changelog

All notable changes to ChipIn will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### In Progress
- `feature/stripe-webhooks` — Stripe webhook handler

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
