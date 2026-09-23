"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Egg,
  Layers,
  MapPin,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useShell } from "@/components/shell";
import { mockFarms } from "@/mocks/farms";

export default function FarmDetailPage() {
  const params = useParams();
  const farmId = params.id as string;
  const farm = mockFarms.find((f) => f.id === farmId) || mockFarms[0];
  const { farms } = useShell();
  const farm = farms.find((f) => f.id === farmId) || mockFarms.find((f) => f.id === farmId) || mockFarms[0];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Farms", href: "/farms" },
          { label: farm.name },
        ]}
      />

      {/* Farm Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {farm.name}
            </h1>
            <StatusBadge status={farm.status} />
            <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {farm.code}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{farm.location}</span>
            <span>•</span>
            <span>Timezone: {farm.timezone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/production">
            <Button size="sm">
              <Egg className="h-4 w-4 mr-1.5" />
              Active Flocks
            </Button>
          </Link>
        </div>
      </div>

      {/* Facilities: Production Units (Houses) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              Poultry Production Units ({farm.houses.length})
            </h2>
            <p className="text-xs text-slate-500">
              Physical houses, current biological occupancy, and flock lifecycles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {farm.houses.map((house) => (
            <Card key={house.id} className="hover:border-slate-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      {house.name}
                    </CardTitle>
                    <span className="font-mono text-[11px] text-slate-400">
                      {house.code} • Capacity: {house.capacity.toLocaleString()} birds
                    </span>
                  </div>
                  <StatusBadge status={house.status} />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {house.currentFlockId ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950">
                        Flock {house.currentFlockCode}
                      </span>
                      <Badge variant="success">Day {house.daysActive} of 42</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block">
                          Current Live
                        </span>
                        <span className="font-bold text-slate-900">
                          {house.currentBirds?.toLocaleString()} birds
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block">
                          Density
                        </span>
                        <span className="font-bold text-slate-900">
                          {((house.currentBirds || 0) / house.capacity * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-100 flex justify-end">
                      <Link
                        href={`/production/${house.currentFlockId}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                      >
                        Open Control Center
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center space-y-1">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Empty / Cleanout Phase
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Sanitization and fogging in progress. Next placement scheduled.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Storage Facilities: Warehouses */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="h-4 w-4 text-emerald-600" />
              On-Farm Storage Warehouses ({farm.warehouses.length})
            </h2>
            <p className="text-xs text-slate-500">
              Bulk feed silos, medication depots, and biosecurity storage
            </p>
          </div>
          <Link href="/stock">
            <span className="text-xs font-semibold text-emerald-600 hover:underline">
              Inventory Ledger →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {farm.warehouses.map((wh) => (
            <Card key={wh.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{wh.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{wh.code}</p>
                  </div>
                  <Badge variant="secondary">{wh.type} Store</Badge>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Storage Occupancy:</span>
                    <span className="font-semibold text-slate-900">
                      {wh.currentOccupancyPct}% ({((wh.capacityKg * wh.currentOccupancyPct) / 100).toLocaleString()} kg)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${wh.currentOccupancyPct}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

