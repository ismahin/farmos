/**
 * Sales, Customers, Invoices, and Shipments.
 * Provisional frontend view models for M01.
 */

export type SalesOrderStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "ALLOCATED"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export type InvoiceStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";

export interface Customer {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  type: "WHOLESALER" | "SUPERMARKET" | "RETAILER" | "INSTITUTIONAL";
  outstandingBalance: number;
  creditLimit: number;
  currency: string;
}

export interface SalesOrderLine {
  id: string;
  productDescription: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  lineTotal: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  status: SalesOrderStatus;
  totalAmount: number;
  currency: string;
  items: SalesOrderLine[];
  shippingAddress: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  salesOrderId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  currency: string;
}

