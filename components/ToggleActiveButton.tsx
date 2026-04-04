"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Unlock } from "lucide-react";

interface Props {
  cagnotteId: string;
  isActive: boolean;
}

export default function ToggleActiveButton({ cagnotteId, isActive }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(isActive);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cagnotte/${cagnotteId}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Une erreur est survenue.");
        return;
      }

      setActive(data.is_active);
      toast.success(data.is_active ? "Cagnotte réouverte." : "Cagnotte fermée.");
      router.refresh();
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={active ? "Fermer la cagnotte" : "Réouvrir la cagnotte"}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${
        active
          ? "border-border bg-background text-foreground hover:bg-muted"
          : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
      }`}
    >
      {active ? (
        <>
          <Lock className="h-3.5 w-3.5" />
          Fermer
        </>
      ) : (
        <>
          <Unlock className="h-3.5 w-3.5" />
          Réouvrir
        </>
      )}
    </button>
  );
}
