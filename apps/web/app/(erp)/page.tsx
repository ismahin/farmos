"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Egg,
  Feather,
  Plus,
  Scale,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useShell } from "@/components/shell";
import { mockAlerts, mockApprovals, mockTasks } from "@/mocks/tasks";
import { mockProductionCycles } from "@/mocks/production";
import { mockStockPositions } from "@/mocks/inventory";
import { mockFinancialSnapshot } from "@/mocks/finance";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export default function HomePage() {
  const { currentFarm, setIsNotificationOpen } = useShell();

  // Active cycles on current farm
  const activeFlocks = mockProductionCycles.filter(
    (c) => c.status === "ACTIVE" && c.farmId === currentFarm.id
  );
  const totalLiveBirds = activeFlocks.reduce((acc, f) => acc + f.currentLiveBirds, 0);

  // Critical and high urgency items
  const criticalAlerts = mockAlerts.filter((a) => a.severity === "CRITICAL");
  const pendingApprovals = mockApprovals.filter((a) => a.status === "PENDING");
  const todayTasks = mockTasks.filter(
    (t) => t.dueDate === "2026-09-22" && t.status !== "COMPLETED"
  );
  const stockRisks = mockStockPositions.filter((s) => s.status !== "NORMAL");

  return (
    <div className="space-y-6">
      {/* Page Title & Exception Summary Banner (Section 3.4 & 14) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Operations Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status and operational priorities for{" "}
            <span className="font-semibold text-slate-700">{currentFarm.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/today">
            <Button variant="outline" size="sm">
              <CalendarCheck className="h-4 w-4 mr-1.5" />
              View Daily Tasks ({todayTasks.length})
            </Button>
          </Link>
          <Link href="/ai">
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              Hermes Briefing
            </Button>
          </Link>
        </div>
      </div>

      {/* Exception-oriented Banner: Answers "What needs my attention?" */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Exception Overview
              </span>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              What Needs Your Attention Today?
            </h2>
            <p className="text-xs text-slate-500">
              {criticalAlerts.length} critical issue, {stockRisks.length} stock risk,{" "}
              {pendingApprovals.length} pending approvals requiring manager authorization.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span>{criticalAlerts.length} Critical</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>{pendingApprovals.length} Approvals</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
              <CalendarCheck className="h-4 w-4 text-blue-600" />
              <span>{todayTasks.length} Due Today</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Rest Normal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Metric Cards: Production & Economics Snapshot */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Live Broilers On Farm"
          value={formatNumber(totalLiveBirds)}
          unit="birds"
          icon={<Egg className="h-5 w-5" />}
          change={{ value: "97.3% Livability", trend: "up" }}
          subtitle="Across House 01 & 03"
          status="normal"
        />

        <MetricCard
          title="Critical Feed Buffer"
          value="2.3"
          unit="days remaining"
          icon={<Boxes className="h-5 w-5 text-rose-600" />}
          change={{ value: "Grower Pellets Low", trend: "down" }}
          subtitle="Replenish needed by Sept 24"
          status="critical"
        />

        <MetricCard
          title="Next Scheduled Harvest"
          value="Sept 29"
          unit="(7 days)"
          icon={<Clock className="h-5 w-5" />}
          change={{ value: "House 01 (9,640 birds)", trend: "neutral" }}
          subtitle="Apex Poultry Processors"
          status="normal"
        />

        <MetricCard
          title="Cycle Profitability (Est.)"
          value={formatCurrency(mockFinancialSnapshot.mtdRevenue)}
          unit="MTD"
          icon={<CircleDollarSign className="h-5 w-5" />}
          change={{ value: "+37.8% Gross Margin", trend: "up" }}
          subtitle="Illustrative estimate"
          status="normal"
        />
      </div>

      {/* Two Column Layout: Critical Action Center & Today's Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Exceptions & Active Production Flocks */}
        <div className="space-y-6 lg:col-span-2">
          {/* Critical Issues & Alerts */}
          <Card className="border-rose-200/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2 text-rose-950">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  Critical Operational Issues
                </CardTitle>
                <CardDescription>
                  Urgent alerts requiring field or inventory interventions
                </CardDescription>
              </div>
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="text-xs font-semibold text-rose-700 hover:underline"
              >
                View All Alerts
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {alert.title}
                      </span>
                      <StatusBadge status="CRITICAL" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                  <Link href={alert.sourceLink}>
                    <Button variant="danger" size="sm" className="shrink-0 w-full sm:w-auto">
                      {alert.sourceLabel}
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}

              {/* Feed Stock Risk Warning */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      Feed Stock Depletion Risk: Broiler Grower Pellets
                    </span>
                    <StatusBadge status="WARNING" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Main Feed Store has 2,800 kg on hand with 1,200 kg reserved for today.
                    Stock will reach zero on Sept 24 without immediate delivery.
                  </p>
                </div>
                <Link href="/purchasing">
                  <Button variant="warning" size="sm" className="shrink-0 w-full sm:w-auto">
                    Review Requisition
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Active Production Snapshot */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Egg className="h-4 w-4 text-emerald-600" />
                  Active Broiler Cycles
                </CardTitle>
                <CardDescription>
                  Live flock performance, current age, livability, and harvest forecast
                </CardDescription>
              </div>
              <Link
                href="/production"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Production Workspace →
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeFlocks.map((flock) => (
                <Link
                  key={flock.id}
                  href={`/production/${flock.id}`}
                  className="block rounded-xl border border-slate-200 p-4 transition-all hover:border-emerald-500 hover:bg-emerald-50/20 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-950">
                          {flock.houseName} • {flock.flockCode}
                        </span>
                        <StatusBadge status={flock.status} />
                        <span className="text-xs font-medium text-slate-500">
                          Day {flock.dayOfCycle} of 42
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {flock.breed} • Placed {flock.startingBirds.toLocaleString()} DOCs •
                        Blueprint: {flock.blueprintName}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-right sm:text-left">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Live Count
                        </span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {flock.currentLiveBirds.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Avg Weight
                        </span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {flock.averageWeightGrams} g
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          FCR (Est.)
                        </span>
                        <span className="font-bold text-emerald-700 text-xs sm:text-sm">
                          {flock.fcr}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Pending Approvals & Today's Operational Tasks */}
        <div className="space-y-6">
          {/* Pending Approvals Widget */}
          <Card className="border-amber-200/80 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-amber-950">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Pending Approvals
                </CardTitle>
                <Badge variant="warning">{pendingApprovals.length}</Badge>
              </div>
              <CardDescription>
                High-risk actions awaiting authorized human sign-off
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingApprovals.map((appr) => (
                <div
                  key={appr.id}
                  className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-900">{appr.title}</span>
                    {appr.amount && (
                      <span className="font-bold text-slate-900">
                        ${appr.amount}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{appr.justification}</p>
                  <div className="pt-2 flex items-center justify-between border-t border-amber-100">
                    <span className="text-[10px] text-slate-500">
                      By {appr.requestedBy}
                    </span>
                    <Link href="/purchasing">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Review & Sign
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-emerald-600" />
                  Today&apos;s Priority Tasks
                </CardTitle>
                <CardDescription>
                  Operational routines due before shift end
                </CardDescription>
              </div>
              <Link
                href="/today"
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                All Tasks →
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {todayTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-200 p-3 text-xs space-y-1.5 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        task.priority === "CRITICAL"
                          ? "bg-rose-100 text-rose-800"
                          : task.priority === "HIGH"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{task.relatedLocation}</span>
                    <span>Due {task.dueTime || "Today"}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

