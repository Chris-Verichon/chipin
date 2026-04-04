import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Banknote, Lock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4">
          <span className="text-xl font-bold tracking-tight">ChipIn</span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button render={<Link href="/login" />} nativeButton={false} variant="outline" size="sm">
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main id="main-content">
        <section className="mx-auto max-w-3xl px-4 py-24 text-center space-y-6">
          <h1 className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700 fill-mode-both text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Collectez facilement,<br />
            <span className="text-primary">ensemble.</span>
          </h1>
          <p className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            ChipIn vous permet de créer une cagnotte en quelques secondes et de partager le lien à vos proches.
            Chacun peut contribuer librement, même sans compte.
          </p>
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both flex flex-col sm:flex-row gap-3 justify-center">
            <Button render={<Link href="/login" />} nativeButton={false} size="lg">
              Créer une cagnotte <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-4 pb-24 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: <Banknote className="h-6 w-6" />,
              title: "Paiement sécurisé",
              desc: "Les contributions sont traitées via Stripe — aucune donnée bancaire stockée.",
              delay: "delay-500",
            },
            {
              icon: <Users className="h-6 w-6" />,
              title: "Ouvert à tous",
              desc: "Vos proches peuvent participer sans créer de compte. Juste un lien à partager.",
              delay: "delay-700",
            },
            {
              icon: <Lock className="h-6 w-6" />,
              title: "Privé par défaut",
              desc: "Seul le créateur voit les emails des participants. Les anonymes restent anonymes.",
              delay: "delay-1000",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ${f.delay} fill-mode-both rounded-xl border bg-card p-6 space-y-3`}
            >
              <div className="text-primary">{f.icon}</div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
