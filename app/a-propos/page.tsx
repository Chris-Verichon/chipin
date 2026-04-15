import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Mail, ArrowLeft, Banknote, Users, Lock, Zap } from "lucide-react";

export default function APropos() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            ChipIn
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button render={<Link href="/login" />} nativeButton={false} variant="outline" size="sm">
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <div className="mx-auto max-w-2xl px-4 py-16 space-y-16">
          {/* Back */}
          <Button render={<Link href="/" />} nativeButton={false} variant="ghost" size="sm" className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          {/* Intro */}
          <section className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">À propos de ChipIn</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              ChipIn est une application de cagnottes en ligne pensée pour être rapide, simple et accessible.
              Créez une cagnotte en quelques secondes, partagez un lien, et laissez vos proches contribuer
              sans qu&apos;ils aient besoin de créer un compte.
            </p>
          </section>

          {/* Pourquoi ChipIn */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Pourquoi ChipIn ?</h2>
            <p className="text-muted-foreground leading-relaxed">
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
                <div key={item.title} className="rounded-xl border bg-card/50 p-4 space-y-2">
                  <div className={`${item.color} ${item.bg} inline-flex p-2 rounded-lg`}>{item.icon}</div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-6 border-t pt-12">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Une question, un bug, une idée d&apos;amélioration ? N&apos;hésitez pas à écrire directement.
              </p>
            </div>
            <div className="rounded-2xl border bg-card/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-lg">Chris Verichon</p>
              </div>
              <Button
                render={<a href="mailto:chris.verichon@gmail.com" />}
                nativeButton={false}
              >
                <Mail className="mr-2 h-4 w-4" />
                Envoyer un mail
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
