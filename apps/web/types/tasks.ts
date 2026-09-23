/**
 * Operational tasks, alerts, and pending approvals.
 * Provisional frontend view models for M01.
 */

export type TaskCategory = "PRODUCTION" | "STOCK" | "HEALTH" | "MAINTENANCE" | "COMPLIANCE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";

export interface FarmTask {
  id: string;
  farmId: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  dueTime?: string;
  assignedTo: string;
  status: TaskStatus;
  relatedLocation: string;
  relatedEntity?: {
    type: "HOUSE" | "FLOCK" | "WAREHOUSE" | "PO";
    id: string;
    label: string;
  };
}

export type AlertSeverity = "CRITICAL" | "WARNING" | "INFO";
export type AlertCategory = "MORTALITY" | "FEED" | "HEALTH" | "ENVIRONMENT" | "FINANCE";

export interface AlertItem {
  id: string;
  farmId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string;
  acknowledged: boolean;
  sourceLink: string;
  sourceLabel: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  requestedBy: string;
  requestDate: string;
  type: "PURCHASE_REQUISITION" | "STOCK_ADJUSTMENT" | "MORTALITY_DISPOSAL" | "HARVEST_RELEASE";
  amount?: number;
  currency?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  justification: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  details: Record<string, any>;
}

