import { Farm, Organization, ProductionUnit, Warehouse } from "../types";

export const mockOrganization: Organization = {
  id: "org-001",
  name: "Example Agro Ltd.",
  country: "Kenya",
  currency: "USD",
  timezone: "Africa/Nairobi",
  status: "ACTIVE",
};

export const mockHouses: ProductionUnit[] = [
  {
    id: "house-01",
    farmId: "farm-001",
    name: "House 01",
    code: "H-01",
    enterpriseType: "POULTRY_BROILER",
    capacity: 10000,
    status: "ACTIVE",
    currentFlockId: "flock-2609-01",
    currentFlockCode: "BR-2609-01",
    currentBirds: 9640,
    daysActive: 35,
  },
  {
    id: "house-02",
    farmId: "farm-001",
    name: "House 02",
    code: "H-02",
    enterpriseType: "POULTRY_BROILER",
    capacity: 10000,
    status: "CLEANOUT",
    currentBirds: 0,
    daysActive: 0,
  },
  {
    id: "house-03",
    farmId: "farm-001",
    name: "House 03",
    code: "H-03",
    enterpriseType: "POULTRY_BROILER",
    capacity: 10000,
    status: "ACTIVE",
    currentFlockId: "flock-2609-03",
    currentFlockCode: "BR-2609-03",
    currentBirds: 9820,
    daysActive: 28,
  },
];

export const mockWarehouses: Warehouse[] = [
  {
    id: "wh-001",
    farmId: "farm-001",
    name: "Main Feed Store",
    code: "W-FEED-01",
    type: "FEED",
    capacityKg: 50000,
    currentOccupancyPct: 68,
    status: "ACTIVE",
  },
  {
    id: "wh-002",
    farmId: "farm-001",
    name: "Vet & Biosecurity Depot",
    code: "W-MED-01",
    type: "MEDICINE",
    capacityKg: 5000,
    currentOccupancyPct: 42,
    status: "ACTIVE",
  },
];

export const mockFarms: Farm[] = [
  {
    id: "farm-001",
    organizationId: "org-001",
    name: "North Integrated Farm",
    code: "NIF-01",
    location: "Rift Valley, Section 4",
    timezone: "Africa/Nairobi",
    status: "ACTIVE",
    enabledEnterprises: ["POULTRY_BROILER"],
    houses: mockHouses,
    warehouses: mockWarehouses,
    totalCapacity: 30000,
    activeCycleCount: 2,
    warningCount: 2,
    criticalCount: 1,
  },
  {
    id: "farm-002",
    organizationId: "org-001",
    name: "South Valley Farm",
    code: "SVF-02",
    location: "Southern Ridge Block B",
    timezone: "Africa/Nairobi",
    status: "PLANNED",
    enabledEnterprises: ["POULTRY_BROILER", "CROPS_GRAIN"],
    houses: [],
    warehouses: [],
    totalCapacity: 20000,
    activeCycleCount: 0,
    warningCount: 0,
    criticalCount: 0,
  },
];

