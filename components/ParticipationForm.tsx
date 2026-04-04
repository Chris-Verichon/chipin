"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  cagnotteId: string;
  cagnotteTitle: string;
}

export default function ParticipationForm({ cagnotteId, cagnotteTitle }: Props) {
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [form, setForm] = useState({
    participant_name: "",
    participant_email: "",
    amount: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(form.amount);
    if (!form.amount || isNaN(amountNum) || amountNum < 1) {
      toast.error("Le montant minimum est de 1 €.");
      return;
    }
    if (!form.participant_email) {
      toast.error("L'adresse email est requise.");
      return;
    }
    if (!isAnonymous && !form.participant_name.trim()) {
      toast.error("Indiquez votre prénom ou cochez « Participer anonymement ».");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cagnotte_id: cagnotteId,
          participant_name: form.participant_name.trim() || undefined,
          participant_email: form.participant_email.trim(),
          amount: amountNum,
          message: form.message.trim() || undefined,
          is_anonymous: isAnonymous,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Une erreur est survenue.");
        return;
      }

      // Redirect to Stripe using the client secret
      const stripe = await stripePromise;
      if (!stripe) {
        toast.error("Impossible de charger le module de paiement.");
        return;
      }

      // Use confirmPayment with a return URL that includes the slug
      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/cagnotte/${data.slug}/succes`,
          payment_method_data: {
            billing_details: {
              name: isAnonymous ? "Anonyme" : form.participant_name.trim(),
              email: form.participant_email.trim(),
            },
          },
        },
      });

      if (stripeError) {
        toast.error(stripeError.message ?? "Paiement refusé.");
      }
    } catch {
      toast.error("Une erreur réseau est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // Quick-pick amounts
  const quickAmounts = [5, 10, 20, 50];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Quick amounts */}
      <div>
        <Label>Montant *</Label>
        <div className="flex gap-2 mt-1 flex-wrap">
          {quickAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setForm((p) => ({ ...p, amount: String(a) }))}
              disabled={loading}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                form.amount === String(a)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {a}&nbsp;€
            </button>
          ))}
          <Input
            name="amount"
            type="number"
            placeholder="Autre montant"
            value={quickAmounts.includes(Number(form.amount)) ? "" : form.amount}
            onChange={handleChange}
            min={1}
            step={1}
            disabled={loading}
            className="w-32"
          />
        </div>
      </div>

      <Separator />

      {/* Anonymous toggle */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="is_anonymous"
          checked={isAnonymous}
          onCheckedChange={(v) => setIsAnonymous(!!v)}
          disabled={loading}
        />
        <Label htmlFor="is_anonymous" className="cursor-pointer font-normal">
          Participer anonymement
        </Label>
      </div>

      {/* Name — hidden when anonymous */}
      {!isAnonymous && (
        <div className="space-y-1">
          <Label htmlFor="participant_name">Prénom *</Label>
          <Input
            id="participant_name"
            name="participant_name"
            placeholder="Votre prénom"
            value={form.participant_name}
            onChange={handleChange}
            maxLength={80}
            disabled={loading}
          />
        </div>
      )}

      {/* Email — always required */}
      <div className="space-y-1">
        <Label htmlFor="participant_email">Email * <span className="text-xs text-muted-foreground">(confirmation de paiement)</span></Label>
        <Input
          id="participant_email"
          name="participant_email"
          type="email"
          placeholder="votre@email.com"
          value={form.participant_email}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {/* Optional message */}
      <div className="space-y-1">
        <Label htmlFor="message">Message <span className="text-xs text-muted-foreground">(optionnel)</span></Label>
        <Textarea
          id="message"
          name="message"
          placeholder={`Un mot pour ${cagnotteTitle}…`}
          value={form.message}
          onChange={handleChange}
          rows={2}
          maxLength={300}
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Redirection vers le paiement…" : `Contribuer${form.amount ? ` — ${form.amount} €` : ""}`}
      </Button>
    </form>
  );
}
