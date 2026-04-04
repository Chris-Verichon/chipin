# ChipIn — Roadmap & Git Branching Strategy

## Branches principales

```
main          → production (Vercel, stable)
develop       → intégration continue (base de travail)
```

> **Règle** : on ne pousse jamais directement sur `main`. Chaque feature passe par `develop` via Pull Request.

---

## Naming convention

| Type        | Pattern                        | Exemple                            |
|-------------|--------------------------------|------------------------------------|
| Feature     | `feature/nom-court`            | `feature/auth-google`              |
| Fix         | `fix/description`              | `fix/webhook-signature`            |
| Chore       | `chore/description`            | `chore/env-setup`                  |
| Release     | `release/vX.X`                 | `release/v1.0`                     |

---

## Convention de commits (Conventional Commits)

```
feat:     nouvelle fonctionnalité
fix:      correction de bug
chore:    config, setup, outillage
style:    UI / CSS (aucun changement logique)
refactor: restructuration sans changement comportemental
test:     ajout / modification de tests
docs:     documentation uniquement
```

**Exemples :**
```
feat(auth): add Google OAuth with role-based access
feat(cagnotte): add creation modal with Stripe 4.99€ checkout
fix(webhook): verify Stripe signature before processing
chore: init Next.js project with Tailwind and Supabase
```

---

## Plan complet — Branch par branch

### Phase 1 — Fondations

#### `chore/project-init`
> Initialisation du projet Next.js 14 + dépendances

**Commits :**
```
chore: init Next.js 14 with TypeScript, Tailwind, App Router
chore: install dependencies (supabase, stripe, next-auth, resend)
chore: setup .env.local template and .gitignore
chore: configure tsconfig and tailwind.config
```
→ Merge into `develop`

---

#### `chore/supabase-schema`
> Structure de la base de données Supabase

**Commits :**
```
chore(db): create cagnottes table with RLS policies
chore(db): create participations table with indexes
chore(db): create users table with role field (admin/creator)
chore(db): create cagnotte_fees table (traçabilité des 4.99€)
chore(db): add supabase client (service role)
```
→ Merge into `develop`

---

### Phase 2 — Authentification & Rôles

#### `feature/auth-google`
> Connexion Google OAuth via NextAuth.js + gestion des rôles

**Commits :**
```
feat(auth): configure NextAuth with Google provider
feat(auth): persist user in Supabase on first login (role: creator)
feat(auth): add role field to session (admin / creator)
feat(auth): create middleware to protect /dashboard and /admin routes
style(auth): add login page and Google sign-in button
```
→ Merge into `develop`

---

### Phase 3 — Création de cagnotte (flow payant)

#### `feature/cagnotte-creation`
> Modal création + Stripe Checkout 4.99€ + webhook → création BDD

**Commits :**
```
feat(cagnotte): add creation modal (titre, description, objectif)
feat(cagnotte): POST /api/stripe/creation-checkout — Stripe Checkout Session 4.99€
feat(cagnotte): pass cagnotte metadata in Stripe Checkout Session
feat(cagnotte): handle checkout.session.completed webhook → insert cagnotte in DB
feat(cagnotte): redirect to /dashboard?creation=success after payment
style(cagnotte): success toast on dashboard after cagnotte created
```
→ Merge into `develop`

---

### Phase 4 — Page publique & Participation

#### `feature/cagnotte-public-page`
> Page publique visible par tous + formulaire de don anonyme

**Commits :**
```
feat(public): create /cagnotte/[slug] public page
feat(public): display progress bar, goal, participants list
feat(public): add ParticipationForm (nom, email, montant, message)
feat(public): POST /api/stripe/checkout — create PaymentIntent for participation
feat(public): integrate Stripe Elements in participation form
feat(public): create /cagnotte/[slug]/succes confirmation page
```
→ Merge into `develop`

---

### Phase 5 — Webhook Stripe & Paiements

#### `feature/stripe-webhooks`
> Gestion unifiée des webhooks (participation + frais création)

**Commits :**
```
feat(webhook): setup POST /api/stripe/webhook route
feat(webhook): verify Stripe signature (constructEvent)
feat(webhook): handle payment_intent.succeeded → mark participation as 'payé'
feat(webhook): handle payment_intent.payment_failed → mark as 'échoué'
feat(webhook): handle checkout.session.completed → create cagnotte from metadata
fix(webhook): add raw body parser for Stripe signature verification
```
→ Merge into `develop`

---

### Phase 6 — Dashboard Créateur

#### `feature/dashboard-creator`
> Interface privée du créateur pour gérer ses cagnottes

**Commits :**
```
feat(dashboard): create /dashboard protected page
feat(dashboard): list creator's cagnottes with stats (total collecté, nb participants)
feat(dashboard): add copy link button for each cagnotte
feat(dashboard): add cagnotte status (active / archivée)
style(dashboard): responsive dashboard layout with Tailwind
```
→ Merge into `develop`

---

### Phase 7 — Dashboard Admin

#### `feature/admin-dashboard`
> Section stats visible uniquement pour le rôle admin (toi)

**Commits :**
```
feat(admin): create /admin protected page (role: admin only)
feat(admin): display global stats — total cagnottes, total collecté, revenus frais
feat(admin): display recent participations table
feat(admin): display creators list with their cagnottes count
feat(admin): add GET /api/admin/stats server route
style(admin): clean admin layout with charts (Recharts)
```
→ Merge into `develop`

---

### Phase 8 — Polish & Production

#### `chore/ui-setup`
> Installation et configuration shadcn/ui + dark mode

**Commits :**
```
chore(ui): init shadcn/ui with neutral theme and CSS variables
chore(ui): install components (button, card, dialog, input, badge, progress, toast)
chore(ui): configure next-themes provider for dark mode
feat(ui): add ThemeToggle component (sun/moon icon)
feat(ui): apply dark mode classes on layout root
```
→ Merge into `develop` *(à faire juste après project-init)*

---

#### `feature/ui-polish`
> Finitions UI, SEO, responsive — style cohérent shadcn sur toutes les pages

**Commits :**
```
style: add homepage hero with CTA "Créer une cagnotte"
style: use shadcn Card, Badge, Progress on cagnotte public page
style: use shadcn Dialog for cagnotte creation modal
style: use shadcn Toast for success/error notifications
style: add loading skeletons on data fetch (shadcn Skeleton)
style: mobile responsive polish (dashboard, public page)
feat(seo): add dynamic OG meta tags per cagnotte page
chore: add favicon and app metadata
```
→ Merge into `develop`

---

#### `release/v1.0`
> Branche de release — tests finaux avant production

**Commits :**
```
chore(release): bump version to 1.0.0
fix: last-minute fixes from staging review
docs: update README with deploy instructions
```
→ Merge into `main` + tag `v1.0.0`

---

## Vue d'ensemble du flow

```
chore/project-init ──────────────────────────────────────────────────────┐
chore/supabase-schema ───────────────────────────────────────────────────┤
feature/auth-google ─────────────────────────────────────────────────────┤
feature/cagnotte-creation ───────────────────────────────────────────────┤──→ develop ──→ release/v1.0 ──→ main (tag v1.0.0)
feature/cagnotte-public-page ────────────────────────────────────────────┤
feature/stripe-webhooks ─────────────────────────────────────────────────┤
feature/dashboard-creator ───────────────────────────────────────────────┤
feature/admin-dashboard ─────────────────────────────────────────────────┤
feature/ui-polish ───────────────────────────────────────────────────────┘
```

---

## Schema BDD final

```
users
├── id (UUID)
├── google_id (TEXT UNIQUE)
├── email (TEXT)
├── nom (TEXT)
├── role (TEXT) ← 'admin' | 'creator'
└── created_at

cagnottes
├── id (UUID)
├── slug (TEXT UNIQUE)
├── titre (TEXT)
├── description (TEXT)
├── objectif (DECIMAL)
├── organisateur_id → users.id
├── stripe_checkout_session_id ← session du paiement 4.99€
└── created_at

participations
├── id (UUID)
├── cagnotte_id → cagnottes.id
├── participant_nom (TEXT)
├── participant_email (TEXT)
├── montant (DECIMAL)
├── message (TEXT)
├── stripe_payment_intent_id (TEXT UNIQUE)
├── statut ← 'en_attente' | 'payé' | 'échoué'
└── created_at

cagnotte_fees  ← traçabilité des revenus 4.99€
├── id (UUID)
├── creator_id → users.id
├── stripe_checkout_session_id (TEXT UNIQUE)
├── montant (DECIMAL) ← 4.99
├── statut ← 'payé'
└── created_at
```

---

## Ordre de travail recommandé

1. `chore/project-init` → setup du projet
2. `chore/ui-setup` → shadcn/ui + dark mode *(fondation visuelle, avant tout le reste)*
3. `chore/supabase-schema` → base de données
4. `feature/auth-google` → authentification (tout repose dessus)
5. `feature/stripe-webhooks` → webhooks (partagé par phases 3 et 4)
6. `feature/cagnotte-creation` → flow créateur
7. `feature/cagnotte-public-page` → page publique + dons
8. `feature/dashboard-creator` → dashboard
9. `feature/admin-dashboard` → stats admin
10. `feature/ui-polish` → finitions style shadcn + SEO
11. `release/v1.0` → production
