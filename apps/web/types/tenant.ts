/**
 * Tenant and Farm organizational structures for FarmOS.
 * Note: These are provisional frontend view models for the M01 prototype.
 * Authoritative backend schemas will be defined by Codex in M02.
 */

export type EnterpriseType =
  | "POULTRY_BROILER"
  | "POULTRY_LAYER"
  | "LIVESTOCK_CATTLE"
  | "FISHERIES_TILAPIA"
  | "CROPS_GRAIN";

export type FacilityStatus = "ACTIVE" | "IDLE" | "MAINTENANCE" | "CLEANOUT";

export type UserPersona = "OWNER" | "FARM_MANAGER" | "STOREKEEPER" | "FIELD_WORKER" | "VET";

export interface Organization {
  id: string;
  name: string;
  country: string;
  currency: string;
  timezone: string;
  status: "ACTIVE" | "TRIAL" | "SUSPENDED";
}

export interface ProductionUnit {
  id: string;
  farmId: string;
  name: string;
  code: string;
  enterpriseType: EnterpriseType;
  capacity: number;
  status: FacilityStatus;
  currentFlockId?: string;
  currentFlockCode?: string;
  currentBirds?: number;
  daysActive?: number;
}

export interface Warehouse {
  id: string;
  farmId: string;
  name: string;
  code: string;
  type: "FEED" | "MEDICINE" | "GENERAL" | "HARVEST";
  capacityKg: number;
  currentOccupancyPct: number;
  status: "ACTIVE" | "MAINTENANCE";
}

export interface Farm {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  location: string;
  timezone: string;
  status: "ACTIVE" | "PLANNED" | "SETUP";
  enabledEnterprises: EnterpriseType[];
  houses: ProductionUnit[];
  warehouses: Warehouse[];
  totalCapacity: number;
  activeCycleCount: number;
  warningCount: number;
  criticalCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserPersona;
  roleTitle: string;
  avatarUrl?: string;
  accessibleFarms: string[];
}

