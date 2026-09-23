/**
 * Financial metrics and cycle profitability models.
 * Note: Purely illustrative for M01 prototyping; authoritative financial
 * and costing ledgers belong to backend domain services.
 */

export interface CostComponent {
  category: "CHICKS" | "FEED" | "MEDICINE_VACCINE" | "LABOR" | "UTILITIES_BEDDING" | "OVERHEAD";
  amount: number;
  percentage: number;
  unitCostDesc: string;
}

export interface CycleProfitability {
  cycleId: string;
  flockCode: string;
  houseName: string;
  startingBirds: number;
  marketableBirds: number;
  totalLiveWeightKg: number;
  totalRevenue: number;
  totalCost: number;
  netMargin: number;
  grossMarginPct: number;
  costPerBird: number;
  costPerKg: number;
  revenuePerKg: number;
  currency: string;
  costBreakdown: CostComponent[];
}

export interface FinancialSnapshot {
  cashBalance: number;
  mtdRevenue: number;
  receivablesTotal: number;
  payablesTotal: number;
  currentCycleEstimatedCost: number;
  currency: string;
}

