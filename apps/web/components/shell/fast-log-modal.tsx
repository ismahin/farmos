"use client";

import * as React from "react";
import { CheckCircle2, Feather, PackageOpen, Scale } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useShell } from "./context";
import { mockHouses } from "@/mocks/farms";
import { mockInventoryLots } from "@/mocks/inventory";

interface FastLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: "mortality" | "feed" | "weight";
}

export function FastLogModal({
  isOpen,
  onClose,
  defaultAction = "mortality",
}: FastLogModalProps) {
  const { currentFarm, currentUser } = useShell();
  const [activeTab, setActiveTab] = React.useState<"mortality" | "feed" | "weight">(
    defaultAction
  );

  // House context (default to House 03 with active flock)
  const [selectedHouseId, setSelectedHouseId] = React.useState("house-03");
  const selectedHouse =
    mockHouses.find((h) => h.id === selectedHouseId) || mockHouses[2];

  // Mortality state
  const [mortalityQty, setMortalityQty] = React.useState("12");
  const [mortalityCause, setMortalityCause] = React.useState("Natural / Routine Cull");
  const [mortalityNotes, setMortalityNotes] = React.useState("");

  // Feed issue state
  const [selectedLotId, setSelectedLotId] = React.useState("lot-001");
  const [feedQuantity, setFeedQuantity] = React.useState("1200");

  // Weight sample state
  const [sampleCount, setSampleCount] = React.useState("100");
  const [avgWeightGrams, setAvgWeightGrams] = React.useState("1450");
  const [uniformityPct, setUniformityPct] = React.useState("88");

  // Feedback state
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setActiveTab(defaultAction);
  }, [defaultAction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1400);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Field Fast-Log: Quick Record"
      description="Low-input field recording. Context values are automatically resolved."
      maxWidth="md"
    >
      {submitted ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Event Recorded!</h4>
          <p className="mt-1 text-xs text-slate-500 max-w-xs">
            Operational record created for {selectedHouse.name} (Flock{" "}
            {selectedHouse.currentFlockCode}).
          </p>
          <span className="mt-3 text-[10px] text-slate-400">
            Recorded by {currentUser.name} • Auto-timestamped
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resolved Context Banner (No redundant re-entry) */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Active Production Context
              </span>
              <span className="font-semibold text-slate-900">
                {currentFarm.name}
              </span>{" "}
              •{" "}
              <span className="text-emerald-700 font-bold">
                {selectedHouse.name} ({selectedHouse.currentFlockCode})
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              Worker: {currentUser.name}
            </span>
          </div>

          {/* Action Tabs */}
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("mortality")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === "mortality"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Feather className="h-3.5 w-3.5" />
              Mortality
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("feed")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === "feed"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <PackageOpen className="h-3.5 w-3.5" />
              Issue Feed
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("weight")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === "weight"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              Weights
            </button>
          </div>

          {/* Tab 1: Mortality */}
          {activeTab === "mortality" && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Bird Count"
                  type="number"
                  min={1}
                  max={selectedHouse.currentBirds || 10000}
                  value={mortalityQty}
                  onChange={(e) => setMortalityQty(e.target.value)}
                  required
                />
                <Select
                  label="Observed Cause"
                  value={mortalityCause}
                  onChange={(e) => setMortalityCause(e.target.value)}
                >
                  <option>Natural / Routine Cull</option>
                  <option>Ascites / Sudden Death</option>
                  <option>Heat Spike / Ventilation</option>
                  <option>Leg Abnormality / Lameness</option>
                  <option>Underweight / Stunt</option>
                </Select>
              </div>
              <Input
                label="Notes / Evidence (Optional)"
                placeholder="e.g. Cleared from bay 3; litter dampness checked"
                value={mortalityNotes}
                onChange={(e) => setMortalityNotes(e.target.value)}
              />
            </div>
          )}

          {/* Tab 2: Issue Feed */}
          {activeTab === "feed" && (
            <div className="space-y-3 pt-1">
              <Select
                label="Select Feed Lot (Main Feed Store)"
                value={selectedLotId}
                onChange={(e) => setSelectedLotId(e.target.value)}
              >
                {mockInventoryLots
                  .filter((l) => l.itemName.includes("Feed"))
                  .map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.itemName} ({lot.lotNumber}) — {lot.quantity} kg available
                    </option>
                  ))}
              </Select>
              <Input
                label="Quantity to Issue (kg)"
                type="number"
                min={50}
                step={25}
                value={feedQuantity}
                onChange={(e) => setFeedQuantity(e.target.value)}
                required
                helperText="1 physical issue will update stock, cycle FCR, and cost ledger simultaneously."
              />
            </div>
          )}

          {/* Tab 3: Weight Sampling */}
          {activeTab === "weight" && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Sample Size"
                  type="number"
                  value={sampleCount}
                  onChange={(e) => setSampleCount(e.target.value)}
                  required
                />
                <Input
                  label="Avg Weight (g)"
                  type="number"
                  value={avgWeightGrams}
                  onChange={(e) => setAvgWeightGrams(e.target.value)}
                  required
                />
                <Input
                  label="Uniformity %"
                  type="number"
                  min={50}
                  max={100}
                  value={uniformityPct}
                  onChange={(e) => setUniformityPct(e.target.value)}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Target weight for Cobb 500 at Day 28:{" "}
                <span className="font-semibold text-slate-800">1,420 g</span>.
                Current sample reflects +30g ahead of curve.
              </p>
            </div>
          )}

          {/* Dialog Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Confirm Record
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

