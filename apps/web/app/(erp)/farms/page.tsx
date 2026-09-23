"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Boxes,
  Building2,
  Egg,
  Layers,
  MapPin,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useShell } from "@/components/shell";
import { mockFarms } from "@/mocks/farms";

export default function FarmsPage() {
  const { currentFarm, setCurrentFarmId } = useShell();
  const { farms, currentFarm, setCurrentFarmId, auth } = useShell();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Operational Farms Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical farm sites, active production units, and capacity allocation
          </p>
        </div>

        <Link href="/onboarding">
          <Button size="sm" className="font-semibold">
            <Plus className="h-4 w-4 mr-1.5" />
            + Compose New Farm
          </Button>
        </Link>
        {auth.hasPermission("farm.create") && (
          <Link href="/onboarding">
            <Button size="sm" className="font-semibold">
              <Plus className="h-4 w-4 mr-1.5" />
              + Compose New Farm
            </Button>
          </Link>
        )}
      </div>

      {/* Farm Directory Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {mockFarms.map((farm) => {
          const isSelected = farm.id === currentFarm.id;
      {/* Empty State when no accessible farms */}
      {farms.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Accessible Farms Found"
          description="You do not have any assigned operational farms within this tenant organization."
          action={
            auth.hasPermission("farm.create") ? (
              <Link href="/onboarding">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Compose Your First Farm
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        /* Farm Directory Cards Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {farms.map((farm) => {
            const isSelected = farm.id === currentFarm.id;

          return (
            <Card
              key={farm.id}
              className={`transition-all ${
                isSelected
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                  : "hover:border-slate-300"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-bold text-slate-900">
                        {farm.name}
                      </CardTitle>
                      <StatusBadge status={farm.status} />
            return (
              <Card
                key={farm.id}
                className={`transition-all ${
                  isSelected
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                    : "hover:border-slate-300"
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold text-slate-900">
                          {farm.name}
                        </CardTitle>
                        <StatusBadge status={farm.status} />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{farm.location}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] font-semibold text-slate-600">
                          {farm.code}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{farm.location}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] font-semibold text-slate-600">
                        {farm.code}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <Badge variant="success">Active Context</Badge>
                  ) : (
                    <button
                      onClick={() => setCurrentFarmId(farm.id)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      Select Farm
                    </button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Enabled Enterprises */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Enterprises
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {farm.enabledEnterprises.map((ent) => (
                      <span
                        key={ent}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                    {isSelected ? (
                      <Badge variant="success">Active Context</Badge>
                    ) : (
                      <button
                        onClick={() => setCurrentFarmId(farm.id)}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        <Egg className="h-3.5 w-3.5 text-emerald-600" />
                        {ent === "POULTRY_BROILER" ? "Broiler Poultry" : ent}
                      </span>
                    ))}
                        Select Farm
                      </button>
                    )}
                  </div>
                </div>
                </CardHeader>

                {/* Facilities & Metrics Overview */}
                <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Houses
                <CardContent className="space-y-4">
                  {/* Enabled Enterprises */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Active Enterprises
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {farm.houses.length}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {farm.totalCapacity.toLocaleString()} cap
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {farm.enabledEnterprises.map((ent) => (
                        <span
                          key={ent}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                        >
                          <Egg className="h-3.5 w-3.5 text-emerald-600" />
                          {ent === "POULTRY_BROILER" ? "Broiler Poultry" : ent}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Warehouses
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {farm.warehouses.length}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Stores</span>
                  </div>
                  {/* Facilities & Metrics Overview */}
                  <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Houses
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        {farm.houses.length}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {farm.totalCapacity.toLocaleString()} cap
                      </span>
                    </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Active Flocks
                    </span>
                    <span className="text-base font-bold text-emerald-700">
                      {farm.activeCycleCount}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Cycles</span>
                  </div>
                </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Warehouses
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        {farm.warehouses.length}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Stores</span>
                    </div>

                {/* Risk and Alert indicators */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    {farm.criticalCount > 0 && (
                      <span className="flex items-center gap-1 text-rose-600 font-semibold">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {farm.criticalCount} Critical
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Active Flocks
                      </span>
                    )}
                    {farm.warningCount > 0 && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {farm.warningCount} Warnings
                      <span className="text-base font-bold text-emerald-700">
                        {farm.activeCycleCount}
                      </span>
                    )}
                    {farm.criticalCount === 0 && farm.warningCount === 0 && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Normal operation
                      </span>
                    )}
                      <span className="text-[10px] text-slate-500 block">Cycles</span>
                    </div>
                  </div>

                  <Link
                    href={`/farms/${farm.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-700"
                  >
                    Farm Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
                  {/* Risk and Alert indicators */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      {farm.criticalCount > 0 && (
                        <span className="flex items-center gap-1 text-rose-600 font-semibold">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {farm.criticalCount} Critical
                        </span>
                      )}
                      {farm.warningCount > 0 && (
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {farm.warningCount} Warnings
                        </span>
                      )}
                      {farm.criticalCount === 0 && farm.warningCount === 0 && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Normal operation
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/farms/${farm.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-700"
                    >
                      Farm Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

