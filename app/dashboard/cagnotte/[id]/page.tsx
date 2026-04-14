import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import CopyLinkButton from "@/components/CopyLinkButton";
import ToggleActiveButton from "@/components/ToggleActiveButton";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CagnotteDetailPage({ params }: Props) {
  const session = await getServerSession();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  // Fetch cagnotte — must belong to this creator (or admin can view all)
  const query = supabase
    .from("cagnottes")
    .select("id, title, slug, description, goal, total_raised, is_active, created_at, creator_id")
    .eq("id", id);

  if (session.user.role !== "admin") {
    query.eq("creator_id", session.user.id);
  }

  const { data: cagnotte } = await query.single();
  if (!cagnotte) notFound();

  // Fetch all participations for this cagnotte (creator sees everything including emails)
  const { data: participations } = await supabase
    .from("participations")
    .select("id, participant_name, participant_email, amount, message, is_anonymous, status, created_at")
    .eq("cagnotte_id", id)
    .order("created_at", { ascending: false });

  const paid = participations?.filter((p) => p.status === "paid") ?? [];
  const pending = participations?.filter((p) => p.status === "pending") ?? [];
  const totalRaisedEur = (cagnotte.total_raised ?? 0) / 100;
  const goalEur = cagnotte.goal ? cagnotte.goal : null;
  const progressPct = goalEur
    ? Math.min(100, Math.round((totalRaisedEur / goalEur) * 100))
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xl font-bold tracking-tight">ChipIn</span>
            <Badge className="bg-slate-100/80 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-0 capitalize">{session.user.role}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session.user.email}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Title + actions */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{cagnotte.title}</h1>
              <Badge variant={cagnotte.is_active ? "default" : "secondary"}>
                {cagnotte.is_active ? "Active" : "Fermée"}
              </Badge>
            </div>
            {cagnotte.description && (
              <p className="text-muted-foreground text-sm">{cagnotte.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CopyLinkButton slug={cagnotte.slug} />
            <ToggleActiveButton
              cagnotteId={cagnotte.id}
              isActive={cagnotte.is_active}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Collecté</p>
              <p className="text-2xl font-bold mt-1">
                {totalRaisedEur.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </p>
              {goalEur && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  sur {goalEur.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Contributions</p>
              <p className="text-2xl font-bold mt-1">{paid.length}</p>
              {pending.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">{pending.length} en attente</p>
              )}
            </CardContent>
          </Card>
          {progressPct !== null && (
            <Card className="col-span-2">
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Progression</p>
                <p className="text-2xl font-bold mt-1">{progressPct}&nbsp;%</p>
                <div
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progression : ${progressPct} %`}
                  className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-2"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        {/* Participants table */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">
            Participants{" "}
            {paid.length > 0 && (
              <span className="text-muted-foreground font-normal text-base">({paid.length})</span>
            )}
          </h2>

          {paid.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">
              Aucune contribution pour l&apos;instant.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm min-w-[480px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">Participant</th>
                    <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">Montant</th>
                    <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paid.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium">
                            {p.is_anonymous ? "Anonyme" : p.participant_name}
                          </span>
                          {p.message && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {p.message}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <a
                          href={`mailto:${p.participant_email}`}
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="text-xs">{p.participant_email}</span>
                        </a>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {(p.amount / 100).toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>
                      <td suppressHydrationWarning className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                        {formatDistanceToNow(new Date(p.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
