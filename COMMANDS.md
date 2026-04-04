# ChipIn — Git Commands

> This file is updated at each step. Run the commands below in order, then tell me when done.

---

## Current step: `chore/supabase-schema`

```bash
git add supabase/schema.sql
git commit -m "chore(db): create full database schema (users, cagnottes, participations, cagnotte_fees)"
```

```bash
git add lib/database.types.ts
git commit -m "chore(db): add TypeScript types matching database schema"
```

```bash
git add lib/supabase.ts lib/stripe.ts
git commit -m "chore(db): add Supabase and Stripe server-side clients"
```

```bash
git add package.json CHANGELOG.md COMMANDS.md
git commit -m "chore: bump version to 0.2.0 and update changelog"
```

```bash
git push --set-upstream origin chore/supabase-schema
```

---

## Next steps (upcoming)

- `chore/ui-setup` — shadcn/ui init + dark mode + ThemeToggle
- `feature/auth-google` — Google OAuth + roles
- `feature/stripe-webhooks` — Stripe webhook handler
- `feature/cagnotte-creation` — creation modal + €4.99 Stripe Checkout
- `feature/cagnotte-public-page` — public page + contribution form
- `feature/dashboard-creator` — creator dashboard
- `feature/admin-dashboard` — admin stats
- `feature/ui-polish` — final polish + SEO
- `release/v1.0` — production
