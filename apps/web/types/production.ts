/**
 * Poultry Production and ProductionCycle domain types.
 * Provisional frontend view models for M01.
 */

export type CycleStatus =
  | "DRAFT"
  | "PLANNED"
  | "READY"
  | "ACTIVE"
  | "HARVESTING"
  | "CLOSING"
  | "CLOSED"
  | "CANCELLED";

export interface ProductionCycle {
  id: string;
  farmId: string;
  houseId: string;
  houseName: string;
  flockCode: string;
  enterpriseType: "POULTRY_BROILER" | "POULTRY_LAYER";
  status: CycleStatus;
  startDate: string;
  targetHarvestDate: string;
  dayOfCycle: number;
  breed: string;
  startingBirds: number;
  currentLiveBirds: number;
  cumulativeMortality: number;
  cumulativeMortalityPct: number;
  averageWeightGrams: number;
  targetWeightGrams: number;
  cumulativeFeedKg: number;
  fcr: number; // Feed Conversion Ratio (illustrative)
  livabilityPct: number;
  blueprintId: string;
  blueprintName: string;
  lastUpdated: string;
}

export interface MortalityRecord {
  id: string;
  cycleId: string;
  houseId: string;
  date: string;
  dayNumber: number;
  count: number;
  cause: string;
  evidenceNotes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface FeedIssueRecord {
  id: string;
  cycleId: string;
  houseId: string;
  date: string;
  dayNumber: number;
  feedItemName: string;
  lotNumber: string;
  quantityKg: number;
  warehouseId: string;
  warehouseName: string;
  recordedBy: string;
  createdAt: string;
}

export interface WeightSampleRecord {
  id: string;
  cycleId: string;
  houseId: string;
  date: string;
  dayNumber: number;
  sampleSize: number;
  averageWeightGrams: number;
  targetWeightGrams: number;
  uniformityPct: number;
  recordedBy: string;
  createdAt: string;
}

export interface VaccinationRecord {
  id: string;
  cycleId: string;
  date: string;
  dayNumber: number;
  vaccineName: string;
  targetDisease: string;
  lotNumber: string;
  administrationMethod: "WATER" | "SPRAY" | "INJECTION" | "EYE_DROP";
  status: "SCHEDULED" | "COMPLETED" | "OVERDUE";
  administeredBy?: string;
}

export interface HarvestRecord {
  id: string;
  cycleId: string;
  date: string;
  dayNumber: number;
  birdCount: number;
  totalWeightKg: number;
  averageWeightKg: number;
  targetCustomer: string;
  outputLotNumber: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
}

export interface DailyProductionLog {
  id: string;
  cycleId: string;
  date: string;
  dayNumber: number;
  mortalityCount: number;
  feedConsumedKg: number;
  waterLiters: number;
  avgWeightGrams?: number;
  temperatureCelsius?: number;
  humidityPct?: number;
  notes?: string;
  recordedBy: string;
}

