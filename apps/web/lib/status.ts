export type StatusTone =
  | "emerald"
  | "amber"
  | "rose"
  | "blue"
  | "purple"
  | "slate"
  | "indigo";

export interface StatusConfig {
  label: string;
  tone: StatusTone;
  badgeClass: string;
  dotClass: string;
}

export const statusMap: Record<string, StatusConfig> = {
  // Production Cycle statuses
  ACTIVE: {
    label: "Active",
    tone: "emerald",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  PLANNED: {
    label: "Planned",
    tone: "blue",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  READY: {
    label: "Ready",
    tone: "indigo",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotClass: "bg-indigo-500",
  },
  HARVESTING: {
    label: "Harvesting",
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  CLOSING: {
    label: "Closing",
    tone: "slate",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-500",
  },
  CLOSED: {
    label: "Closed",
    tone: "slate",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
  },
  DRAFT: {
    label: "Draft",
    tone: "slate",
    badgeClass: "bg-slate-50 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
  },
  CANCELLED: {
    label: "Cancelled",
    tone: "rose",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },

  // Operational Severity
  CRITICAL: {
    label: "Critical",
    tone: "rose",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 font-semibold",
    dotClass: "bg-rose-600 animate-pulse",
  },
  WARNING: {
    label: "Warning",
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  INFO: {
    label: "Info",
    tone: "blue",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  NORMAL: {
    label: "Normal",
    tone: "emerald",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },

  // Approval / Workflow
  PENDING: {
    label: "Pending",
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  PENDING_APPROVAL: {
    label: "Pending Approval",
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200 font-medium",
    dotClass: "bg-amber-500",
  },
  APPROVED: {
    label: "Approved",
    tone: "emerald",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    tone: "rose",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },
  ORDERED: {
    label: "Ordered",
    tone: "blue",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  PARTIALLY_RECEIVED: {
    label: "Partially Received",
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  RECEIVED: {
    label: "Received",
    tone: "emerald",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  COMPLETED: {
    label: "Completed",
    tone: "emerald",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    tone: "blue",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  OVERDUE: {
    label: "Overdue",
    tone: "rose",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 font-semibold",
    dotClass: "bg-rose-500",
  },

  // Stock / Lot statuses
  AVAILABLE: {
    label: "Available",
    tone: "emerald",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  LOW: {
    label: "Low Stock",
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  EXPIRING_SOON: {
    label: "Expiring Soon",
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200 font-semibold",
    dotClass: "bg-amber-600 animate-pulse",
  },
  QUALITY_HOLD: {
    label: "Quality Hold",
    tone: "purple",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    dotClass: "bg-purple-500",
  },
  CLEANOUT: {
    label: "Cleanout",
    tone: "slate",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
};

export function getStatusConfig(status: string): StatusConfig {
  return (
    statusMap[status.toUpperCase()] || {
      label: status,
      tone: "slate",
      badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
      dotClass: "bg-slate-400",
    }
  );
}

