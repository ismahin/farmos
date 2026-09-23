"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  PackageOpen,
  PackagePlus,
  Plus,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { mockInventoryItems, mockInventoryLots, mockStockPositions } from "@/mocks/inventory";
import { mockWarehouses } from "@/mocks/farms";
import { formatNumber } from "@/lib/formatters";

export default function StockPage() {
  const [activeTab, setActiveTab] = React.useState("positions");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [receiveModalOpen, setReceiveModalOpen] = React.useState(false);

  // Filtered positions
  const filteredPositions = mockStockPositions.filter(
    (p) =>
      p.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory & Lot-Traceable Stock
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-state inventory balances, lot-level traceability, and expiry tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setReceiveModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
          >
            <PackagePlus className="h-4 w-4 mr-1.5" />
            + Receive Goods
          </Button>
        </div>
      </div>

      {/* Critical Stock Risk Notice */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-950">
              Low Stock Alert: Broiler Grower Pellets (FEED-GRW-02)
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Available buffer is <strong>1,600 kg</strong> (2.3 days of supply remaining for
              House 03). Purchase Requisition <strong>PR-1042</strong> is currently pending
              manager approval.
            </p>
          </div>
        </div>
      </div>

      {/* Inventory Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="positions">Stock Positions (Multi-State)</TabsTrigger>
            <TabsTrigger value="lots">Lots & Batches (FEFO)</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses & Silos</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search items or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>
        </div>

        {/* TAB 1: STOCK POSITIONS (Distinct Multi-State Inventory!) */}
        <TabsContent value="positions" className="space-y-4 pt-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code & Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Physical On Hand</TableHead>
                  <TableHead className="text-right">Reserved</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead className="text-right">Quality Hold</TableHead>
                  <TableHead className="text-right">Expiring Soon</TableHead>
                  <TableHead className="text-right">Incoming PO</TableHead>
                  <TableHead className="text-right">Supply Buffer</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((pos) => (
                  <TableRow key={pos.itemId}>
                    <TableCell className="font-semibold text-slate-900">
                      <div>{pos.itemName}</div>
                      <span className="font-mono text-xs text-slate-400 font-normal">
                        {pos.itemCode}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{pos.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-800">
                      {formatNumber(pos.onHand)} {pos.baseUom}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {pos.reserved > 0 ? `${formatNumber(pos.reserved)} ${pos.baseUom}` : "—"}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      <span
                        className={
                          pos.available <= 2000 && pos.category === "FEED"
                            ? "text-rose-600"
                            : "text-slate-900"
                        }
                      >
                        {formatNumber(pos.available)} {pos.baseUom}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-400">
                      {pos.qualityHold > 0 ? `${pos.qualityHold} ${pos.baseUom}` : "0"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {pos.expiringSoon > 0 ? (
                        <span className="text-amber-700 font-bold">
                          {pos.expiringSoon} {pos.baseUom}
                        </span>
                      ) : (
                        "0"
                      )}
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                      {pos.expectedIncoming > 0 ? (
                        <span className="text-blue-700 font-medium">
                          +{formatNumber(pos.expectedIncoming)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      <span
                        className={`font-semibold ${
                          pos.daysOfSupplyRemaining < 5
                            ? "text-rose-600"
                            : "text-slate-700"
                        }`}
                      >
                        {pos.daysOfSupplyRemaining} days
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={pos.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 2: LOTS & BATCHES (FEFO Traceability) */}
        <TabsContent value="lots" className="space-y-4 pt-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Available Lot Qty</TableHead>
                  <TableHead>Mfg Date</TableHead>
                  <TableHead>Expiry Date (FEFO)</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInventoryLots.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-mono text-xs font-bold text-emerald-800">
                      {lot.lotNumber}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {lot.itemName}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {lot.warehouseName}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatNumber(lot.quantity)} {lot.uom}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {lot.manufactureDate}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span
                        className={
                          lot.status === "EXPIRING_SOON"
                            ? "text-rose-700 font-bold"
                            : "text-slate-700"
                        }
                      >
                        {lot.expiryDate}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {lot.supplierName}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lot.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 3: WAREHOUSES & SILOS */}
        <TabsContent value="warehouses" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockWarehouses.map((wh) => (
              <Card key={wh.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {wh.name}
                      </CardTitle>
                      <p className="font-mono text-xs text-slate-400">{wh.code}</p>
                    </div>
                    <Badge variant="secondary">{wh.type} Store</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Storage Capacity Utilized:</span>
                      <span className="font-bold text-slate-900">
                        {wh.currentOccupancyPct}% (
                        {((wh.capacityKg * wh.currentOccupancyPct) / 100).toLocaleString()}{" "}
                        kg / {wh.capacityKg.toLocaleString()} kg)
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${wh.currentOccupancyPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Status: <strong className="text-emerald-700">Online & Monitored</strong></span>
                    <span>Biosecurity Zone A</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Receive Goods Prototype Modal */}
      <Modal
        isOpen={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        title="Receive Goods to Warehouse"
        description="Record verified supplier delivery and create traceable lot."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setReceiveModalOpen(false);
          }}
          className="space-y-3"
        >
          <Select label="Purchase Order">
            <option>PO-2026-0893 — Apex Animal Health ($240)</option>
            <option>PO-2026-0894 — Unga Farm Care Ltd. (5,000 kg Grower)</option>
          </Select>
          <Input label="Supplier Delivery Note #" placeholder="e.g. DN-99482" required />
          <Input label="Assigned Lot Number" defaultValue="LOT-GROW-2026-09B" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Received Quantity (kg)" type="number" defaultValue="5000" required />
            <Select label="Destination Warehouse">
              <option>Main Feed Store</option>
              <option>Vet & Biosecurity Depot</option>
            </Select>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReceiveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Confirm Goods Receipt
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

