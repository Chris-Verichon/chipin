import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { AProposTabs } from "@/components/AProposTabs";
import { CREATION_FEE_AMOUNT } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez ChipIn, l'application de cagnottes en ligne simple et rapide. Mentions légales, politique de confidentialité et conditions générales d'utilisation.",
  openGraph: {
    title: "À propos de ChipIn",
    description:
      "Découvrez ChipIn, l'application de cagnottes en ligne simple et rapide. Créez une cagnotte, partagez un lien.",
    url: "/a-propos",
  },
};

export default function APropos() {
  const platformFeePercent = parseFloat(process.env.PLATFORM_FEE_PERCENT ?? "5");
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
        <div className="mx-auto max-w-2xl px-4 py-16 space-y-8">
          {/* Back */}
          <Button render={<Link href="/" />} nativeButton={false} variant="ghost" size="sm" className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <AProposTabs creationFeeAmount={CREATION_FEE_AMOUNT} platformFeePercent={platformFeePercent} />
        </div>
      </main>
    </div>
  );
}
