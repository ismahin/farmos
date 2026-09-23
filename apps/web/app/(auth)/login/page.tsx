"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock, Mail, ShieldAlert } from "lucide-react";
import { ArrowRight, Lock, Mail, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/components/shell/auth-context";
import { isApiProblemError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("manager@exampleagro.com");
  const [password, setPassword] = React.useState("••••••••••••");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorExample, setErrorExample] = React.useState<string | null>(null);
  const { login, isAuthenticated, isLoadingSession } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
  const [email, setEmail] = React.useState("owner@example.com");
  const [password, setPassword] = React.useState("password123");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [correlationId, setCorrelationId] = React.useState<string | null>(null);

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (!isLoadingSession && isAuthenticated) {
      router.push("/");
    }
  }, [isLoadingSession, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorExample("Please provide both email and password.");
      setErrorMessage("Please provide both email and password.");
      setCorrelationId(null);
      return;
    }
    setIsLoading(true);
    setErrorExample(null);
    setTimeout(() => {
      setIsLoading(false);

    setIsSubmitting(true);
    setErrorMessage(null);
    setCorrelationId(null);

    try {
      await login({ email, password });
      router.push("/");
    }, 700);
    } catch (err) {
      if (isApiProblemError(err)) {
        setErrorMessage(err.message || err.title || "Authentication failed.");
        setCorrelationId(err.correlationId || null);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Authentication failed. Please check your credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword("farmos2026");
    setErrorExample(null);
  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setErrorMessage(null);
    setCorrelationId(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <Card className="border-slate-200/80 shadow-lg">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-xl font-bold text-slate-900">
            Sign In to FarmOS
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your agricultural ERP workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorExample && (
          {errorMessage && (
            <Alert
              variant="error"
              title="Authentication Notice"
              onDismiss={() => setErrorExample(null)}
              onDismiss={() => {
                setErrorMessage(null);
                setCorrelationId(null);
              }}
            >
              {errorExample}
              <div>
                <p>{errorMessage}</p>
                {correlationId && (
                  <p className="mt-1 font-mono text-[11px] text-rose-700">
                    Correlation ID: {correlationId}
                  </p>
                )}
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
          <form onSubmit={handleSubmit} data-testid="login-form" className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@farmcompany.com"
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <label htmlFor="password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setErrorExample(
                      "Password reset email link sent to mock mailbox (demonstrator only)."
                    setErrorMessage(
                      "Self-service password reset requires deployment-configured email service."
                    )
                  }
                  className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              isLoading={isLoading}
              isLoading={isSubmitting}
            >
              Sign In to Farm Workspace
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          {/* Error State Trigger (Required by M01 prompt) */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Test Error State:</span>
            <button
              type="button"
              onClick={() =>
                setErrorExample(
                  "Invalid tenant or invalid credentials. Ensure your organization domain is registered."
                )
              }
              className="text-rose-600 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <ShieldAlert className="h-3 w-3" />
              Simulate Login Error
            </button>
          </div>

          {/* Quick Persona Demo Fill */}
          {/* Quick Credential Helpers for Development / Testing */}
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 space-y-2">
            <p className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
              Prototype Quick Logins
              Test Accounts (Pre-fill)
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill("mahin@exampleagro.com", "Manager")}
                onClick={() => handleQuickFill("owner@example.com", "password123")}
                className="rounded-lg border border-slate-200 bg-white p-2 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-800">Farm Manager</p>
                <p className="text-[10px] text-slate-400">Mahin (Full Ops)</p>
                <p className="font-semibold text-slate-800">Tenant Owner</p>
                <p className="text-[10px] text-slate-400">owner@example.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("david@exampleagro.com", "Owner")}
                onClick={() => handleQuickFill("manager@exampleagro.com", "password123")}
                className="rounded-lg border border-slate-200 bg-white p-2 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-800">Farm Owner</p>
                <p className="text-[10px] text-slate-400">David (Finance/KPI)</p>
                <p className="font-semibold text-slate-800">Farm Manager</p>
                <p className="text-[10px] text-slate-400">manager@...</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("alice@exampleagro.com", "Storekeeper")}
                onClick={() => handleQuickFill("worker@example.com", "password123")}
                className="rounded-lg border border-slate-200 bg-white p-2 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-800">Storekeeper</p>
                <p className="text-[10px] text-slate-400">Alice (Inventory/PO)</p>
                <p className="font-semibold text-slate-800">Field Worker</p>
                <p className="text-[10px] text-slate-400">worker@example.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("john@exampleagro.com", "Worker")}
                className="rounded-lg border border-slate-200 bg-white p-2 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
                onClick={() => handleQuickFill("bad-user@example.com", "wrongpass")}
                className="rounded-lg border border-slate-200 bg-white p-2 text-left hover:border-rose-400 hover:bg-rose-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-800">Field Worker</p>
                <p className="text-[10px] text-slate-400">John (Today/FastLog)</p>
                <p className="font-semibold text-rose-700">Invalid Login</p>
                <p className="text-[10px] text-slate-400">Test 401 Error</p>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            New organization?{" "}
            <Link
              href="/signup"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Start Onboarding Free
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

