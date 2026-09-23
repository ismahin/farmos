import * as React from "react";
import { AppShell } from "@/components/shell";
import { AppShell, AuthGuard } from "@/components/shell";

export default function ErpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}

