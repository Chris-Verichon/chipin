import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="text-xl text-muted-foreground">Page introuvable</p>
      <p className="text-sm text-muted-foreground max-w-sm">
        Cette page n&apos;existe pas ou a été supprimée.
      </p>
      <Button render={<Link href="/" />} nativeButton={false}>Retour à l&apos;accueil</Button>
    </div>
  );
}
