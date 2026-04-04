"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface Props {
  status: string;
}

export default function CreationBanner({ status }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  // Auto-clear the query param after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  if (!visible) return null;

  const isSuccess = status === "success";

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
          : "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
      }`}
    >
      <div className="flex items-center gap-2">
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4 shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0" />
        )}
        <span>
          {isSuccess
            ? "Votre cagnotte a été créée avec succès ! Elle sera visible dans quelques instants."
            : "La création a été annulée. Aucun paiement n'a été effectué."}
        </span>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          router.replace("/dashboard");
        }}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
