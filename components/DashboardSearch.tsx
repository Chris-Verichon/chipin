"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchItem {
  label: string;
  description: string;
  href: string;
}

interface Props {
  cagnottes: { id: string; title: string; slug: string; is_active: boolean }[];
  role: string;
}

export default function DashboardSearch({ cagnottes, role }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const listboxId = `${id}-listbox`;

  const staticItems: SearchItem[] = [
    { label: "Tableau de bord", description: "Vos cagnottes", href: "/dashboard" },
    { label: "Guide créateur", description: "Comment ça marche", href: "/dashboard/guide" },
    ...(role === "admin"
      ? [{ label: "Admin", description: "Panneau d'administration", href: "/admin" }]
      : []),
    { label: "Accueil", description: "Page publique", href: "/" },
  ];

  const cagnotteItems: SearchItem[] = cagnottes.map((c) => ({
    label: c.title,
    description: c.is_active ? "Cagnotte active" : "Cagnotte fermée",
    href: `/dashboard/cagnotte/${c.id}`,
  }));

  const allItems = [...staticItems, ...cagnotteItems];

  const filtered = query.trim()
    ? allItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const handleSelect = useCallback(
    (href: string) => {
      router.push(href);
      setQuery("");
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex].href);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.closest("[data-search-root]")?.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div data-search-root className="relative hidden md:block w-56 lg:w-72">
      <div className="relative">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Rechercher dans le site"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          placeholder="Rechercher…"
          className="w-full rounded-md border bg-muted/40 py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-colors"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {open && filtered.length > 0 && (
        <ul
          id={listboxId}
          ref={listRef}
          role="listbox"
          aria-label="Suggestions de navigation"
          className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md overflow-auto max-h-64 py-1"
        >
          {filtered.map((item, i) => (
            <li
              key={item.href}
              id={`${id}-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={`flex flex-col px-3 py-2 cursor-pointer text-sm transition-colors ${
                i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent input blur before click
                handleSelect(item.href);
              }}
            >
              <span className="font-medium">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && filtered.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md px-3 py-3 text-sm text-muted-foreground"
        >
          Aucun résultat pour &laquo;&nbsp;{query}&nbsp;&raquo;
        </div>
      )}
    </div>
  );
}
