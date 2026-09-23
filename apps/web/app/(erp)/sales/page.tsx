"use client";

import * as React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Egg,
  FileText,
  Plus,
  Truck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { mockCustomers, mockInvoices, mockSalesOrders } from "@/mocks/sales";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export default function SalesPage() {
  const [activeTab, setActiveTab] = React.useState("orders");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Commercial Sales & Harvest Allocations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer contracts, live broiler allocations, delivery dispatch, and invoices
          </p>
        </div>

        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-semibold">
          <Plus className="h-4 w-4 mr-1.5" />
          + New Sales Order
        </Button>
      </div>

      {/* Harvest to Cash Journey Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Upcoming Harvest Allocation (Flock BR-2609-01)
            </span>
            <p className="text-xs text-slate-700">
              <strong>9,640 live broilers</strong> from House 01 are allocated to{" "}
              <strong>Apex Poultry Processors Ltd.</strong> for slaughter pickup on Sept 29.
            </p>
          </div>
          <Badge variant="success">Allocated: $42,512 Contract</Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-slate-200 pb-3">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="orders">
              Sales Orders ({mockSalesOrders.length})
            </TabsTrigger>
            <TabsTrigger value="customers">
              Customers ({mockCustomers.length})
            </TabsTrigger>
            <TabsTrigger value="invoices">
              Invoices & Collections ({mockInvoices.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: SALES ORDERS */}
        <TabsContent value="orders" className="space-y-4 pt-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Scheduled Dispatch</TableHead>
                  <TableHead>Allocated Products</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSalesOrders.map((so) => (
                  <TableRow key={so.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-900">
                      {so.orderNumber}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {so.customerName}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {so.orderDate}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-800">
                      {so.deliveryDate}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {so.items[0]?.productDescription}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatNumber(so.items[0]?.quantity || 0)} {so.items[0]?.uom}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-800">
                      {formatCurrency(so.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={so.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 2: CUSTOMERS */}
        <TabsContent value="customers" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockCustomers.map((cust) => (
              <Card key={cust.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {cust.name}
                      </CardTitle>
                      <span className="font-mono text-xs text-slate-400">
                        {cust.code}
                      </span>
                    </div>
                    <Badge variant="secondary">{cust.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-semibold text-slate-800">{cust.contactPerson}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Outstanding:</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(cust.outstandingBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Credit Limit:</span>
                    <span className="text-slate-700">{formatCurrency(cust.creditLimit)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: INVOICES */}
        <TabsContent value="invoices" className="space-y-4 pt-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Paid Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {inv.customerName}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {inv.issueDate}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      {inv.dueDate}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency(inv.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right text-emerald-700 font-medium">
                      {formatCurrency(inv.paidAmount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

