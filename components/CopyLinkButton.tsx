"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Link2, Check } from "lucide-react";

interface Props {
  slug: string;
}

export default function CopyLinkButton({ slug }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/cagnotte/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Lien copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      title="Copier le lien public"
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-600" />
          Copié
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" />
          Copier le lien
        </>
      )}
    </button>
  );
}
