import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/shared/Logo";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Role } from "@/data/mock";
import { portalHome, signIn } from "@/services/auth.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — COHA AI" },
      {
        name: "description",
        content:
          "Sign in or create a COHA AI account as a patient, doctor or hospital to access your care portal.",
      },
      { property: "og:title", content: "Sign in — COHA AI" },
      {
        property: "og:description",
        content: "Access your COHA AI patient, doctor or hospital portal.",
      },
    ],
  }),
  component: AuthPage,
});

const roles: { value: Role; label: string; icon: typeof UserRound; blurb: string }[] = [
  { value: "patient", label: "Patient", icon: UserRound, blurb: "Book care and track your health" },
  { value: "doctor", label: "Doctor", icon: Stethoscope, blurb: "Manage your clinic and queue" },
  { value: "hospital", label: "Hospital", icon: Building2, blurb: "Run departments and staff" },
  { value: "admin", label: "Administrator", icon: ShieldCheck, blurb: "Platform operations" },
];

function RoleSelect({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">I am signing in as</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {roles.map((r) => (
          <button
            key={r.value}
            type="button"
            aria-pressed={value === r.value}
            onClick={() => onChange(r.value)}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
              value === r.value
                ? "border-primary bg-accent"
                : "border-border bg-card hover:bg-muted",
            )}
          >
            <r.icon className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-sm font-medium">{r.label}</span>
              <span className="block text-xs text-muted-foreground">{r.blurb}</span>
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("patient");

  const enter = (email: string, name?: string) => {
    signIn(email, role, name);
    toast.success("Signed in");
    navigate({ to: portalHome[role] });
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-card p-10 lg:flex">
        <Link to="/">
          <Logo />
        </Link>
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold">Care that starts with understanding</h2>
          <p className="mt-4 text-muted-foreground">
            One account connects your appointments, AI assessments, reports and medical timeline
            across every hospital in the network.
          </p>
          <AiDisclaimer className="mt-8" />
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} COHA AI · Secure, consent-based health records
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot">Reset</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Sign in to your COHA AI portal.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const data = new FormData(e.currentTarget);
                      enter(String(data.get("email")));
                    }}
                  >
                    <RoleSelect value={role} onChange={setRole} />
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" name="email" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input id="login-password" name="password" type="password" required placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full">
                      Sign in
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Create your account</CardTitle>
                  <CardDescription>Choose the role that matches how you will use COHA AI.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const data = new FormData(e.currentTarget);
                      enter(String(data.get("email")), String(data.get("name")));
                    }}
                  >
                    <RoleSelect value={role} onChange={setRole} />
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full name</Label>
                      <Input id="reg-name" name="name" required placeholder="Dilani Rathnayake" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" name="email" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" name="password" type="password" required minLength={8} />
                    </div>
                    <Button type="submit" className="w-full">
                      Create account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forgot" className="mt-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Reset your password</CardTitle>
                  <CardDescription>We will email you a secure reset link.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      toast.success("If the email exists, a reset link is on its way.");
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input id="forgot-email" type="email" required placeholder="you@example.com" />
                    </div>
                    <Button type="submit" className="w-full">
                      Send reset link
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Authentication is running on a placeholder service — connect Lovable Cloud to enable real
            accounts and secure records.
          </p>
        </div>
      </div>
    </div>
  );
}
