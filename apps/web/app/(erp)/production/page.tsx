"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CalendarCheck,
  Clock,
  Egg,
  Feather,
  Filter,
  Plus,
  Scale,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { FastLogModal } from "@/components/shell/fast-log-modal";
import { mockProductionCycles } from "@/mocks/production";
import { formatNumber, formatPercent } from "@/lib/formatters";

export default function ProductionPage() {
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "ACTIVE" | "CLOSED">("ACTIVE");
  const [fastLogOpen, setFastLogOpen] = React.useState(false);

  const filteredCycles = mockProductionCycles.filter((c) => {
    if (statusFilter === "ACTIVE") return c.status === "ACTIVE";
    if (statusFilter === "CLOSED") return c.status === "CLOSED";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Poultry Production & Cycle Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage active broiler flocks, growth curves, mortality journals, and harvest readiness
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setFastLogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-1.5" />
            Field Fast-Log
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5">
          {(
            [
              ["ACTIVE", "Active Cycles (2)"],
              ["ALL", "All Historical Flocks (3)"],
              ["CLOSED", "Closed / Harvested (1)"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === key
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">
          Provisional ProductionCycle view models
        </span>
      </div>

      {/* Production Cycles Table (Section 17) */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>House & Flock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Age / Breed</TableHead>
              <TableHead className="text-right">Live Birds</TableHead>
              <TableHead className="text-right">Mortality %</TableHead>
              <TableHead className="text-right">Avg Weight</TableHead>
              <TableHead className="text-right">Feed Consumed</TableHead>
              <TableHead className="text-right">FCR (Est.)</TableHead>
              <TableHead>Expected Harvest</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCycles.map((cycle) => (
              <TableRow key={cycle.id}>
                <TableCell className="font-semibold text-slate-900">
                  <Link
                    href={`/production/${cycle.id}`}
                    className="hover:text-emerald-700 transition-colors block"
                  >
                    <div>{cycle.houseName}</div>
                    <span className="font-mono text-xs text-slate-400 font-normal">
                      {cycle.flockCode}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={cycle.status} />
                </TableCell>
                <TableCell>
                  <div className="text-xs font-medium text-slate-800">
                    Day {cycle.dayOfCycle} / 42
                  </div>
                  <div className="text-[10px] text-slate-400">{cycle.breed}</div>
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900">
                  {formatNumber(cycle.currentLiveBirds)}
                  <div className="text-[10px] text-slate-400 font-normal">
                    of {formatNumber(cycle.startingBirds)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-semibold text-xs ${
                      cycle.cumulativeMortalityPct > 3.0
                        ? "text-amber-700"
                        : "text-slate-800"
                    }`}
                  >
                    {formatPercent(cycle.cumulativeMortalityPct)}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    ({cycle.cumulativeMortality} birds)
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-slate-900">
                  {cycle.averageWeightGrams} g
                  <div className="text-[10px] text-slate-400">
                    target: {cycle.targetWeightGrams} g
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-800">
                  {formatNumber(cycle.cumulativeFeedKg)} kg
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={cycle.fcr <= 1.45 ? "success" : "default"}>
                    {cycle.fcr}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-slate-800 font-medium">
                    {cycle.targetHarvestDate}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {cycle.status === "ACTIVE"
                      ? `In ${42 - cycle.dayOfCycle} days`
                      : "Completed"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/production/${cycle.id}`}>
                    <Button variant="outline" size="sm" className="h-8">
                      Workspace
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Low-input Fast Log Modal */}
      <FastLogModal
        isOpen={fastLogOpen}
        onClose={() => setFastLogOpen(false)}
      />
    </div>
  );
}

