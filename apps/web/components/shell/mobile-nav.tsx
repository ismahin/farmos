"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  CalendarCheck,
  Egg,
  Home,
  Menu,
  X,
} from "lucide-react";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function MobileNav({ isOpen, onClose, onOpen }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Off-Canvas Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 left-0 flex max-w-full">
            <div className="w-72 bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <span className="text-sm font-bold text-slate-900">
                  Farm<span className="text-emerald-600">OS</span> Menu
                </span>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar onNavigate={onClose} className="w-full border-r-0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Fixed Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-xs lg:hidden"
      >
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium transition-colors",
            pathname === "/" ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          href="/today"
          className={cn(
            "relative flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium transition-colors",
            pathname.startsWith("/today") ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <div className="relative">
            <CalendarCheck className="h-5 w-5 mb-0.5" />
            <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
              3
            </span>
          </div>
          <span>Today</span>
        </Link>

        <Link
          href="/production"
          className={cn(
            "flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium transition-colors",
            pathname.startsWith("/production") ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Egg className="h-5 w-5 mb-0.5" />
          <span>Flocks</span>
        </Link>

        <Link
          href="/stock"
          className={cn(
            "relative flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium transition-colors",
            pathname.startsWith("/stock") ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <div className="relative">
            <Boxes className="h-5 w-5 mb-0.5" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <span>Stock</span>
        </Link>

        <button
          type="button"
          onClick={onOpen}
          className="flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Menu className="h-5 w-5 mb-0.5" />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
}

