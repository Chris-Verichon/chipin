import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import AdminCharts from "@/components/AdminCharts";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // ── Global counts ──────────────────────────────────────────
  const [
    { count: totalUsers },
    { count: totalCagnottes },
    { count: totalParticipations },
    { data: feeRows },
    { data: cagnottes },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("cagnottes").select("id", { count: "exact", head: true }),
    supabase
      .from("participations")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid"),
    // Total platform revenue from paid fees
    supabase
      .from("cagnotte_fees")
      .select("amount")
      .eq("status", "paid"),
    // All cagnottes with raised amounts for chart data
    supabase
      .from("cagnottes")
      .select("id, title, slug, total_raised, is_active, created_at, creator_id")
      .order("total_raised", { ascending: false })
      .limit(20),
    // Most recent signups
    supabase
      .from("users")
      .select("id, email, name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const totalFeeRevenue =
    feeRows?.reduce((sum, f) => sum + (f.amount ?? 0), 0) ?? 0;

  // ── Chart data: daily contributions for last 30 days ───────
  const { data: dailyContributions } = await supabase
    .from("participations")
    .select("amount, created_at")
    .eq("status", "paid")
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  // Group by day (YYYY-MM-DD)
  const dayMap: Record<string, number> = {};
  for (const p of dailyContributions ?? []) {
    const day = p.created_at.slice(0, 10);
    dayMap[day] = (dayMap[day] ?? 0) + p.amount;
  }
  const chartData = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({
      date,
      total: Math.round(total) / 100, // euros
    }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xl font-bold tracking-tight">ChipIn</span>
            <Badge variant="destructive">admin</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session.user.email}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
        <div>
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vue globale de la plateforme ChipIn.
          </p>
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Utilisateurs</p>
              <p className="text-3xl font-bold mt-1">{totalUsers ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Cagnottes</p>
              <p className="text-3xl font-bold mt-1">{totalCagnottes ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Contributions</p>
              <p className="text-3xl font-bold mt-1">{totalParticipations ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Revenus (frais)</p>
              <p className="text-3xl font-bold mt-1">
                {totalFeeRevenue.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {feeRows?.length ?? 0} créations payées
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Chart ── */}
        {chartData.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Contributions (30 derniers jours)</h2>
            <AdminCharts data={chartData} />
          </div>
        )}

        <Separator />

        {/* ── Top fundraisers ── */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Top cagnottes</h2>
          {cagnottes && cagnottes.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Titre</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Collecté</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Statut</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Créée</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cagnottes.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/cagnotte/${c.id}`}
                          className="font-medium hover:underline underline-offset-2"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">
                        {((c.total_raised ?? 0) / 100).toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant={c.is_active ? "default" : "secondary"} className="text-xs">
                          {c.is_active ? "Active" : "Fermée"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                        {formatDistanceToNow(new Date(c.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center">Aucune cagnotte.</p>
          )}
        </div>

        <Separator />

        {/* ── Recent users ── */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Derniers inscrits</h2>
          {recentUsers && recentUsers.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Nom</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rôle</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Inscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm">{u.email}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {u.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={u.role === "admin" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                        {formatDistanceToNow(new Date(u.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center">Aucun utilisateur.</p>
          )}
        </div>
      </main>
    </div>
  );
}
