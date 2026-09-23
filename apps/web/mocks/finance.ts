import { CycleProfitability, FinancialSnapshot } from "../types";

export const mockFinancialSnapshot: FinancialSnapshot = {
  cashBalance: 64250,
  mtdRevenue: 48900,
  receivablesTotal: 16600,
  payablesTotal: 14200,
  currentCycleEstimatedCost: 19840,
  currency: "USD",
};

export const mockCycleProfitability: CycleProfitability = {
  cycleId: "flock-2609-03",
  flockCode: "BR-2609-03",
  houseName: "House 03",
  startingBirds: 10000,
  marketableBirds: 9820,
  totalLiveWeightKg: 14239,
  totalRevenue: 43208, // Projected based on contract rate $4.40/bird
  totalCost: 26850,
  netMargin: 16358,
  grossMarginPct: 37.8,
  costPerBird: 2.73,
  costPerKg: 1.88,
  revenuePerKg: 3.03,
  currency: "USD",
  costBreakdown: [
    {
      category: "FEED",
      amount: 14760,
      percentage: 55.0,
      unitCostDesc: "Starter ($0.52/kg) + Grower ($0.45/kg) + Finisher ($0.42/kg)",
    },
    {
      category: "CHICKS",
      amount: 6800,
      percentage: 25.3,
      unitCostDesc: "10,000 Cobb 500 DOC @ $0.68/chick delivered",
    },
    {
      category: "LABOR",
      amount: 2150,
      percentage: 8.0,
      unitCostDesc: "Dedicated house operators & weekend relief",
    },
    {
      category: "MEDICINE_VACCINE",
      amount: 1420,
      percentage: 5.3,
      unitCostDesc: "Marek's, Newcastle B1/LaSota, Gumboro, Biosecurity fogging",
    },
    {
      category: "UTILITIES_BEDDING",
      amount: 1120,
      percentage: 4.2,
      unitCostDesc: "Wood shavings bedding, generator fuel, electricity, water",
    },
    {
      category: "OVERHEAD",
      amount: 600,
      percentage: 2.2,
      unitCostDesc: "Depreciation allocation, farm maintenance, supervision",
    },
  ],
};

