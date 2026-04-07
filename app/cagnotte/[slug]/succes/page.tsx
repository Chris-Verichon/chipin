import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merci pour votre participation — ChipIn",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SuccesPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            ChipIn
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-4 py-24 flex flex-col items-center text-center gap-6">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-5">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Merci pour votre participation&nbsp;!</h1>
          <p className="text-muted-foreground max-w-md">
            Votre contribution a bien été enregistrée. Un email de confirmation vous a été envoyé.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button render={<Link href={`/cagnotte/${slug}`} />} nativeButton={false} variant="outline">
            Retour à la cagnotte
          </Button>
          <Button render={<Link href="/" />} nativeButton={false}>
            Accueil
          </Button>
        </div>
      </main>
    </div>
  );
}
