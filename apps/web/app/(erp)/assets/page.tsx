"use client";

import * as React from "react";
import { Wrench, Plus, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Machinery & Fixed Assets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Backup generators, ventilation fans, feeding augers, and equipment maintenance schedules
          </p>
        </div>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-1.5" />
          + Register Asset
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Tag / Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Serviced</TableHead>
              <TableHead>Next Routine Service</TableHead>
              <TableHead>Operational Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                tag: "EQ-GEN-01",
                name: "Cummins 150kVA Standby Diesel Generator",
                category: "Power & Backup",
                location: "Generator Bay North",
                lastService: "2026-08-15",
                nextService: "2026-11-15",
                status: "Operational",
              },
              {
                tag: "EQ-FAN-H03",
                name: "Tunnel Ventilation Fan Bank 2 (House 03)",
                category: "Climate Control",
                location: "House 03 Exhaust",
                lastService: "2026-09-21 (Breaker repair)",
                nextService: "2026-10-21",
                status: "Operational",
              },
              {
                tag: "EQ-AUG-01",
                name: "Main Silo Automated Feed Auger Line",
                category: "Feed Distribution",
                location: "Main Feed Store to H01-03",
                lastService: "2026-09-01",
                nextService: "2026-12-01",
                status: "Operational",
              },
              {
                tag: "EQ-FOG-02",
                name: "Thermal Biosecurity Fogging Machine",
                category: "Sanitation",
                location: "House 02 (Cleanout)",
                lastService: "2026-09-10",
                nextService: "2026-10-10",
                status: "In Use (Cleanout)",
              },
            ].map((asset) => (
              <TableRow key={asset.tag}>
                <TableCell className="font-bold text-slate-900">
                  <div>{asset.name}</div>
                  <span className="font-mono text-xs text-slate-400 font-normal">{asset.tag}</span>
                </TableCell>
                <TableCell className="text-xs text-slate-700">{asset.category}</TableCell>
                <TableCell className="text-xs text-slate-600">{asset.location}</TableCell>
                <TableCell className="text-xs text-slate-500">{asset.lastService}</TableCell>
                <TableCell className="text-xs font-semibold text-slate-800">{asset.nextService}</TableCell>
                <TableCell>
                  <Badge variant="success">{asset.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

