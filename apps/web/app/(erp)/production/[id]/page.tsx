"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Egg,
  Feather,
  FileText,
  LineChart,
  PackageOpen,
  PieChart,
  Plus,
  Scale,
  ShieldCheck,
  Syringe,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { MetricCard } from "@/components/ui/metric-card";
import { FastLogModal } from "@/components/shell/fast-log-modal";
import {
  mockDailyLogs,
  mockFeedIssueRecords,
  mockHarvestPlans,
  mockMortalityRecords,
  mockProductionCycles,
  mockVaccinations,
  mockWeightSamples,
} from "@/mocks/production";
import { mockCycleProfitability } from "@/mocks/finance";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";

export default function FlockDetailPage() {
  const params = useParams();
  const cycleId = params.id as string;
  const cycle =
    mockProductionCycles.find((c) => c.id === cycleId) || mockProductionCycles[0];

  const [activeTab, setActiveTab] = React.useState("overview");
  const [fastLogAction, setFastLogAction] = React.useState<
    "mortality" | "feed" | "weight" | null
  >(null);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Production", href: "/production" },
          { label: `${cycle.houseName} (${cycle.flockCode})` },
        ]}
      />

      {/* Flock Header Workspace */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {cycle.houseName} • {cycle.flockCode}
            </h1>
            <StatusBadge status={cycle.status} />
            <Badge variant="primary">{cycle.breed}</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Placed {cycle.startingBirds.toLocaleString()} chicks on {cycle.startDate} •
            Day <strong className="text-slate-800">{cycle.dayOfCycle}</strong> of 42 •
            Target Harvest: <strong className="text-slate-800">{cycle.targetHarvestDate}</strong>
          </p>
        </div>

        {/* Low-Input Contextual Action Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => setFastLogAction("mortality")}
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold"
          >
            <Feather className="h-4 w-4 mr-1.5" />
            Log Mortality
          </Button>
          <Button
            size="sm"
            onClick={() => setFastLogAction("feed")}
            variant="outline"
          >
            <PackageOpen className="h-4 w-4 mr-1.5" />
            Issue Feed
          </Button>
          <Button
            size="sm"
            onClick={() => setFastLogAction("weight")}
            variant="outline"
          >
            <Scale className="h-4 w-4 mr-1.5" />
            Sample Weight
          </Button>
        </div>
      </div>

      {/* KPI Metric Summary Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Current Live Birds
          </span>
          <span className="text-xl font-bold text-slate-900">
            {formatNumber(cycle.currentLiveBirds)}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {formatPercent(cycle.livabilityPct)} livability
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Cumulative Mortality
          </span>
          <span className="text-xl font-bold text-slate-900">
            {cycle.cumulativeMortality}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {formatPercent(cycle.cumulativeMortalityPct)} total
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Avg Bird Weight
          </span>
          <span className="text-xl font-bold text-slate-900">
            {cycle.averageWeightGrams} g
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            +30g vs Cobb curve
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Feed Consumed
          </span>
          <span className="text-xl font-bold text-slate-900">
            {formatNumber(cycle.cumulativeFeedKg)} kg
          </span>
          <span className="text-[10px] text-slate-500 block">Grower Pellets</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            FCR (Illustrative)
          </span>
          <span className="text-xl font-bold text-emerald-700">
            {cycle.fcr}
          </span>
          <span className="text-[10px] text-slate-500 block">target ≤ 1.50</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Days to Harvest
          </span>
          <span className="text-xl font-bold text-slate-900">
            {42 - cycle.dayOfCycle} d
          </span>
          <span className="text-[10px] text-slate-500 block">Day 42 Target</span>
        </div>
      </div>

      {/* Production Workspace Tabs (Section 18) */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Fast-Log</TabsTrigger>
          <TabsTrigger value="mortality">Mortality Journal</TabsTrigger>
          <TabsTrigger value="feed">Feed Issues</TabsTrigger>
          <TabsTrigger value="weights">Growth Curve</TabsTrigger>
          <TabsTrigger value="health">Vaccines & Health</TabsTrigger>
          <TabsTrigger value="harvest">Harvest Plan</TabsTrigger>
          <TabsTrigger value="economics">Cycle P&L</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Blueprint & Specification Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Blueprint & Placement Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Operating Blueprint:</span>
                  <span className="font-semibold text-slate-900">
                    {cycle.blueprintName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Breed / Strain:</span>
                  <span className="font-semibold text-slate-900">{cycle.breed}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Starting DOC Count:</span>
                  <span className="font-semibold text-slate-900">
                    {formatNumber(cycle.startingBirds)} birds
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Placement Date:</span>
                  <span className="font-semibold text-slate-900">{cycle.startDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Scheduled End / Harvest:</span>
                  <span className="font-semibold text-slate-900">
                    {cycle.targetHarvestDate} (Day 42)
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Allocated Processor:</span>
                  <span className="font-semibold text-emerald-700">
                    Apex Poultry Processors Ltd.
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Environmental & Health Snapshot */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  Live House Environmental Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Internal Temperature
                    </span>
                    <span className="text-lg font-bold text-slate-900">24.5°C</span>
                    <span className="text-[10px] text-emerald-600 block">Optimal</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Relative Humidity
                    </span>
                    <span className="text-lg font-bold text-slate-900">62%</span>
                    <span className="text-[10px] text-emerald-600 block">Within Spec</span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    Heat Event on Day 27 Note
                  </div>
                  <p className="mt-1 text-slate-600 text-[11px]">
                    Fan bank 2 power fault caused a temporary 31°C reading on Sept 21.
                    Back-up breaker engaged; ventilation restored within 45 mins.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: DAILY FAST-LOG */}
        <TabsContent value="daily" className="space-y-4 pt-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead className="text-right">Mortality</TableHead>
                  <TableHead className="text-right">Feed (kg)</TableHead>
                  <TableHead className="text-right">Water (L)</TableHead>
                  <TableHead className="text-right">Temp (°C)</TableHead>
                  <TableHead>Observations & Notes</TableHead>
                  <TableHead>Operator</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDailyLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {log.date}
                    </TableCell>
                    <TableCell>Day {log.dayNumber}</TableCell>
                    <TableCell className="text-right font-bold text-slate-800">
                      {log.mortalityCount}
                    </TableCell>
                    <TableCell className="text-right text-slate-800">
                      {formatNumber(log.feedConsumedKg)}
                    </TableCell>
                    <TableCell className="text-right text-slate-800">
                      {formatNumber(log.waterLiters)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {log.temperatureCelsius}°C
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                      {log.notes}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {log.recordedBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 3: MORTALITY JOURNAL */}
        <TabsContent value="mortality" className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Low-input mortality logging: known farm, house, and flock context are inherited automatically.
            </span>
            <Button
              size="sm"
              onClick={() => setFastLogAction("mortality")}
              className="bg-slate-800 hover:bg-slate-900 text-white"
            >
              <Feather className="h-4 w-4 mr-1.5" />
              + Record Mortality
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Observed Cause</TableHead>
                  <TableHead>Field Evidence & Notes</TableHead>
                  <TableHead>Recorded By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMortalityRecords.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {m.createdAt}
                    </TableCell>
                    <TableCell>Day {m.dayNumber}</TableCell>
                    <TableCell className="text-right font-bold text-rose-700">
                      {m.count} birds
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{m.cause}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {m.evidenceNotes || "Routine morning removal"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {m.recordedBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 4: FEED ISSUES */}
        <TabsContent value="feed" className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Traceable feed issuances linked to inventory lots and cost ledger.
            </span>
            <Button
              size="sm"
              onClick={() => setFastLogAction("feed")}
              variant="outline"
            >
              <PackageOpen className="h-4 w-4 mr-1.5" />
              + Issue Feed to House
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Feed Product</TableHead>
                  <TableHead>Originating Lot #</TableHead>
                  <TableHead>Source Warehouse</TableHead>
                  <TableHead className="text-right">Issued Quantity</TableHead>
                  <TableHead>Storekeeper</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFeedIssueRecords.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {f.createdAt}
                    </TableCell>
                    <TableCell>Day {f.dayNumber}</TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {f.feedItemName}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-emerald-800 font-semibold">
                      {f.lotNumber}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {f.warehouseName}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatNumber(f.quantityKg)} kg
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {f.recordedBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 5: WEIGHTS & GROWTH CURVE */}
        <TabsContent value="weights" className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Weekly randomized sampling vs Cobb 500 reference growth standard.
            </span>
            <Button
              size="sm"
              onClick={() => setFastLogAction("weight")}
              variant="outline"
            >
              <Scale className="h-4 w-4 mr-1.5" />
              + Sample Weights
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sampling Date</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead className="text-right">Sample Size</TableHead>
                  <TableHead className="text-right">Observed Avg Weight</TableHead>
                  <TableHead className="text-right">Target Weight</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">Flock Uniformity</TableHead>
                  <TableHead>Attending Vet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWeightSamples.map((w) => {
                  const diff = w.averageWeightGrams - w.targetWeightGrams;
                  return (
                    <TableRow key={w.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {w.date}
                      </TableCell>
                      <TableCell>Day {w.dayNumber}</TableCell>
                      <TableCell className="text-right">{w.sampleSize} birds</TableCell>
                      <TableCell className="text-right font-bold text-slate-900">
                        {w.averageWeightGrams} g
                      </TableCell>
                      <TableCell className="text-right text-slate-500">
                        {w.targetWeightGrams} g
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          diff >= 0 ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {diff >= 0 ? `+${diff} g` : `${diff} g`}
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-800">
                        {w.uniformityPct}%
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {w.recordedBy}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 6: VACCINES & HEALTH */}
        <TabsContent value="health" className="space-y-4 pt-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin Date</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Vaccine / Treatment</TableHead>
                  <TableHead>Target Disease</TableHead>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Administered By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVaccinations.map((vac) => (
                  <TableRow key={vac.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {vac.date}
                    </TableCell>
                    <TableCell>Day {vac.dayNumber}</TableCell>
                    <TableCell className="font-bold text-slate-800">
                      {vac.vaccineName}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {vac.targetDisease}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-700">
                      {vac.lotNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{vac.administrationMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={vac.status} />
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {vac.administeredBy || "Pending"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 7: HARVEST PLAN */}
        <TabsContent value="harvest" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Slaughter & Harvest Schedule</CardTitle>
              <CardDescription>
                Projected output lots and commercial delivery allocations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Expected Harvest Date
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    {cycle.targetHarvestDate}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    At 42 Days of Age
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Projected Live Weight
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    {((cycle.currentLiveBirds * 2450) / 1000).toFixed(0)} kg
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Target: 2.45 kg / bird
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Buyer Contract
                  </span>
                  <span className="text-lg font-bold text-emerald-800">
                    Apex Processors
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Contract Rate: $4.40 / bird
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 8: CYCLE P&L / ECONOMICS (Section 22 & 18) */}
        <TabsContent value="economics" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Cycle Cost Accumulation & Profitability (Provisional View)
                  </CardTitle>
                  <CardDescription>
                    Illustrative cost-center breakdown; authoritative financial journals owned by backend
                  </CardDescription>
                </div>
                <Badge variant="primary">Demonstration Data</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Top Financial Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Projected Revenue
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {formatCurrency(mockCycleProfitability.totalRevenue)}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Accumulated Cost
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {formatCurrency(mockCycleProfitability.totalCost)}
                  </span>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-center border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Estimated Net Margin
                  </span>
                  <span className="text-base font-bold text-emerald-700">
                    {formatCurrency(mockCycleProfitability.netMargin)}
                  </span>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-center border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Gross Margin %
                  </span>
                  <span className="text-base font-bold text-emerald-700">
                    {mockCycleProfitability.grossMarginPct}%
                  </span>
                </div>
              </div>

              {/* Cost Component Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Cost Component Breakdown
                </h4>
                <div className="space-y-2">
                  {mockCycleProfitability.costBreakdown.map((item) => (
                    <div
                      key={item.category}
                      className="rounded-xl border border-slate-100 bg-white p-3 space-y-1.5"
                    >
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800">
                          {item.category.replace("_", " ")} ({item.percentage}%)
                        </span>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">{item.unitCostDesc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contextual Fast Log Modal */}
      {fastLogAction && (
        <FastLogModal
          isOpen={true}
          defaultAction={fastLogAction}
          onClose={() => setFastLogAction(null)}
        />
      )}
    </div>
  );
}

