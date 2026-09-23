/**
 * Inventory, Stock Positions, and Lots.
 * Provisional frontend view models for M01.
 */

export type ItemCategory =
  | "FEED"
  | "MEDICINE"
  | "VACCINE"
  | "DISINFECTANT"
  | "PACKAGING"
  | "EQUIPMENT";

export type StockStatus = "NORMAL" | "LOW" | "CRITICAL";

export type LotStatus =
  | "AVAILABLE"
  | "LOW"
  | "EXPIRING_SOON"
  | "QUALITY_HOLD"
  | "DEPLETED";

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: ItemCategory;
  baseUom: string;
  minimumStock: number;
  reorderQuantity: number;
  currentStock: number;
  status: StockStatus;
  description: string;
}

export interface StockPosition {
  itemId: string;
  itemCode: string;
  itemName: string;
  category: ItemCategory;
  baseUom: string;
  onHand: number;
  reserved: number;
  available: number;
  qualityHold: number;
  expiringSoon: number;
  expectedIncoming: number;
  daysOfSupplyRemaining: number;
  status: StockStatus;
}

export interface InventoryLot {
  id: string;
  lotNumber: string;
  itemId: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  uom: string;
  manufactureDate: string;
  expiryDate: string;
  status: LotStatus;
  supplierName: string;
  unitCost: number;
  currency: string;
}

