"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, X } from "lucide-react";
import { useShell } from "./context";
import { mockAlerts, mockApprovals } from "@/mocks/tasks";

export function NotificationDrawer() {
  const { isNotificationOpen, setIsNotificationOpen } = useShell();

  if (!isNotificationOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Notifications & Exceptions
              </h2>
              <p className="text-xs text-slate-500">
                Action items requiring immediate farm management review
              </p>
            </div>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Critical Alerts Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Critical Issues
                </span>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                  {mockAlerts.filter((a) => a.severity === "CRITICAL").length} Active
                </span>
              </div>
              <div className="space-y-2.5">
                {mockAlerts
                  .filter((a) => a.severity === "CRITICAL")
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs shadow-xs"
                    >
                      <p className="font-semibold text-rose-900">{alert.title}</p>
                      <p className="mt-1 text-slate-700 leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-rose-100">
                        <span className="text-[10px] text-slate-500">
                          {alert.timestamp}
                        </span>
                        <Link
                          href={alert.sourceLink}
                          onClick={() => setIsNotificationOpen(false)}
                          className="inline-flex items-center gap-1 font-semibold text-rose-700 hover:text-rose-900"
                        >
                          {alert.sourceLabel}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pending Approvals Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Pending Approvals
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  {mockApprovals.length} Pending
                </span>
              </div>
              <div className="space-y-2.5">
                {mockApprovals.map((appr) => (
                  <div
                    key={appr.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-xs shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-amber-950">{appr.title}</p>
                      {appr.amount && (
                        <span className="font-bold text-slate-900">
                          ${appr.amount}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-slate-600">{appr.justification}</p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-100">
                      <span className="text-[10px] text-slate-500">
                        Requested by {appr.requestedBy}
                      </span>
                      <Link
                        href="/purchasing"
                        onClick={() => setIsNotificationOpen(false)}
                        className="inline-flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950"
                      >
                        Review PR
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Warnings & Notices */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Farm Operations Notices
                </span>
              </div>
              <div className="space-y-2.5">
                {mockAlerts
                  .filter((a) => a.severity !== "CRITICAL")
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs"
                    >
                      <p className="font-medium text-slate-900">{alert.title}</p>
                      <p className="mt-1 text-slate-600">{alert.message}</p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{alert.timestamp}</span>
                        <Link
                          href={alert.sourceLink}
                          onClick={() => setIsNotificationOpen(false)}
                          className="font-medium text-slate-700 hover:text-emerald-700"
                        >
                          {alert.sourceLabel}
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              All systems online
            </span>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="text-xs font-medium text-slate-700 hover:text-slate-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

