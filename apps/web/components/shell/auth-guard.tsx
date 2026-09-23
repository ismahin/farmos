"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, X } from "lucide-react";
import { useAuth } from "./auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoadingSession, forbiddenError, clearForbiddenError } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoadingSession && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoadingSession, isAuthenticated, router]);

  if (isLoadingSession) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600 animate-pulse">
            Connecting to FarmOS...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {forbiddenError && (
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-800 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
            <span>
              <strong>Access Denied:</strong> {forbiddenError.message}
              {forbiddenError.correlationId && (
                <span className="ml-2 font-mono text-[11px] text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                  Ref: {forbiddenError.correlationId}
                </span>
              )}
            </span>
          </div>
          <button
            onClick={clearForbiddenError}
            className="rounded p-1 text-rose-600 hover:bg-rose-100"
            aria-label="Dismiss access error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      {children}
    </>
  );
}

