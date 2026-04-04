"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

export default function CagnotteForm({ role }: { role: string }) {
  const isAdmin = role === "admin";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (form.title.trim().length < 3) {
      toast.error("Le titre doit contenir au moins 3 caractères.");
      return;
    }

    const goalNum = form.goal ? parseFloat(form.goal) : undefined;
    if (goalNum !== undefined && (isNaN(goalNum) || goalNum <= 0)) {
      toast.error("L'objectif doit être un montant positif.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/stripe/creation-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          goal: goalNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Une erreur est survenue.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      toast.error("Une erreur réseau est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50">
            <PlusCircle className="h-4 w-4" />
            Nouvelle cagnotte
          </button>
        }
      />

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Créer une cagnotte</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous.{" "}
            {isAdmin ? (
              <strong>Gratuit en tant qu&apos;admin.</strong>
            ) : (
              <>Le paiement de <strong>4,99 €</strong> sera demandé pour finaliser la création.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Voyage de fin d'études"
              value={form.title}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={100}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Décrivez votre projet..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="goal">Objectif (€)</Label>
            <Input
              id="goal"
              name="goal"
              type="number"
              placeholder="Ex: 1000"
              value={form.goal}
              onChange={handleChange}
              min={1}
              step={1}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Laissez vide pour une cagnotte sans objectif défini.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement…" : isAdmin ? "Créer" : "Créer (4,99 €)"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
