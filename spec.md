# 🎁 Cagnotte App — Stack Next.js + Stripe + Supabase

## Stack technique
- **Next.js 14** (App Router)
- **Stripe** — paiements CB
- **Supabase** — base de données PostgreSQL
- **NextAuth.js** — Google OAuth
- **Tailwind CSS** — styles
- **shadcn/ui** — composants UI (Button, Modal, Card, Input, Toast, Badge...)
- **next-themes** — dark mode (système + toggle manuel)
- **Lucide React** — icônes (inclus avec shadcn/ui)
- **Recharts** — graphiques dashboard admin
- **Resend** — emails (optionnel)

---

## Setup en 4 étapes

### 1. Créer le projet

```bash
npx create-next-app@latest chipin --typescript --tailwind --app
cd chipin
npm install @supabase/supabase-js stripe @stripe/stripe-js next-auth resend next-themes recharts

# Initialiser shadcn/ui
npx shadcn@latest init
# Puis installer les composants utilisés :
npx shadcn@latest add button card input label dialog badge progress toast separator avatar dropdown-menu
```

### 2. Supabase — Créer la base de données

Crée un projet sur [supabase.com](https://supabase.com) puis exécute ce SQL dans l'éditeur :

```sql
-- Table des cagnottes
CREATE TABLE cagnottes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titre TEXT NOT NULL,
  description TEXT,
  objectif DECIMAL(10,2),
  organisateur_id TEXT NOT NULL,  -- Google user ID
  organisateur_email TEXT NOT NULL,
  organisateur_nom TEXT,
  stripe_account_id TEXT,         -- Stripe Connect (optionnel)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des participations
CREATE TABLE participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cagnotte_id UUID REFERENCES cagnottes(id) ON DELETE CASCADE,
  participant_nom TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  message TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  statut TEXT DEFAULT 'en_attente', -- 'en_attente' | 'payé' | 'remboursé'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les lookups fréquents
CREATE INDEX idx_cagnottes_slug ON cagnottes(slug);
CREATE INDEX idx_participations_cagnotte ON participations(cagnotte_id);
CREATE INDEX idx_participations_payment ON participations(stripe_payment_intent_id);

-- RLS (Row Level Security)
ALTER TABLE cagnottes ENABLE ROW LEVEL SECURITY;
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;

-- Lecture publique des cagnottes
CREATE POLICY "Lecture publique cagnottes" ON cagnottes FOR SELECT USING (true);
CREATE POLICY "Lecture publique participations payées" ON participations FOR SELECT USING (statut = 'payé');

-- Écriture via service role uniquement (API Next.js)
CREATE POLICY "Service role full access cagnottes" ON cagnottes USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access participations" ON participations USING (auth.role() = 'service_role');
```

### 3. Variables d'environnement

Crée un fichier `.env.local` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Clé service (pas la clé anon)

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NextAuth / Google OAuth
NEXTAUTH_SECRET=un-secret-random-fort
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Comment obtenir ces clés :**
- **Supabase** : Settings → API → `service_role` key
- **Stripe** : Dashboard → Developers → API keys
- **Google OAuth** : [console.cloud.google.com](https://console.cloud.google.com) → Credentials → OAuth 2.0 Client IDs (Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`)

### 4. Lancer le projet

```bash
npm run dev
```

Pour tester les webhooks Stripe en local :
```bash
# Installer Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copier le webhook secret affiché dans STRIPE_WEBHOOK_SECRET
```

---

## Déploiement sur Vercel

```bash
# 1. Push sur GitHub
git add . && git commit -m "init" && git push

# 2. Importer sur vercel.com
# → New Project → Import GitHub repo

# 3. Ajouter toutes les variables d'environnement dans Vercel
# (Settings → Environment Variables)

# 4. Changer NEXT_PUBLIC_APP_URL par ton URL Vercel
# Ex: https://ma-cagnotte.vercel.app

# 5. Créer un webhook Stripe en production
# → Stripe Dashboard → Webhooks → Add endpoint
# → URL: https://ma-cagnotte.vercel.app/api/stripe/webhook
# → Events: payment_intent.succeeded, payment_intent.payment_failed
```

---

## Architecture des fichiers

```
app/
├── page.tsx                          # Homepage (créer une cagnotte)
├── dashboard/page.tsx                # Mes cagnottes (protégé, Google OAuth)
├── cagnotte/[slug]/page.tsx          # Page publique de la cagnotte
├── cagnotte/[slug]/succes/page.tsx   # Page de confirmation après paiement
├── api/
│   ├── auth/[...nextauth]/route.ts   # NextAuth Google OAuth
│   ├── cagnottes/route.ts            # POST — créer une cagnotte
│   ├── stripe/
│   │   ├── checkout/route.ts         # POST — créer un PaymentIntent
│   │   └── webhook/route.ts          # POST — webhook Stripe (marquer payé)
│   └── participations/[id]/route.ts  # GET — détails d'une participation
lib/
├── supabase.ts                       # Client Supabase (service role)
├── stripe.ts                         # Client Stripe
└── auth.ts                           # Config NextAuth
components/
├── ui/                               # Composants shadcn/ui (auto-générés)
├── CagnotteForm.tsx                  # Formulaire création cagnotte (Dialog shadcn)
├── ParticipationForm.tsx             # Formulaire participation + Stripe Elements
├── ProgressBar.tsx                   # Barre de progression (Progress shadcn)
├── ParticipantList.tsx               # Liste des participants
├── ThemeToggle.tsx                   # Bouton dark/light mode
└── AdminChart.tsx                    # Graphiques Recharts pour /admin
```

---

## Flux de paiement

```
Participant ouvre la page cagnotte
    → Remplit son nom, email, montant, message
    → POST /api/stripe/checkout → crée PaymentIntent + row en BDD (statut: en_attente)
    → Stripe Elements affiche le formulaire CB
    → Paiement CB confirmé côté Stripe
    → Stripe envoie webhook → POST /api/stripe/webhook
    → On vérifie la signature + on met à jour statut → 'payé'
    → Redirect vers /cagnotte/[slug]/succes
```

---

## Notes importantes

### Stripe et la réception d'argent
Par défaut avec Stripe, **toi** (le développeur) reçois l'argent sur ton compte Stripe.
Pour que chaque organisateur reçoive l'argent directement → utiliser **Stripe Connect** (plus complexe).

**Option simple recommandée** : un seul compte Stripe (le tien), tu vires manuellement à l'organisateur. Pour 30 personnes c'est largement suffisant.

### Frais Stripe
- ~1.5% + 0.25€ par transaction en Europe
- Pas d'abonnement mensuel
- Mode test gratuit et illimité

### Sécurité
- Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté client
- Toujours vérifier la signature des webhooks Stripe (`stripe.webhooks.constructEvent`)
- Les routes `/api/*` vérifient la session NextAuth quand nécessaire
