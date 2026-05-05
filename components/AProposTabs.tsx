"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, Users, Lock, Zap, Mail, Scale, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Helpers partagés ──────────────────────────────────────────────────── */

function SectionTitle({ children, color = "bg-primary" }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`h-5 w-1 rounded-full ${color}`} />
      <h3 className="text-base font-semibold">{children}</h3>
    </div>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card/50 p-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
      {children}
    </div>
  );
}

interface AProposTabsProps {
  creationFeeAmount: number; // in cents
  platformFeePercent: number;
}

export function AProposTabs({ creationFeeAmount, platformFeePercent }: AProposTabsProps) {
  const creationFeeFormatted = (creationFeeAmount / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
  return (
    <Tabs defaultValue="a-propos" className="space-y-8">
      <TabsList className="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="a-propos">À propos</TabsTrigger>
        <TabsTrigger value="mentions-legales">Mentions légales</TabsTrigger>
        <TabsTrigger value="confidentialite">Confidentialité</TabsTrigger>
        <TabsTrigger value="cgu">CGU</TabsTrigger>
      </TabsList>

      {/* ── À propos ─────────────────────────────────────────────── */}
      <TabsContent value="a-propos" className="space-y-12">
        <section className="space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight">À propos de ChipIn</h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            ChipIn est une application de cagnottes en ligne pensée pour être rapide, simple et accessible.
            Créez une cagnotte en quelques secondes, partagez un lien, et laissez vos proches contribuer
            sans qu&apos;ils aient besoin de créer un compte.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Pourquoi ChipIn ?</h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            Les solutions existantes sont souvent lourdes, avec des commissions élevées, des interfaces datées
            ou des processus d&apos;inscription contraignants pour les participants. ChipIn cherche à être
            l&apos;inverse : minimaliste, transparent, et fondé sur des outils modernes et fiables.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: <Zap className="h-5 w-5" />,
                title: "Rapide à créer",
                desc: "Une cagnotte en ligne en moins d'une minute, sans configuration complexe.",
                color: "text-yellow-500",
                bg: "bg-yellow-500/10",
              },
              {
                icon: <Banknote className="h-5 w-5" />,
                title: "Paiements sécurisés",
                desc: "Stripe gère les transactions. Aucune donnée bancaire ne transite par nos serveurs.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                icon: <Users className="h-5 w-5" />,
                title: "Ouvert à tous",
                desc: "Les participants peuvent contribuer sans créer de compte. Juste un lien.",
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
              {
                icon: <Lock className="h-5 w-5" />,
                title: "Respectueux de la vie privée",
                desc: "Les emails des participants ne sont visibles que par le créateur de la cagnotte.",
                color: "text-orange-500",
                bg: "bg-orange-500/10",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border bg-card/50 p-4 space-y-2 hover:shadow-sm transition-shadow">
                <div className={`${item.color} ${item.bg} inline-flex p-2 rounded-lg`}>{item.icon}</div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-t pt-10">
          <h3 className="text-xl font-bold tracking-tight">Contact</h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            Une question, un bug, une idée d&apos;amélioration ? N&apos;hésitez pas à écrire directement.
          </p>
          <div className="rounded-2xl border bg-card/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="font-semibold text-base">Chris Verichon</p>
            <Button render={<a href="mailto:chris.verichon@gmail.com" />} nativeButton={false}>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer un mail
            </Button>
          </div>
        </section>
      </TabsContent>

      {/* ── Mentions légales ─────────────────────────────────────── */}
      <TabsContent value="mentions-legales" className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="inline-flex p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Scale className="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Mentions légales</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed text-base">
          Conformément aux dispositions de l&apos;article 6 III de la loi n° 2004-575 du 21 juin 2004
          pour la Confiance dans l&apos;économie numérique (LCEN).
        </p>

        <section className="space-y-3">
          <SectionTitle color="bg-indigo-500">Éditeur du site</SectionTitle>
          <InfoCard>
            <p><span className="font-medium text-foreground">Nom :</span> Chris Verichon</p>
            <p><span className="font-medium text-foreground">Statut :</span> Particulier</p>
            <p>
              <span className="font-medium text-foreground">Contact :</span>{" "}
              <a href="mailto:chris.verichon@gmail.com" className="text-indigo-500 underline underline-offset-4 hover:text-indigo-400 transition-colors">
                chris.verichon@gmail.com
              </a>
            </p>
          </InfoCard>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-indigo-500">Hébergeur</SectionTitle>
          <InfoCard>
            <p><span className="font-medium text-foreground">Société :</span> Vercel Inc.</p>
            <p><span className="font-medium text-foreground">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
            <p>
              <span className="font-medium text-foreground">Site :</span>{" "}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline underline-offset-4 hover:text-indigo-400 transition-colors">
                vercel.com
              </a>
            </p>
          </InfoCard>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-indigo-500">Propriété intellectuelle</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            L&apos;ensemble du contenu de ce site (textes, images, code) est la propriété de Chris Verichon,
            sauf mention contraire. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </section>
      </TabsContent>

      {/* ── Confidentialité ──────────────────────────────────────── */}
      <TabsContent value="confidentialite" className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="inline-flex p-2 rounded-lg bg-violet-500/10 text-violet-500">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Politique de confidentialité</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed text-base">
          ChipIn s&apos;engage à protéger vos données personnelles conformément au Règlement Général
          sur la Protection des Données (RGPD — Règlement UE 2016/679).
        </p>

        <section className="space-y-3">
          <SectionTitle color="bg-violet-500">Données collectées</SectionTitle>
          <InfoCard>
            <p className="font-medium text-foreground">Créateurs de cagnottes (connexion Google)</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Nom et prénom (fournis par Google)</li>
              <li>Adresse e-mail</li>
              <li>Photo de profil</li>
              <li>Historique de connexion (date et heure)</li>
              <li>Identifiant de compte Stripe (si liaison effectuée)</li>
            </ul>
            <p className="font-medium text-foreground pt-1">Participants à une cagnotte</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Nom ou pseudonyme (saisi librement)</li>
              <li>Adresse e-mail (facultative, visible uniquement par le créateur)</li>
              <li>Message (facultatif)</li>
              <li>Montant de la contribution</li>
            </ul>
          </InfoCard>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-violet-500">Finalités et base légale</SectionTitle>
          <InfoCard>
            <p><span className="font-medium text-foreground">Exécution du contrat :</span> traitement des paiements, gestion des cagnottes et accès au dashboard.</p>
            <p><span className="font-medium text-foreground">Intérêt légitime :</span> sécurité, prévention de la fraude, statistiques agrégées anonymes.</p>
          </InfoCard>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-violet-500">Sous-traitants</SectionTitle>
          <InfoCard>
            <p><span className="font-medium text-foreground">Supabase</span> — hébergement de la base de données (serveurs en UE disponibles).</p>
            <p><span className="font-medium text-foreground">Stripe</span> — traitement des paiements (certifié PCI-DSS). ChipIn ne stocke aucune donnée bancaire.</p>
            <p><span className="font-medium text-foreground">Google</span> — authentification OAuth.</p>
            <p><span className="font-medium text-foreground">Vercel</span> — hébergement de l&apos;application.</p>
          </InfoCard>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-violet-500">Conservation</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            Les données sont conservées aussi longtemps que votre compte est actif. Sur demande, elles peuvent
            être supprimées dans un délai de 30 jours.
          </p>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-violet-500">Vos droits (RGPD)</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de portabilité
            et d&apos;opposition. Pour exercer ces droits, contactez :{" "}
            <a href="mailto:chris.verichon@gmail.com" className="text-violet-500 underline underline-offset-4 hover:text-violet-400 transition-colors">
              chris.verichon@gmail.com
            </a>
            . Vous pouvez également introduire une réclamation auprès de la{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-violet-500 underline underline-offset-4 hover:text-violet-400 transition-colors">
              CNIL
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-violet-500">Cookies</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            ChipIn n&apos;utilise que des cookies strictement nécessaires au fonctionnement du service
            (session d&apos;authentification). Aucun cookie publicitaire ou analytique tiers n&apos;est déposé.
          </p>
        </section>
      </TabsContent>

      {/* ── CGU ──────────────────────────────────────────────────── */}
      <TabsContent value="cgu" className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="inline-flex p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Conditions Générales d&apos;Utilisation</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed text-base">
          En utilisant ChipIn, vous acceptez les présentes CGU. Dernière mise à jour : mai 2026.
        </p>

        <section className="space-y-3">
          <SectionTitle color="bg-emerald-500">1. Objet</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            ChipIn est une plateforme permettant à des créateurs d&apos;ouvrir des cagnottes en ligne et
            de collecter des contributions par carte bancaire. ChipIn agit en tant qu&apos;intermédiaire
            technique et ne saurait être tenu responsable du contenu des cagnottes.
          </p>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-emerald-500">2. Inscription et compte</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            La création d&apos;une cagnotte nécessite une inscription via Google OAuth. Vous êtes responsable
            de la confidentialité de votre compte. Les participants peuvent contribuer sans inscription.
          </p>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-emerald-500">3. Frais et commissions</SectionTitle>
          <InfoCard>
            <p><span className="font-medium text-foreground">Frais de création :</span> {creationFeeFormatted} par cagnotte créée, prélevés lors de la création.</p>
            <p><span className="font-medium text-foreground">Commission sur contributions :</span> {platformFeePercent} % de chaque contribution, prélevés automatiquement par la plateforme.</p>
            <p><span className="font-medium text-foreground">Frais Stripe :</span> des frais de traitement bancaire s&apos;appliquent selon les tarifs Stripe en vigueur.</p>
          </InfoCard>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-emerald-500">4. Paiements</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            Les paiements sont traités par Stripe. ChipIn ne stocke aucune donnée bancaire. Les fonds collectés
            sont versés directement sur le compte Stripe Connect du créateur, sous réserve de validation par Stripe.
          </p>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-emerald-500">5. Contenu interdit</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            Il est interdit d&apos;utiliser ChipIn pour collecter des fonds à des fins illégales, frauduleuses,
            ou contraires à l&apos;ordre public. ChipIn se réserve le droit de clôturer toute cagnotte
            ne respectant pas ces règles, sans remboursement des frais de création.
          </p>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-emerald-500">6. Responsabilité</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            ChipIn met à disposition une infrastructure technique. La responsabilité de ChipIn ne saurait
            être engagée en cas d&apos;interruption de service, de litige entre créateur et participants,
            ou de défaillance de services tiers (Stripe, Supabase, Vercel).
          </p>
        </section>

        <section className="space-y-3">
          <SectionTitle color="bg-emerald-500">7. Droit applicable</SectionTitle>
          <p className="text-muted-foreground text-base leading-relaxed">
            Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français
            seront seuls compétents.
          </p>
        </section>
      </TabsContent>
    </Tabs>
  );
}
