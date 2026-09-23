/**
 * AI Assistant, Hermes conversation, and HITL action proposal types.
 * Provisional frontend view models for M01.
 */

export interface AiSourceCitation {
  title: string;
  sourceType: "FLOCK" | "INVENTORY" | "PURCHASE_ORDER" | "TASK" | "SENSOR";
  entityId: string;
  url: string;
}

export interface AiActionProposal {
  id: string;
  title: string;
  actionType: "CREATE_PURCHASE_REQUISITION" | "SCHEDULE_TASK" | "RECORD_FAST_LOG";
  summary: string;
  suggestedPayload: {
    item: string;
    quantity: number;
    uom: string;
    requiredByDate: string;
    estimatedCost?: number;
    urgency: string;
    reason: string;
  };
  policyNotice: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  status: "PROPOSED" | "APPROVED" | "REJECTED" | "EXECUTED";
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  sources?: AiSourceCitation[];
  actionProposal?: AiActionProposal;
}

