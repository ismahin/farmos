"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck,
  Plus,
  Search,
  ShoppingCart,
  Truck,
  Users,
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
import {
  mockPurchaseOrders,
  mockPurchaseRequisitions,
  mockSuppliers,
} from "@/mocks/procurement";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export default function PurchasingPage() {
  const [activeTab, setActiveTab] = React.useState("requisitions");
  const [requisitions, setRequisitions] = React.useState(mockPurchaseRequisitions);
  const [createPrOpen, setCreatePrOpen] = React.useState(false);

  const handleApprovePr = (prId: string) => {
    setRequisitions((prev) =>
      prev.map((r) => (r.id === prId ? { ...r, status: "APPROVED" } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Procurement & Supplier Requisitions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Purchase requests, supplier orders, expected receipts, and inventory replenishment
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setCreatePrOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          + New Requisition
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-slate-200 pb-3">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="requisitions">
              Purchase Requisitions ({requisitions.length})
            </TabsTrigger>
            <TabsTrigger value="orders">
              Purchase Orders ({mockPurchaseOrders.length})
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              Approved Suppliers ({mockSuppliers.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: PURCHASE REQUISITIONS */}
        <TabsContent value="requisitions" className="space-y-4 pt-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PR #</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Items / Description</TableHead>
                  <TableHead>Required By</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead className="text-right">Est. Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisitions.map((pr) => (
                  <TableRow key={pr.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-900">
                      {pr.prNumber}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {pr.requestedBy}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {pr.department}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 max-w-xs">
                      {pr.items.map((i) => `${i.itemName} (${i.requestedQty} ${i.uom})`).join(", ")}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-medium">
                      {pr.requiredByDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={pr.urgency === "CRITICAL" ? "danger" : "default"}
                      >
                        {pr.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency(pr.totalEstimatedAmount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={pr.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {pr.status === "PENDING_APPROVAL" ? (
                        <Button
                          size="sm"
                          onClick={() => handleApprovePr(pr.id)}
                          className="h-8 bg-emerald-600 hover:bg-emerald-700 text-xs"
                        >
                          Approve
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          Approved
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 2: PURCHASE ORDERS */}
        <TabsContent value="orders" className="space-y-4 pt-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Ordered Lines</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPurchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-900">
                      {po.poNumber}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800">
                      {po.supplierName}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {po.orderDate}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-800">
                      {po.expectedDeliveryDate}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {po.deliveryWarehouseName}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-700">
                      {po.lines.length} lines
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency(po.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={po.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 3: APPROVED SUPPLIERS */}
        <TabsContent value="suppliers" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockSuppliers.map((sup) => (
              <Card key={sup.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {sup.name}
                      </CardTitle>
                      <span className="font-mono text-xs text-slate-400">
                        {sup.code}
                      </span>
                    </div>
                    <Badge variant="secondary">{sup.leadTimeDays}d lead time</Badge>
                  </div>
                  <CardDescription>{sup.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-semibold text-slate-800">{sup.contactPerson}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-700">{sup.email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Total Spend YTD:</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(sup.totalSpendYTD)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create PR Modal Prototype */}
      <Modal
        isOpen={createPrOpen}
        onClose={() => setCreatePrOpen(false)}
        title="Create Purchase Requisition Draft"
        description="Draft internal requisition for approval by authorized farm manager."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCreatePrOpen(false);
          }}
          className="space-y-3"
        >
          <Select label="Item to Order">
            <option>Broiler Grower Pellets (20% CP)</option>
            <option>Broiler Starter Crumbs (22% CP)</option>
            <option>Newcastle Disease Vaccine B1</option>
            <option>Plastic Transport Crates</option>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Required Quantity" type="number" defaultValue="5000" required />
            <Input label="Unit of Measure" defaultValue="kg" disabled />
          </div>
          <Input label="Required By Date" type="date" defaultValue="2026-09-24" required />
          <Input
            label="Business Justification"
            defaultValue="Critical buffer replenishment: current stock depleted in 2.3 days."
            required
          />
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreatePrOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Submit Requisition Draft
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

