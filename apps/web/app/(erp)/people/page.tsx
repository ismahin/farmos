"use client";

import * as React from "react";
import { Users, Plus, ShieldCheck, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PeoplePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Farm Personnel & Work Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            House operators, veterinarians, storekeepers, and task allocations
          </p>
        </div>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-1.5" />
          + Add Staff Member
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Operational Role</TableHead>
              <TableHead>Assigned Facility</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "Mahin",
                role: "Farm Operations Manager",
                facility: "North Integrated Farm",
                shift: "Full-Time Day",
                email: "mahin@exampleagro.com",
                status: "On Duty",
              },
              {
                name: "John Kiprono",
                role: "Poultry House Operator",
                facility: "House 01 & House 03",
                shift: "Morning (06:00 - 15:00)",
                email: "john@exampleagro.com",
                status: "On Duty",
              },
              {
                name: "Alice Mwangi",
                role: "Storekeeper & Receiving",
                facility: "Main Feed Store",
                shift: "Day (07:00 - 16:00)",
                email: "alice@exampleagro.com",
                status: "On Duty",
              },
              {
                name: "Dr. Paul Kariuki",
                role: "Attending Veterinarian",
                facility: "Vet & Biosecurity Depot",
                shift: "Consultant / On Call",
                email: "dr.paul@exampleagro.com",
                status: "Active",
              },
              {
                name: "Peter Ochieng",
                role: "Maintenance Technician",
                facility: "All Units & Generators",
                shift: "Day (08:00 - 17:00)",
                email: "peter@exampleagro.com",
                status: "In House 02",
              },
            ].map((staff, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-bold text-slate-900">{staff.name}</TableCell>
                <TableCell className="text-xs text-slate-700 font-medium">{staff.role}</TableCell>
                <TableCell className="text-xs text-slate-600">{staff.facility}</TableCell>
                <TableCell className="text-xs text-slate-500">{staff.shift}</TableCell>
                <TableCell className="text-xs font-mono text-slate-600">{staff.email}</TableCell>
                <TableCell>
                  <Badge variant="success">{staff.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

