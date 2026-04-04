# Changelog

All notable changes to ChipIn will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### In Progress
- `chore/ui-setup` — shadcn/ui + dark mode

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
