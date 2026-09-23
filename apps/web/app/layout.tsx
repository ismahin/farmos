import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/shell/auth-context";

export const metadata: Metadata = {
  title: "FarmOS — Agriculture ERP SaaS",
  description:
    "Configurable, multi-tenant Agriculture ERP SaaS for mixed-farm operations with deep poultry MVP workflow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans bg-slate-50 text-slate-900">
        {children}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

