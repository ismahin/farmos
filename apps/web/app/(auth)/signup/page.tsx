"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState("David Wachira");
  const [email, setEmail] = React.useState("david@exampleagro.com");
  const [password, setPassword] = React.useState("securePassword123");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/onboarding");
    }, 600);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <Card className="border-slate-200/80 shadow-lg">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-xl font-bold text-slate-900">
            Create FarmOS Account
          </CardTitle>
          <CardDescription>
            Begin setup for your agriculture enterprise and operational farms.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. David Wachira"
              leftIcon={<User className="h-4 w-4" />}
              required
            />

            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@farmcompany.com"
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              label="Create Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              leftIcon={<Lock className="h-4 w-4" />}
              required
              helperText="Must include a number and symbol."
            />

            <Button
              type="submit"
              className="w-full font-semibold"
              isLoading={isLoading}
            >
              Continue to Farm Setup
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

