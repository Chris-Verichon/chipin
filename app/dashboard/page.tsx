import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CagnotteForm from "@/components/CagnotteForm";
import CreationBanner from "@/components/CreationBanner";
import DashboardSearch from "@/components/DashboardSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ creation?: string; connect?: string }>;
}) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const creationStatus = params.creation; // "success" | "cancelled" | undefined
  const connectStatus = params.connect;   // "success" | "cancelled" | "error" | undefined

  // Fetch Stripe Connect status
  const { data: userData } = await supabase
    .from("users")
    .select("stripe_account_id")
    .eq("id", session.user.id)
    .single();
  const stripeAccountId = userData?.stripe_account_id ?? null;

  // Fetch this creator's fundraisers
  const { data: cagnottes } = await supabase
    .from("cagnottes")
    .select("id, title, slug, description, goal, total_raised, is_active, created_at")
    .eq("creator_id", session.user.id)
    .order("created_at", { ascending: false });

  // Global stats
  const totalRaisedCents = cagnottes?.reduce((sum, c) => sum + (c.total_raised ?? 0), 0) ?? 0;
  const activeCount = cagnottes?.filter((c) => c.is_active).length ?? 0;

  // Total paid participations across all cagnottes
  const cagnotteIds = cagnottes?.map((c) => c.id) ?? [];
  const { count: totalContributions } = cagnotteIds.length > 0
    ? await supabase
        .from("participations")
        .select("id", { count: "exact", head: true })
        .in("cagnotte_id", cagnotteIds)
        .eq("status", "paid")
    : { count: 0 };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">ChipIn</span>
            <Badge className="bg-slate-100/80 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-0 capitalize">{session.user.role}</Badge>
          </div>
          <DashboardSearch
            cagnottes={cagnottes ?? []}
            role={session.user.role}
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session.user.email}
            </span>
            {session.user.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
              >
                ⚙ Admin
              </Link>
            )}
            <Link
              href="/dashboard/guide"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
            >
              Guide
            </Link>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Creation status banner */}
        {creationStatus && <CreationBanner status={creationStatus} />}

        {/* Stripe Connect status banners */}
        {connectStatus === "success" && (
          <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-300">
            Votre compte Stripe est maintenant connecté. Les contributions seront versées directement sur votre compte.
          </div>
        )}
        {connectStatus === "cancelled" && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-300">
            Connexion Stripe annulée.
          </div>
        )}
        {connectStatus === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-300">
            Une erreur s&apos;est produite lors de la connexion Stripe. Veuillez réessayer.
          </div>
        )}

        {/* Stripe Connect CTA — only for creators who haven't linked their account */}
        {session.user.role === "creator" && !stripeAccountId && (
          <div className="rounded-lg border bg-muted/40 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm">Connectez votre compte Stripe</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Indispensable pour recevoir les contributions directement sur votre compte bancaire.
              </p>
            </div>
            <a
              href="/api/stripe/connect"
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Connecter Stripe
            </a>
          </div>
        )}
        {session.user.role === "creator" && stripeAccountId && (
          <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-5 py-3 flex items-center gap-2 text-sm text-green-800 dark:text-green-300">
            <span>✓</span>
            <span>Compte Stripe connecté — les contributions sont versées directement sur votre compte.</span>
          </div>
        )}

        {/* Global stats row */}
        {cagnottes && cagnottes.length > 0 && (
          <div className="grid grid-cols-1 [@media(min-width:430px)]:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total collecté</p>
                <p className="text-xl font-bold mt-1">
                  {(totalRaisedCents / 100).toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Contributions</p>
                <p className="text-xl font-bold mt-1">{totalContributions ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Cagnottes actives</p>
                <p className="text-xl font-bold mt-1">{activeCount}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Page title + action */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mes cagnottes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez vos collectes et suivez les participations.
            </p>
          </div>
          <CagnotteForm role={session.user.role} />
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
                        className={`shrink-0 ${c.is_active ? "bg-green-900 text-white" : "bg-secondary text-secondary-foreground"}`}
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
                            {c.goal.toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </span>
                        )}
                      </div>
                      {progressPct !== null && (
                        <div
                          role="progressbar"
                          aria-valuenow={progressPct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Progression : ${progressPct} %`}
                          className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
                        >
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Footer row */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span suppressHydrationWarning>
                        {formatDistanceToNow(new Date(c.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                      <div className="flex items-center gap-3">
                        <a
                          href={`/cagnotte/${c.slug}`}
                          className="underline underline-offset-2 hover:text-foreground transition-colors"
                        >
                          Voir
                        </a>
                        <Link
                          href={`/dashboard/cagnotte/${c.id}`}
                          className="underline underline-offset-2 hover:text-foreground transition-colors"
                        >
                          Gérer
                        </Link>
                      </div>
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
