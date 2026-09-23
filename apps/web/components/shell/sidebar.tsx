"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  Boxes,
  Briefcase,
  CalendarCheck,
  CircleDollarSign,
  Egg,
  Home,
  Layers,
  Settings,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeTone?: "emerald" | "amber" | "rose" | "purple";
  tag?: string;
}

const mainNavItems: { section: string; items: NavItem[] }[] = [
  {
    section: "Operations",
    items: [
      {
        title: "Home",
        href: "/",
        icon: Home,
      },
      {
        title: "Today",
        href: "/today",
        icon: CalendarCheck,
        badge: "3",
        badgeTone: "amber",
      },
      {
        title: "Farms",
        href: "/farms",
        icon: Layers,
      },
      {
        title: "Production",
        href: "/production",
        icon: Egg,
        badge: "2 Active",
        badgeTone: "emerald",
      },
      {
        title: "Stock",
        href: "/stock",
        icon: Boxes,
        badge: "Low",
        badgeTone: "rose",
      },
    ],
  },
  {
    section: "Commercial & Finance",
    items: [
      {
        title: "Purchasing",
        href: "/purchasing",
        icon: ShoppingCart,
        badge: "1 Appr",
        badgeTone: "amber",
      },
      {
        title: "Sales",
        href: "/sales",
        icon: Truck,
      },
      {
        title: "Money",
        href: "/money",
        icon: CircleDollarSign,
      },
    ],
  },
  {
    section: "Farm Management",
    items: [
      {
        title: "People",
        href: "/people",
        icon: Users,
      },
      {
        title: "Assets",
        href: "/assets",
        icon: Wrench,
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    section: "Intelligence",
    items: [
      {
        title: "AI Assistant",
        href: "/ai",
        icon: Bot,
        badge: "Hermes",
        badgeTone: "purple",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-slate-50/50 border-r border-slate-200 w-64 select-none",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {mainNavItems.map((group) => (
          <div key={group.section} className="space-y-1">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {group.section}
            </h4>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all group",
                      isActive
                        ? "bg-emerald-600 text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-700"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0",
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeTone === "rose"
                            ? "bg-rose-100 text-rose-700"
                            : item.badgeTone === "amber"
                            ? "bg-amber-100 text-amber-800"
                            : item.badgeTone === "purple"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-emerald-100 text-emerald-700"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Production cycle status footer widget in sidebar */}
      <div className="p-3 border-t border-slate-200 bg-white/70 m-2 rounded-xl border">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Active Cycle
          </span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="mt-1 text-xs font-bold text-slate-900">
          House 03 • BR-2609-03
        </p>
        <p className="text-[11px] text-slate-500">
          Day 28 (Cobb 500) • 9,820 Birds
        </p>
      </div>
    </aside>
  );
}

