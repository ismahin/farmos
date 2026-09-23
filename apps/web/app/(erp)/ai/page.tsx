"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  Clock,
  Egg,
  ExternalLink,
  FileCheck,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { mockAiConversation, mockAiSuggestions } from "@/mocks/ai";
import { AiChatMessage } from "@/types";

export default function AiAssistantPage() {
  const [messages, setMessages] = React.useState<AiChatMessage[]>(mockAiConversation);
  const [inputValue, setInputValue] = React.useState("");
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false);
  const [actionDismissed, setActionDismissed] = React.useState(false);
  const [actionApproved, setActionApproved] = React.useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulated assistant response with context
    setTimeout(() => {
      const replyMsg: AiChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content:
          text.toLowerCase().includes("house 03") || text.toLowerCase().includes("performing")
            ? "**House 03 Performance Summary (Flock BR-2609-03)**\n\n- **Age**: Day 28 of 42 (Cobb 500)\n- **Live Count**: **9,820 birds** (Livability 98.2%)\n- **Average Weight**: **1,450 g** (+30g ahead of Cobb standard curve)\n- **Estimated FCR**: **1.42** (target ≤ 1.50)\n- **Recent Incident**: Afternoon heat spike on Day 27 (18 mortalities recorded). Fan bank 2 operational."
            : text.toLowerCase().includes("approvals")
            ? "**Pending Human-in-the-Loop Approvals**\n\n1. **PR-1042**: 5,000 kg Broiler Grower Feed ($2,250) — Requested by Alice Mwangi. Main feed store buffer is 2.3 days.\n2. **ADJ-041**: Write-off 100 kg damaged Starter Feed ($52) due to bay 4 rainwater leak.\n\nBoth require authorized Farm Manager approval before supplier orders can be placed."
            : "**Farm Status & Operational Focus**\n\nAcross North Integrated Farm, operations are normal with two key priorities today:\n1. **Feed Replenishment**: Grower feed buffer requires ordering before cutoff at 14:00.\n2. **Weight Sampling**: Day 28 sample for House 03 due at 11:00 by Dr. Paul.",
        timestamp: "Just now",
        sources: [
          {
            title: "House 03 Daily Log Journal",
            sourceType: "FLOCK",
            entityId: "flock-2609-03",
            url: "/production/flock-2609-03",
          },
        ],
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 450);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hermes AI Operational Assistant
            </h1>
            <Badge variant="purple">Supervised Assistant UX Prototype</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Conversational inquiry over verified FarmOS tools with human-in-the-loop governance
          </p>
        </div>
      </div>

      {/* Safety & HITL Architecture Notice */}
      <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-purple-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-slate-700">
            <span className="font-bold text-purple-950 block">
              Architectural Guardrail: AI Never Writes Directly to the Database
            </span>
            <p className="leading-relaxed">
              Hermes discovers and requests business actions through controlled FarmOS tools.
              Material financial or physical commitments produce <strong>Action Drafts</strong>{" "}
              requiring explicit authorized human approval.
            </p>
          </div>
        </div>
      </div>

      {/* Main Conversation Container */}
      <Card className="flex flex-col h-[600px] shadow-sm border-slate-200 overflow-hidden">
        {/* Chat Message Stream */}
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shrink-0 shadow-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl space-y-3 rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80"
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.content}</div>

                {/* Verified Source Citations (Section 24) */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Verified ERP Data Sources
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <Link
                          key={i}
                          href={src.url}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Action Preview Concept (Section 25 - HITL) */}
                {msg.actionProposal && !actionDismissed && (
                  <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3.5 space-y-2 text-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                        Suggested Action: {msg.actionProposal.title}
                      </span>
                      <Badge variant="warning">High Risk • Requires Approval</Badge>
                    </div>

                    <div className="rounded-lg bg-white p-2.5 border border-amber-200 text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Item:</span>
                        <span className="font-bold text-slate-900">
                          {msg.actionProposal.suggestedPayload.item}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Quantity:</span>
                        <span className="font-bold text-slate-900">
                          {msg.actionProposal.suggestedPayload.quantity.toLocaleString()} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Required By:</span>
                        <span className="font-bold text-slate-900">
                          {msg.actionProposal.suggestedPayload.requiredByDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reason:</span>
                        <span className="text-slate-700">
                          {msg.actionProposal.suggestedPayload.reason}
                        </span>
                      </div>
                    </div>

                    {actionApproved ? (
                      <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Draft Requisition Submitted to Purchasing Queue!
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActionDismissed(true)}
                          className="h-7 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Dismiss
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setReviewModalOpen(true)}
                          className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                        >
                          Review Draft Action
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-white shrink-0 shadow-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </CardContent>

        {/* Suggested Prompts & Chat Input Form */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-3">
          {/* Suggested Questions Pills (Section 24) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">
              Ask Hermes:
            </span>
            {mockAiSuggestions.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-900 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about North Integrated Farm or request action drafts..."
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputValue.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Action Review Modal (Section 25) */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review Proposed Action: Purchase Requisition Draft"
        description="Inspect parameters prepared by Hermes before authorizing."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3 space-y-1">
            <span className="font-bold text-purple-900 block">
              Policy Gate: Human-in-the-Loop Confirmation
            </span>
            <p className="text-slate-600 leading-relaxed">
              Procurement orders exceeding $500 require manual manager authorization.
              Hermes has gathered inventory deficit data and drafted this requisition for you.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Item:</span>
              <span className="font-bold text-slate-900">Broiler Grower Pellets (20% CP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Requested Quantity:</span>
              <span className="font-bold text-slate-900">5,000 kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Required:</span>
              <span className="font-bold text-slate-900">Sept 24, 2026 (48 hours)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Cost:</span>
              <span className="font-bold text-slate-900">$2,250.00 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reason:</span>
              <span className="text-slate-700">Projected stock shortage in House 03</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setReviewModalOpen(false);
                setActionApproved(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
            >
              Approve & Submit Requisition
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

