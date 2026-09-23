"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CircleDollarSign,
  Clock,
  CreditCard,
  DollarSign,
  Egg,
  FileSpreadsheet,
  PieChart,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockCycleProfitability, mockFinancialSnapshot } from "@/mocks/finance";
import { formatCurrency } from "@/lib/formatters";

export default function MoneyPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Farm Financial Snapshot & Cycle Economics
            </h1>
            <Badge variant="primary">Illustrative View</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive cash, receivables, supplier obligations, and unit-level broiler profitability
          </p>
        </div>
      </div>

      {/* Top Level Financial Position KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Operating Cash Balance"
          value={formatCurrency(mockFinancialSnapshot.cashBalance)}
          unit="USD"
          icon={<CircleDollarSign className="h-5 w-5 text-emerald-600" />}
          change={{ value: "+$12,400 this month", trend: "up" }}
          subtitle="Primary Operating Account"
          status="normal"
        />

        <MetricCard
          title="Revenue (Month-to-Date)"
          value={formatCurrency(mockFinancialSnapshot.mtdRevenue)}
          unit="USD"
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          change={{ value: "2 completed cycles", trend: "up" }}
          subtitle="Broiler contract sales"
          status="normal"
        />

        <MetricCard
          title="Accounts Receivable (AR)"
          value={formatCurrency(mockFinancialSnapshot.receivablesTotal)}
          unit="USD"
          icon={<CreditCard className="h-5 w-5 text-amber-600" />}
          change={{ value: "$4,200 due in 7d", trend: "neutral" }}
          subtitle="Apex Processors & Supermarkets"
          status="normal"
        />

        <MetricCard
          title="Accounts Payable (AP)"
          value={formatCurrency(mockFinancialSnapshot.payablesTotal)}
          unit="USD"
          icon={<CreditCard className="h-5 w-5 text-slate-600" />}
          change={{ value: "Unga Feeds & Kenchic", trend: "neutral" }}
          subtitle="Supplier feed & DOC balances"
          status="normal"
        />
      </div>

      {/* Broiler Cycle Profitability (Flock BR-2609-03) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Egg className="h-4 w-4 text-emerald-600" />
                Active Cycle Profitability: {mockCycleProfitability.flockCode} ({mockCycleProfitability.houseName})
              </CardTitle>
              <CardDescription>
                Projected unit economics based on actual feed issues, chick placement cost, and contract revenue
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Gross Margin: {mockCycleProfitability.grossMarginPct}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Unit Cost Comparison Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Cost Per Bird
              </span>
              <span className="text-base font-bold text-slate-900">
                ${mockCycleProfitability.costPerBird.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block">All inputs included</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Cost Per kg Liveweight
              </span>
              <span className="text-base font-bold text-slate-900">
                ${mockCycleProfitability.costPerKg.toFixed(2)} / kg
              </span>
              <span className="text-[10px] text-slate-500 block">Based on 1.45 kg avg</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Projected Revenue / kg
              </span>
              <span className="text-base font-bold text-emerald-700">
                ${mockCycleProfitability.revenuePerKg.toFixed(2)} / kg
              </span>
              <span className="text-[10px] text-slate-500 block">Contract benchmark</span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Projected Net Profit
              </span>
              <span className="text-base font-bold text-emerald-800">
                {formatCurrency(mockCycleProfitability.netMargin)}
              </span>
              <span className="text-[10px] text-emerald-600 block">House 03 batch</span>
            </div>
          </div>

          {/* Cost Allocation Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detailed Input Cost Allocation
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cost Category</TableHead>
                  <TableHead>Driver Description</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                  <TableHead className="text-right">Allocated Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCycleProfitability.costBreakdown.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell className="font-bold text-slate-900">
                      {item.category.replace("_", " ")}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {item.unitCostDesc}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-800">
                      {item.percentage}%
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

