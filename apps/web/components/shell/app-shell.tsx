"use client";

import * as React from "react";
import { ShellProvider } from "./context";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { GlobalSearch } from "./global-search";
import { NotificationDrawer } from "./notification-drawer";
import { FastLogModal } from "./fast-log-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [fastLogOpen, setFastLogOpen] = React.useState(false);

  return (
    <ShellProvider>
      <div className="flex h-screen w-full flex-col bg-slate-100/60 antialiased overflow-hidden text-slate-900">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenFastLog={() => setFastLogOpen(true)}
        />

        {/* Middle Body: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-8 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>

        {/* Mobile Navigation Drawer & Bottom Bar */}
        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onOpen={() => setMobileMenuOpen(true)}
        />

        {/* Global Dialogs and Drawers */}
        <GlobalSearch />
        <NotificationDrawer />
        <FastLogModal
          isOpen={fastLogOpen}
          onClose={() => setFastLogOpen(false)}
        />
      </div>
    </ShellProvider>
  );
}

