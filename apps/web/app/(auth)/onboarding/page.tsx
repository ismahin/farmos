"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronRight,
  Egg,
  Fish,
  Layers,
  Plus,
  Sparkles,
  Sprout,
  Trash2,
  Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface HouseItem {
  name: string;
  capacity: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(1);
  const [isActivating, setIsActivating] = React.useState(false);
  const [activated, setActivated] = React.useState(false);

  // Step 1: Organization
  const [orgName, setOrgName] = React.useState("Example Agro Ltd.");
  const [country, setCountry] = React.useState("Kenya");
  const [currency, setCurrency] = React.useState("USD");
  const [timezone, setTimezone] = React.useState("Africa/Nairobi (UTC+3)");

  // Step 2: Farm
  const [farmName, setFarmName] = React.useState("North Integrated Farm");
  const [farmCode, setFarmCode] = React.useState("NIF-01");
  const [farmLocation, setFarmLocation] = React.useState("Rift Valley, Section 4");

  // Step 3: Enterprise
  const [selectedEnterprise, setSelectedEnterprise] = React.useState<string>("POULTRY");
  const [poultryType, setPoultryType] = React.useState<string>("BROILER");

  // Step 4: Physical Houses (Tree/list mode)
  const [houses, setHouses] = React.useState<HouseItem[]>([
    { name: "House 01", capacity: 10000 },
    { name: "House 02", capacity: 10000 },
    { name: "House 03", capacity: 10000 },
  ]);
  const [newHouseName, setNewHouseName] = React.useState("");
  const [newHouseCap, setNewHouseCap] = React.useState("10000");

  // Step 5: Warehouse & Blueprint
  const [warehouseName, setWarehouseName] = React.useState("Main Feed Store");
  const [warehouseCapacityKg, setWarehouseCapacityKg] = React.useState("50000");
  const [blueprint, setBlueprint] = React.useState("BROILER_42_STD");

  const addHouse = () => {
    if (!newHouseName.trim()) return;
    setHouses((prev) => [
      ...prev,
      { name: newHouseName, capacity: parseInt(newHouseCap) || 5000 },
    ]);
    setNewHouseName("");
  };

  const removeHouse = (index: number) => {
    setHouses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleActivate = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setActivated(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl py-6 space-y-6">
      {/* Progress Steps Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Step {step} of 6
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            {step === 1 && "1. Organization Setup"}
            {step === 2 && "2. Create Initial Farm"}
            {step === 3 && "3. Choose Enterprise & Capability"}
            {step === 4 && "4. Define Houses & Facilities"}
            {step === 5 && "5. Storage & Production Blueprint"}
            {step === 6 && "6. Topology Review & Activation"}
          </h2>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step
                  ? "w-7 bg-emerald-600"
                  : i < step
                  ? "w-2.5 bg-emerald-300"
                  : "w-2.5 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {activated ? (
        <Card className="border-emerald-200 bg-emerald-50/50 p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Farm Activated!</h3>
          <p className="mt-2 text-xs text-slate-600 max-w-md mx-auto">
            {farmName} has been provisioned under {orgName} with 3 Broiler houses
            (30,000 capacity) and Main Feed Store.
          </p>
          <p className="mt-4 text-xs font-semibold text-emerald-700 animate-pulse">
            Redirecting to your FarmOS Operations Dashboard...
          </p>
        </Card>
      ) : (
        <Card className="shadow-md border-slate-200">
          <CardContent className="p-6 space-y-6">
            {/* STEP 1: ORGANIZATION */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Enter your legal company or multi-farm farming organization.
                </p>
                <Input
                  label="Organization Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Example Agro Ltd."
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Select
                    label="Country / Region"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option>Kenya</option>
                    <option>Uganda</option>
                    <option>Tanzania</option>
                    <option>Nigeria</option>
                    <option>South Africa</option>
                    <option>United States</option>
                  </Select>
                  <Select
                    label="Default Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option>USD ($)</option>
                    <option>KES (KSh)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </Select>
                  <Select
                    label="Timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option>Africa/Nairobi (UTC+3)</option>
                    <option>Africa/Lagos (UTC+1)</option>
                    <option>UTC (UTC+0)</option>
                    <option>America/New_York (UTC-5)</option>
                  </Select>
                </div>
              </div>
            )}

            {/* STEP 2: FARM */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  A Farm is an operational site. You can add additional farms later.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Farm Name"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. North Integrated Farm"
                    required
                  />
                  <Input
                    label="Farm Code / Reference"
                    value={farmCode}
                    onChange={(e) => setFarmCode(e.target.value)}
                    placeholder="e.g. NIF-01"
                    helperText="Used for internal lot codes and batch references."
                    required
                  />
                </div>
                <Input
                  label="Physical Location Description"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="e.g. Rift Valley, Section 4"
                />
              </div>
            )}

            {/* STEP 3: ENTERPRISE */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    Select Farm Enterprise
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Poultry - Active */}
                    <div
                      onClick={() => setSelectedEnterprise("POULTRY")}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        selectedEnterprise === "POULTRY"
                          ? "border-emerald-600 bg-emerald-50/40 shadow-xs"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <Egg className="h-6 w-6" />
                        </div>
                        <Badge variant="success">Primary MVP</Badge>
                      </div>
                      <h4 className="mt-3 font-semibold text-slate-900 text-sm">
                        Poultry Operations
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        Flocks, daily fast log, mortality, feed, weights, harvest, and cycle economics.
                      </p>
                    </div>

                    {/* Cattle / Livestock - Future */}
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 opacity-70">
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                          <Layers className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">Post-MVP</Badge>
                      </div>
                      <h4 className="mt-3 font-semibold text-slate-800 text-sm">
                        Cattle & Livestock
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        Dairy, beef fattening, individual tagging, milk yields (Deferred).
                      </p>
                    </div>

                    {/* Fisheries - Future */}
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 opacity-70">
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                          <Fish className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">Post-MVP</Badge>
                      </div>
                      <h4 className="mt-3 font-semibold text-slate-800 text-sm">
                        Fisheries & Aquaculture
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        Pond batches, water quality, feeding cycles (Deferred).
                      </p>
                    </div>

                    {/* Crops - Future */}
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 opacity-70">
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                          <Wheat className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">Post-MVP</Badge>
                      </div>
                      <h4 className="mt-3 font-semibold text-slate-800 text-sm">
                        Crops & Agronomy
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        Fields, plots, inputs, agronomic tasks, harvesting (Deferred).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub-type: Broiler vs Layer */}
                {selectedEnterprise === "POULTRY" && (
                  <div className="pt-3 border-t border-slate-100">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                      Poultry Production Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPoultryType("BROILER")}
                        className={`rounded-xl border-2 p-3 text-left transition-all ${
                          poultryType === "BROILER"
                            ? "border-emerald-600 bg-emerald-50/40"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">
                            Broiler (Meat)
                          </span>
                          <Badge variant="primary">Standard 42-day</Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Group cycle management, placement to slaughter harvest.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPoultryType("LAYER")}
                        className={`rounded-xl border-2 p-3 text-left transition-all ${
                          poultryType === "LAYER"
                            ? "border-emerald-600 bg-emerald-50/40"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">
                            Layer (Egg)
                          </span>
                          <Badge variant="secondary">Illustrative</Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Rearing & laying phases with daily egg production journals.
                        </p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: PHYSICAL HOUSES (Tree/list mode) */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Add Poultry Houses (Tree / List Composer)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Configure physical production units on {farmName}.
                  </p>
                </div>

                {/* Existing Houses List */}
                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                  {houses.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-3">
                      No houses added yet. Add at least one house below.
                    </p>
                  ) : (
                    houses.map((house, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-white p-3 border border-slate-200 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-emerald-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {house.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Capacity: {house.capacity.toLocaleString()} birds • Broiler
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHouse(index)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add House Row */}
                <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
                  <span className="text-xs font-semibold text-slate-800">
                    + Add Another House
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      placeholder="e.g. House 04"
                      value={newHouseName}
                      onChange={(e) => setNewHouseName(e.target.value)}
                    />
                    <Input
                      placeholder="Capacity (e.g. 10000)"
                      type="number"
                      value={newHouseCap}
                      onChange={(e) => setNewHouseCap(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addHouse}
                      disabled={!newHouseName.trim()}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Unit
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between px-1">
                  <span>Total House Units: {houses.length}</span>
                  <span className="font-semibold text-slate-800">
                    Total Capacity:{" "}
                    {houses.reduce((acc, h) => acc + h.capacity, 0).toLocaleString()} birds
                  </span>
                </div>
              </div>
            )}

            {/* STEP 5: WAREHOUSE & BLUEPRINT */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Farm Storage & Operating Blueprint
                  </h4>
                  <p className="text-xs text-slate-500">
                    Set up primary feed storage and production templates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Primary Warehouse / Store"
                    value={warehouseName}
                    onChange={(e) => setWarehouseName(e.target.value)}
                    placeholder="e.g. Main Feed Store"
                    leftIcon={<Boxes className="h-4 w-4" />}
                    required
                  />
                  <Input
                    label="Storage Capacity (kg)"
                    type="number"
                    value={warehouseCapacityKg}
                    onChange={(e) => setWarehouseCapacityKg(e.target.value)}
                    placeholder="50000"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Select
                    label="Default Production Blueprint"
                    value={blueprint}
                    onChange={(e) => setBlueprint(e.target.value)}
                    helperText="Applies standard growth curve, target weights, and vaccination schedules to new flocks."
                  >
                    <option value="BROILER_42_STD">
                      Cobb 500 / Ross 308 — Standard 42-Day Commercial Broiler
                    </option>
                    <option value="BROILER_35_FAST">
                      Fast-Growth 35-Day Broiler (Target 1.9 kg)
                    </option>
                    <option value="BROILER_49_ROASTER">
                      Heavy Roaster 49-Day Broiler (Target 3.0 kg)
                    </option>
                  </Select>
                </div>
              </div>
            )}

            {/* STEP 6: TOPOLOGY REVIEW & ACTIVATION */}
            {step === 6 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Review Farm Topology
                  </h4>
                  <p className="text-xs text-slate-500">
                    Verify physical hierarchy before activating this operational farm.
                  </p>
                </div>

                {/* Topology Tree Representation (Explicit requirement from 13.7) */}
                <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
                  <div className="text-emerald-400 font-bold">{orgName}</div>
                  <div className="text-slate-300">└── {farmName} ({farmCode})</div>
                  <div className="text-slate-300">    ├── 🐓 Poultry Enterprise ({poultryType})</div>
                  {houses.map((h, i) => (
                    <div key={i} className="text-slate-400">
                      {i === houses.length - 1
                        ? "    │   └── "
                        : "    │   ├── "}
                      {h.name} (Capacity: {h.capacity.toLocaleString()} birds)
                    </div>
                  ))}
                  <div className="text-slate-300">
                        └── 📦 Warehouse: {warehouseName} ({parseInt(warehouseCapacityKg).toLocaleString()} kg)
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Legal Organization:</span>
                    <span className="font-semibold text-slate-900">{orgName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location & Timezone:</span>
                    <span className="font-semibold text-slate-900">{farmLocation} ({timezone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Poultry Capacity:</span>
                    <span className="font-semibold text-slate-900">
                      {houses.reduce((acc, h) => acc + h.capacity, 0).toLocaleString()} birds
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Operational Blueprint:</span>
                    <span className="font-semibold text-slate-900">Commercial Broiler 42-Day Standard</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  disabled={isActivating}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setStep((s) => (s + 1) as Step)}
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="md"
                  onClick={handleActivate}
                  isLoading={isActivating}
                  className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                >
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Activate Farm & Enter FarmOS
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

