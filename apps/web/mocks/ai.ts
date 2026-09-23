import { AiChatMessage } from "../types";

export const mockAiSuggestions: string[] = [
  "What needs my attention?",
  "How is House 03 performing?",
  "Do we have enough feed for the next 14 days?",
  "Which approvals are pending?",
  "What is the expected harvest this week?",
];

export const mockAiConversation: AiChatMessage[] = [
  {
    id: "msg-001",
    role: "assistant",
    content:
      "Good morning. I am your FarmOS Operational Assistant.\n\nI can help explain farm performance, review operational risks, prepare action drafts, and locate records across North Integrated Farm.\n\nWhat needs your attention today?",
    timestamp: "08:00 AM",
  },
  {
    id: "msg-002",
    role: "user",
    content: "Do we have enough feed for the next 14 days?",
    timestamp: "08:02 AM",
  },
  {
    id: "msg-003",
    role: "assistant",
    content:
      "**Feed Supply Analysis for North Integrated Farm**\n\n- **Broiler Grower Pellets**: ⚠️ **CRITICAL RISK**. Current on-hand stock is **2,800 kg**, with **1,200 kg** reserved for today's ration in House 03. At current burn rate, available stock will deplete in **2.3 days** (by Sept 24).\n- **Broiler Finisher Pellets**: ✅ **SUFFICIENT**. Current stock is **14,200 kg**, covering **22 days** of projected demand.\n- **Broiler Starter Crumbs**: ✅ **SUFFICIENT**. Current stock is **4,500 kg** (18 days buffer).\n\nTo prevent a stockout in House 03 before harvest transition, a replenishment of at least 5,000 kg of Grower Feed is recommended immediately.",
    timestamp: "08:02 AM",
    sources: [
      {
        title: "Inventory Position: Grower Pellets",
        sourceType: "INVENTORY",
        entityId: "item-002",
        url: "/stock",
      },
      {
        title: "Flock BR-2609-03 Consumption Journal",
        sourceType: "FLOCK",
        entityId: "flock-2609-03",
        url: "/production/flock-2609-03",
      },
    ],
    actionProposal: {
      id: "act-prop-001",
      title: "Create Purchase Requisition Draft",
      actionType: "CREATE_PURCHASE_REQUISITION",
      summary: "Draft requisition for 5,000 kg Broiler Grower Pellets with 48h emergency delivery.",
      suggestedPayload: {
        item: "Broiler Grower Pellets (20% CP)",
        quantity: 5000,
        uom: "kg",
        requiredByDate: "2026-09-24",
        estimatedCost: 2250,
        urgency: "CRITICAL",
        reason: "Projected stockout in House 03 within 2.3 days based on current flock consumption.",
      },
      policyNotice:
        "Human-in-the-Loop Policy: AI cannot commit organizational funds or issue binding purchase orders. An authorized farm manager must review and submit this requisition.",
      riskLevel: "HIGH",
      status: "PROPOSED",
    },
  },
];

