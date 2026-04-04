import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CagnotteForm from "@/components/CagnotteForm";
import CreationBanner from "@/components/CreationBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ creation?: string }>;
}) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const creationStatus = params.creation; // "success" | "cancelled" | undefined

  // Fetch this creator's fundraisers
  const { data: cagnottes } = await supabase
    .from("cagnottes")
    .select("id, title, slug, description, goal, total_raised, is_active, created_at")
    .eq("creator_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">ChipIn</span>
            <Badge variant="secondary">{session.user.role}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session.user.email}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Creation status banner */}
        {creationStatus && <CreationBanner status={creationStatus} />}

        {/* Page title + action */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mes cagnottes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez vos collectes et suivez les participations.
            </p>
          </div>
          <CagnotteForm />
        </div>

        <Separator />

        {/* Fundraiser list */}
        {!cagnottes || cagnottes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-muted-foreground text-lg">
              Vous n&apos;avez pas encore de cagnotte.
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Cliquez sur <strong>Nouvelle cagnotte</strong> pour commencer.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cagnottes.map((c) => {
              const progressPct =
                c.goal && c.total_raised !== null
                  ? Math.min(100, Math.round((c.total_raised / c.goal) * 100))
                  : null;

              return (
                <Card key={c.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug line-clamp-2">
                        {c.title}
                      </CardTitle>
                      <Badge
                        variant={c.is_active ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {c.is_active ? "Active" : "Fermée"}
                      </Badge>
                    </div>
                    {c.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {c.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3 flex-1 justify-end">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>
                          {((c.total_raised ?? 0) / 100).toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}{" "}
                          collectés
                        </span>
                        {c.goal && (
                          <span>
                            sur{" "}
                            {(c.goal / 100).toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </span>
                        )}
                      </div>
                      {progressPct !== null && (
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Footer row */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(c.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                      <a
                        href={`/cagnotte/${c.slug}`}
                        className="underline underline-offset-2 hover:text-foreground transition-colors"
                      >
                        Voir
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
