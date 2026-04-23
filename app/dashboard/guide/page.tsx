import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide créateur — ChipIn",
};

export default async function GuidePage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const platformFeePercent = parseFloat(process.env.PLATFORM_FEE_PERCENT ?? "5");
  const exampleAmount = 50;
  const stripeFee = 0.015 * exampleAmount + 0.25;
  const platformFee = (platformFeePercent / 100) * exampleAmount;
  const netAmount = (exampleAmount - stripeFee - platformFee).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">ChipIn</span>
            <Badge className="bg-slate-100/80 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-0 capitalize">{session.user.role}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session.user.email}
            </span>
            <Link
              href="/a-propos"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
            >
              À propos
            </Link>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Tableau de bord
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Guide créateur</h1>
          <p className="text-muted-foreground mt-2">
            Tout ce qu&apos;il faut savoir pour créer votre cagnotte, recevoir des contributions et retirer vos fonds.
          </p>
        </div>

        <Separator />

        {/* Étape 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
            <h2 className="text-xl font-semibold">Connecter votre compte Stripe</h2>
          </div>
          <div className="ml-11 space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              Avant de pouvoir recevoir des paiements, vous devez connecter un compte Stripe. C&apos;est gratuit et prend moins de 5 minutes.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-2">
              <li>Depuis votre tableau de bord, cliquez sur <strong className="text-foreground">Connecter Stripe</strong>.</li>
              <li>Stripe vous guide pour créer ou lier un compte existant.</li>
              <li>Renseignez vos informations personnelles et bancaires (nom, IBAN, etc.).</li>
              <li>Une fois validé, vous revenez automatiquement sur votre tableau de bord avec la confirmation.</li>
            </ol>
            <p className="pt-1">
              Sans compte Stripe connecté, les contributions seront quand même collectées mais les fonds resteront sur le compte de la plateforme jusqu&apos;à ce que vous connectiez votre compte.
            </p>
          </div>
        </section>

        <Separator />

        {/* Étape 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
            <h2 className="text-xl font-semibold">Créer votre première cagnotte</h2>
          </div>
          <div className="ml-11 space-y-2 text-sm text-muted-foreground leading-relaxed">
            <ol className="list-decimal list-inside space-y-1.5 pl-2">
              <li>Cliquez sur <strong className="text-foreground">Nouvelle cagnotte</strong> depuis votre tableau de bord.</li>
              <li>Renseignez un titre, une description (optionnelle) et un objectif en euros (optionnel).</li>
              <li>Validez et procédez au paiement des frais de création de <strong className="text-foreground">4,99 €</strong>.</li>
              <li>Votre cagnotte est créée instantanément après le paiement.</li>
            </ol>
            <p className="pt-1">
              Les frais de création sont uniques et couvrent l&apos;hébergement et la gestion de votre collecte.
            </p>
          </div>
        </section>

        <Separator />

        {/* Étape 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
            <h2 className="text-xl font-semibold">Partager votre cagnotte</h2>
          </div>
          <div className="ml-11 space-y-2 text-sm text-muted-foreground leading-relaxed">
            <ol className="list-decimal list-inside space-y-1.5 pl-2">
              <li>Depuis votre tableau de bord, cliquez sur <strong className="text-foreground">Voir</strong> à côté de votre cagnotte.</li>
              <li>Copiez le lien de la page et partagez-le par message, email ou réseaux sociaux.</li>
              <li>Vos proches peuvent contribuer directement depuis la page sans avoir besoin d&apos;un compte.</li>
            </ol>
          </div>
        </section>

        <Separator />

        {/* Étape 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
            <h2 className="text-xl font-semibold">Recevoir les contributions</h2>
          </div>
          <div className="ml-11 space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              Chaque contribution est traitée par Stripe et versée directement sur votre compte Stripe connecté. Les frais Stripe s&apos;élèvent à environ <strong className="text-foreground">1,5 % + 0,25 €</strong> par transaction (tarif européen).
            </p>
            <p>
              Une commission de plateforme de <strong className="text-foreground">{platformFeePercent} %</strong> est prélevée automatiquement sur <strong className="text-foreground">chaque contribution</strong>.
            </p>
            <p>
              Exemple : pour une contribution de <strong className="text-foreground">{exampleAmount} €</strong>, vous recevez environ <strong className="text-foreground">{netAmount} €</strong> net (après frais Stripe + commission plateforme).
            </p>
          </div>
        </section>

        <Separator />

        {/* Étape 5 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">5</span>
            <h2 className="text-xl font-semibold">Retirer les fonds sur votre compte bancaire</h2>
          </div>
          <div className="ml-11 space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              Les fonds collectés arrivent sur votre <strong className="text-foreground">solde Stripe</strong>. Stripe effectue des virements automatiques vers votre IBAN selon le calendrier que vous avez configuré (quotidien, hebdomadaire ou manuel).
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-2">
              <li>Connectez-vous sur <strong className="text-foreground">dashboard.stripe.com</strong>.</li>
              <li>Allez dans <strong className="text-foreground">Solde</strong> → <strong className="text-foreground">Virements</strong>.</li>
              <li>Vous pouvez déclencher un virement manuel ou configurer les virements automatiques.</li>
              <li>Les virements arrivent sous <strong className="text-foreground">2 à 7 jours ouvrés</strong> selon votre banque.</li>
            </ol>
            <p className="pt-1">
              Pour modifier votre IBAN ou la fréquence des virements : <strong className="text-foreground">Paramètres → Informations bancaires</strong> dans votre dashboard Stripe.
            </p>
          </div>
        </section>

        <Separator />

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Questions fréquentes</h2>
          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Puis-je fermer ma cagnotte ?</p>
              <p className="text-muted-foreground">Oui, depuis votre tableau de bord → Gérer → vous pouvez désactiver la cagnotte à tout moment. Elle ne sera plus visible publiquement.</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Que se passe-t-il si je n&apos;atteins pas l&apos;objectif ?</p>
              <p className="text-muted-foreground">Toutes les contributions reçues vous sont quand même versées. L&apos;objectif est indicatif, il n&apos;y a pas de remboursement automatique.</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Les contributions sont-elles remboursables ?</p>
              <p className="text-muted-foreground">Les remboursements peuvent être effectués manuellement depuis votre dashboard Stripe dans les 180 jours suivant le paiement.</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Puis-je avoir plusieurs cagnottes actives en même temps ?</p>
              <p className="text-muted-foreground">Oui, il n&apos;y a pas de limite. Chaque cagnotte nécessite des frais de création de 4,99 €.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
