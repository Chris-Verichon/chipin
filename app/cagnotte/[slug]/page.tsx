import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ParticipationForm from "@/components/ParticipationForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from("cagnottes")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "Cagnotte introuvable" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const description = data.description ?? "Participez à cette cagnotte sur ChipIn.";

  return {
    title: `${data.title} — ChipIn`,
    description,
    openGraph: {
      title: `${data.title} — ChipIn`,
      description,
      url: `${appUrl}/cagnotte/${slug}`,
      siteName: "ChipIn",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} — ChipIn`,
      description,
    },
  };
}

export default async function CagnottePage({ params }: Props) {
  const { slug } = await params;

  // Fetch fundraiser
  const { data: cagnotte } = await supabase
    .from("cagnottes")
    .select("id, title, slug, description, goal, total_raised, is_active, created_at, creator_id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!cagnotte) notFound();

  // Fetch paid participations (non-anonymous names are shown)
  const { data: participations } = await supabase
    .from("participations")
    .select("id, participant_name, amount, message, is_anonymous, created_at")
    .eq("cagnotte_id", cagnotte.id)
    .eq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(50);

  const totalRaisedEur = (cagnotte.total_raised ?? 0) / 100;
  const goalEur = cagnotte.goal ? cagnotte.goal : null;
  const progressPct = goalEur
    ? Math.min(100, Math.round((totalRaisedEur / goalEur) * 100))
    : null;

  const participantCount = participations?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold tracking-tight">
            ChipIn
          </a>
          <div className="flex items-center gap-3">
            <Link href="/a-propos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              À propos
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Title + stats */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold leading-tight">{cagnotte.title}</h1>

          {cagnotte.description && (
            <p className="text-muted-foreground leading-relaxed">{cagnotte.description}</p>
          )}

          {/* Progress */}
          <div className="space-y-2 pt-2">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className={`text-2xl font-bold transition-colors ${totalRaisedEur > 0 ? "text-green-700 dark:text-green-500" : ""}`}>
                  {totalRaisedEur.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
                {goalEur && (
                  <span className="text-muted-foreground text-sm ml-2">
                    sur{" "}
                    {goalEur.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                )}
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>{participantCount} contribution{participantCount !== 1 ? "s" : ""}</div>
                {progressPct !== null && (
                  <div className="font-medium text-foreground">{progressPct}&nbsp;%</div>
                )}
              </div>
            </div>

            {progressPct !== null && (
              <div
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progression : ${progressPct} %`}
                className="h-2 w-full rounded-full bg-muted overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Participants list */}
          <div className="space-y-4 order-2 lg:order-1">
            <h2 className="font-semibold text-lg">
              {participantCount > 0
                ? `${participantCount} contribution${participantCount !== 1 ? "s" : ""}`
                : "Soyez le premier à contribuer !"}
            </h2>

            {participations && participations.length > 0 && (
              <div className="space-y-3">
                {participations.map((p) => (
                  <div key={p.id} className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs">
                        {p.is_anonymous ? "?" : p.participant_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">
                          {p.is_anonymous ? "Anonyme" : p.participant_name}
                        </span>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {Number(p.amount).toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </Badge>
                      </div>
                      {p.message && (
                        <p className="text-sm text-muted-foreground mt-0.5 break-words">
                          {p.message}
                        </p>
                      )}
                      <p suppressHydrationWarning className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(p.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contribution form */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Faire un don</CardTitle>
              </CardHeader>
              <CardContent>
                <ParticipationForm
                  cagnotteId={cagnotte.id}
                  cagnotteTitle={cagnotte.title}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
