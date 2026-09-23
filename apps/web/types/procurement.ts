/**
 * Purchasing, Requisitions, and Purchase Orders.
 * Provisional frontend view models for M01.
 */

export type RequisitionStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "ORDERED";

export type PurchaseOrderStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "ORDERED"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

export interface RequisitionLineItem {
  id: string;
  itemId: string;
  itemName: string;
  requestedQty: number;
  uom: string;
  estimatedUnitPrice: number;
  lineTotal: number;
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  requestedBy: string;
  department: string;
  createdAt: string;
  requiredByDate: string;
  status: RequisitionStatus;
  urgency: "NORMAL" | "HIGH" | "CRITICAL";
  totalEstimatedAmount: number;
  currency: string;
  items: RequisitionLineItem[];
  justification: string;
}

export interface PurchaseOrderLineItem {
  id: string;
  itemId: string;
  itemName: string;
  orderedQty: number;
  receivedQty: number;
  uom: string;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  prId?: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  currency: string;
  lines: PurchaseOrderLineItem[];
  deliveryWarehouseName: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  leadTimeDays: number;
  activeOrdersCount: number;
  totalSpendYTD: number;
}

