"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Boxes,
  Building2,
  CalendarCheck,
  Egg,
  Search,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useShell } from "./context";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Flock" | "House" | "Stock" | "Purchasing" | "Task" | "Partner";
  href: string;
  badge?: string;
}

const searchableData: SearchItem[] = [
  {
    id: "s-1",
    title: "Flock BR-2609-03 (Active)",
    subtitle: "House 03 • Day 28 • 9,820 live broilers",
    category: "Flock",
    href: "/production/flock-2609-03",
    badge: "Active",
  },
  {
    id: "s-2",
    title: "Flock BR-2609-01 (Harvest in 7d)",
    subtitle: "House 01 • Day 35 • 9,640 live broilers",
    category: "Flock",
    href: "/production/flock-2609-01",
    badge: "Active",
  },
  {
    id: "s-3",
    title: "House 03 (Broiler Unit)",
    subtitle: "Capacity 10,000 birds • Current: BR-2609-03",
    category: "House",
    href: "/farms/farm-001",
  },
  {
    id: "s-4",
    title: "House 02 (Cleanout)",
    subtitle: "Capacity 10,000 birds • Idle / Disinfection in progress",
    category: "House",
    href: "/farms/farm-001",
    badge: "Cleanout",
  },
  {
    id: "s-5",
    title: "Broiler Grower Pellets (FEED-GRW-02)",
    subtitle: "Stock: 2,800 kg • 2.3 days remaining (Critical)",
    category: "Stock",
    href: "/stock",
    badge: "Critical Stock",
  },
  {
    id: "s-6",
    title: "Newcastle Disease Vaccine B1",
    subtitle: "Lot LOT-VAC-NB1-26 • 10 vials expiring Oct 4",
    category: "Stock",
    href: "/stock",
    badge: "Expiring",
  },
  {
    id: "s-7",
    title: "Purchase Requisition PR-1042",
    subtitle: "5,000 kg Grower Feed • Urgent approval required",
    category: "Purchasing",
    href: "/purchasing",
    badge: "Pending Approval",
  },
  {
    id: "s-8",
    title: "Day 28 Weight Sampling (100 birds)",
    subtitle: "House 03 • Due Today at 11:00 • Assigned to Dr. Paul",
    category: "Task",
    href: "/today",
    badge: "High Priority",
  },
  {
    id: "s-9",
    title: "Apex Poultry Processors Ltd.",
    subtitle: "Customer • Harvest Order SO-2026-0301 (9,640 birds)",
    category: "Partner",
    href: "/sales",
  },
  {
    id: "s-10",
    title: "Unga Farm Care Ltd.",
    subtitle: "Supplier • Animal Nutrition & Commercial Feed",
    category: "Partner",
    href: "/purchasing",
  },
];

export function GlobalSearch() {
  const { isSearchOpen, setIsSearchOpen } = useShell();
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const filtered = React.useMemo(() => {
    if (!query.trim()) return searchableData.slice(0, 6);
    const q = query.toLowerCase();
    return searchableData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (href: string) => {
    setIsSearchOpen(false);
    setQuery("");
    router.push(href);
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 gap-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flocks, houses, items, POs, tasks... (ESC to exit)"
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching records found for &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {query ? "Search Results" : "Suggested & Recent"}
              </div>
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-emerald-50/70 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 shrink-0">
                      {item.category === "Flock" && <Egg className="h-4 w-4" />}
                      {item.category === "House" && <Building2 className="h-4 w-4" />}
                      {item.category === "Stock" && <Boxes className="h-4 w-4" />}
                      {item.category === "Purchasing" && <ShoppingCart className="h-4 w-4" />}
                      {item.category === "Task" && <CalendarCheck className="h-4 w-4" />}
                      {item.category === "Partner" && <Users className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate group-hover:text-emerald-950">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  {item.badge && (
                    <span className="ml-2 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>Provisional FarmOS Global Search prototype</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}

