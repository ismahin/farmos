"use client";

import * as React from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  Egg,
  Feather,
  LineChart as LineChartIcon,
  PackageOpen,
  Scale,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { mockProductionCycles, mockWeightSamples } from "@/mocks/production";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Operational Analytics & Growth Projections
            </h1>
            <Badge variant="primary">Semantic Metric Layer Prototype</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Planned vs Actual performance curves, mortality projections, and cross-farm comparisons
          </p>
        </div>
      </div>

      {/* KPI Comparison Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Overall Livability (Active Flocks)"
          value="97.3%"
          unit="livability"
          icon={<Egg className="h-5 w-5 text-emerald-600" />}
          change={{ value: "+0.8% vs blueprint standard", trend: "up" }}
          subtitle="Industry benchmark: 96.5%"
          status="normal"
        />

        <MetricCard
          title="Weighted Farm FCR"
          value="1.46"
          unit="kg feed / kg meat"
          icon={<Scale className="h-5 w-5 text-emerald-600" />}
          change={{ value: "Efficient feed conversion", trend: "up" }}
          subtitle="Target ≤ 1.50"
          status="normal"
        />

        <MetricCard
          title="Average Daily Gain (ADG)"
          value="51.8"
          unit="g / bird / day"
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          change={{ value: "+2.2g ahead of schedule", trend: "up" }}
          subtitle="Cobb 500 Broiler Standard"
          status="normal"
        />

        <MetricCard
          title="Projected Harvest Output"
          value="47.1"
          unit="metric tonnes"
          icon={<Calendar className="h-5 w-5 text-slate-600" />}
          change={{ value: "Next 14 days", trend: "neutral" }}
          subtitle="19,460 total birds ready"
          status="normal"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Weight Gain Curve vs Cobb 500 Target */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <LineChartIcon className="h-4 w-4 text-emerald-600" />
                  Growth Curve: Actual vs Target Weight (House 03)
                </CardTitle>
                <CardDescription>
                  Day 1 to Day 28 sample weights vs Cobb 500 standard curve
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Actual Weight
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  Target Curve
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Visual Bar / Curve representation */}
            <div className="space-y-4">
              {[
                { day: "Day 7", actual: 185, target: 180, pct: 15 },
                { day: "Day 14", actual: 470, target: 460, pct: 32 },
                { day: "Day 21", actual: 935, target: 910, pct: 64 },
                { day: "Day 28", actual: 1450, target: 1420, pct: 100 },
              ].map((point) => (
                <div key={point.day} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{point.day}</span>
                    <span className="text-slate-900 font-bold">
                      {point.actual} g{" "}
                      <span className="text-slate-400 font-normal">
                        (target: {point.target} g)
                      </span>
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-md bg-slate-100 overflow-hidden flex items-center p-0.5">
                    <div
                      className="h-full bg-emerald-600 rounded-sm transition-all"
                      style={{ width: `${point.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-slate-400 text-center">
              Sampled across 100 birds • Uniformity 88%
            </p>
          </CardContent>
        </Card>

        {/* Chart 2: Cumulative Mortality Trend */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Feather className="h-4 w-4 text-rose-600" />
                  Cumulative Mortality by Week (%)
                </CardTitle>
                <CardDescription>
                  Tracking flock livability within allowable commercial thresholds (&lt; 4%)
                </CardDescription>
              </div>
              <Badge variant="primary">Threshold ≤ 4.0%</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {[
                { week: "Week 1 (Days 1-7)", deaths: 42, pct: "0.42%", bar: 15 },
                { week: "Week 2 (Days 8-14)", deaths: 35, pct: "0.77%", bar: 28 },
                { week: "Week 3 (Days 15-21)", deaths: 48, pct: "1.25%", bar: 45 },
                { week: "Week 4 (Days 22-28)", deaths: 55, pct: "1.80%", bar: 65 },
              ].map((w) => (
                <div key={w.week} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{w.week}</span>
                    <span className="text-slate-900 font-bold">
                      {w.pct} Cumulative{" "}
                      <span className="text-slate-400 font-normal">
                        ({w.deaths} deaths)
                      </span>
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-md bg-slate-100 overflow-hidden flex items-center p-0.5">
                    <div
                      className="h-full bg-slate-700 rounded-sm transition-all"
                      style={{ width: `${w.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Total Broiler Livability: <strong className="text-emerald-700 font-bold">98.2%</strong></span>
              <span>Acceptable commercial limit</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Farm Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            Cross-Farm Operational Comparison
          </CardTitle>
          <CardDescription>
            Benchmark key efficiency KPIs across active organizational farm sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/20 p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    North Integrated Farm (NIF-01)
                  </h4>
                  <p className="text-xs text-slate-500">Active Commercial Production</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="rounded-lg bg-white p-2 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block">FCR</span>
                  <span className="font-bold text-slate-900">1.46</span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block">Livability</span>
                  <span className="font-bold text-slate-900">97.3%</span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block">Capacity</span>
                  <span className="font-bold text-slate-900">30k birds</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 opacity-75">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    South Valley Farm (SVF-02)
                  </h4>
                  <p className="text-xs text-slate-500">Planned Site / Commissioning</p>
                </div>
                <Badge variant="secondary">Planned</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="rounded-lg bg-white p-2 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block">FCR</span>
                  <span className="font-bold text-slate-400">—</span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block">Livability</span>
                  <span className="font-bold text-slate-400">—</span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block">Capacity</span>
                  <span className="font-bold text-slate-900">20k birds</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

