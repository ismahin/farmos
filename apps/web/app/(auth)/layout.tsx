import * as React from "react";
import Link from "next/link";
import { Sprout } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Auth minimal header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              Farm<span className="text-emerald-600">OS</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Agri-ERP SaaS
            </span>
          </div>
        </Link>
        <span className="text-xs text-slate-500 hidden sm:inline-block">
          M01 Frontend & UX Prototype
        </span>
      </header>

      {/* Main auth/onboarding content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        FarmOS prototype — Demonstration data only. No backend security or authoritative ledgers.
      </footer>
    </div>
  );
}

