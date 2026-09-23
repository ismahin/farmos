"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Building2,
  ChevronDown,
  Menu,
  Plus,
  Search,
  Sprout,
  UserCheck,
} from "lucide-react";
import { useShell } from "./context";
import { UserPersona } from "@/types";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenFastLog?: () => void;
}

export function Header({ onOpenMobileMenu, onOpenFastLog }: HeaderProps) {
  const {
    organization,
    farms,
    currentFarm,
    setCurrentFarmId,
    currentUser,
    setUserPersona,
    setIsSearchOpen,
    setIsNotificationOpen,
    unreadAlertCount,
    auth,
  } = useShell();

  const [farmDropdownOpen, setFarmDropdownOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6">
      {/* Left side: Mobile menu toggle + Brand + Context Selectors */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-bold tracking-tight text-slate-900">
              Farm<span className="text-emerald-600">OS</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Agri-ERP SaaS
            </span>
          </div>
        </Link>

        {/* Vertical divider */}
        <div className="hidden md:block h-6 w-px bg-slate-200" />

        {/* Organization / Farm Context */}
        <div className="relative">
          <button
            onClick={() => setFarmDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <div className="text-left hidden xs:block">
              <span className="text-[10px] text-slate-400 block leading-tight">
                {organization.name}
              </span>
              <span className="font-semibold text-slate-900 truncate max-w-[130px] sm:max-w-[180px] block leading-tight">
                {currentFarm.name}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {farmDropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-40"
              onMouseLeave={() => setFarmDropdownOpen(false)}
            >
              <div className="px-3 py-1 text-[10px] font-semibold uppercase text-slate-400">
                Switch Operational Farm
              </div>
              {farms.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setCurrentFarmId(f.id);
                    setFarmDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-xs transition-colors flex items-center justify-between",
                    f.id === currentFarm.id
                      ? "bg-emerald-50 text-emerald-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <div>
                    <p className="font-medium">{f.name}</p>
                    <p className="text-[10px] text-slate-400">{f.location}</p>
                  </div>
                  {f.status === "ACTIVE" ? (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">
                      Setup
                    </span>
                  )}
                </button>
              ))}
              <div className="mt-1 pt-1 border-t border-slate-100">
                <Link
                  href="/onboarding"
                  onClick={() => setFarmDropdownOpen(false)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  + Compose New Farm
                </Link>
              </div>
              {auth.hasPermission("farm.create") && (
                <div className="mt-1 pt-1 border-t border-slate-100">
                  <Link
                    href="/onboarding"
                    onClick={() => setFarmDropdownOpen(false)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    + Compose New Farm
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Global Search + Quick Action + Notification Bell + User Persona Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search trigger button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Search FarmOS (Cmd+K)"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden md:inline">Quick Search...</span>
          <kbd className="hidden md:inline-block rounded border border-slate-200 bg-white px-1.5 text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Low-input Fast Log Trigger */}
        {onOpenFastLog && (
          <button
            onClick={onOpenFastLog}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Fast Log
          </button>
        )}

        {/* Notifications trigger */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          aria-label="View notifications and alerts"
        >
          <Bell className="h-5 w-5" />
          {unreadAlertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* User Persona Switcher (Demonstrator prototype for testing roles) */}
        {/* Real User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5 sm:px-2.5 sm:py-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-semibold text-slate-900 block leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">
                {currentUser.roleTitle}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-40"
              className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-40"
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                <p className="text-[10px] font-semibold uppercase text-slate-400">
                  Switch Role / Persona (Prototype)
                </p>
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email || "Authenticated Operator"}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                  <Building2 className="h-3 w-3" />
                  <span>{organization.name}</span>
                </div>
              </div>

              {(
                [
                  ["FARM_MANAGER", "Mahin (Farm Manager)"],
                  ["STOREKEEPER", "Alice (Storekeeper)"],
                  ["FIELD_WORKER", "John (House Worker)"],
                  ["OWNER", "David (Owner / Exec)"],
                  ["VET", "Dr. Paul (Veterinarian)"],
                ] as [UserPersona, string][]
              ).map(([role, label]) => (
              {/* Server Permissions Summary */}
              <div className="px-3 py-1.5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Permissions ({auth.permissions.length})</span>
                  <span className="text-emerald-600 font-medium lowercase">authorized</span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {auth.permissions.length > 0 ? (
                    auth.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono font-medium text-slate-700"
                      >
                        {perm}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">Standard access</span>
                  )}
                </div>
              </div>

              <div className="mt-2 pt-1 border-t border-slate-100">
                <button
                  key={role}
                  onClick={() => {
                    setUserPersona(role);
                  type="button"
                  onClick={async () => {
                    setUserDropdownOpen(false);
                    await auth.logout();
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-1.5 text-left text-xs transition-colors flex items-center justify-between",
                    currentUser.role === role
                      ? "bg-emerald-50 text-emerald-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                  className="w-full text-left rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-between"
                >
                  <span>{label}</span>
                  {currentUser.role === role && (
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                  )}
                  <span>Sign Out</span>
                  <span className="text-[10px] font-normal text-rose-400">Revoke Session</span>
                </button>
              ))}

              <div className="mt-1 pt-1 border-t border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setUserDropdownOpen(false)}
                  className="block rounded-lg px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                >
                  Sign Out (Mock)
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

