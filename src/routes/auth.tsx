import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Logo } from "@/components/shared/Logo";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Role } from "@/data/mock";
import { portalHome, signIn, signUp } from "@/services/auth.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MedDoc" },
      {
        name: "description",
        content:
          "Sign in or create a MedDoc account as a patient, doctor or hospital to access your care portal.",
      },
      { property: "og:title", content: "Sign in — MedDoc" },
      {
        property: "og:description",
        content: "Access your MedDoc patient, doctor or hospital portal.",
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

function RoleSelect({ value, onChange, allowed }: { value: Role; onChange: (r: Role) => void; allowed?: Role[] }) {
  const visibleRoles = allowed ? roles.filter(r => allowed.includes(r.value)) : roles;

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-foreground">I am signing in as</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleRoles.map((r) => (
          <motion.button
            key={r.value}
            type="button"
            aria-pressed={value === r.value}
            onClick={() => onChange(r.value)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "relative flex items-start gap-3 rounded-lg border p-4 text-left transition-colors duration-200",
              value === r.value
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-card hover:border-border/80 hover:bg-muted/50",
            )}
          >
            <div className={cn(
              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
              value === r.value 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              <r.icon className="size-4" aria-hidden="true" />
            </div>
            <span className="z-10">
              <span className={cn(
                "block text-sm font-medium transition-colors", 
                value === r.value ? "text-primary" : "text-foreground"
              )}>{r.label}</span>
              <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">{r.blurb}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </fieldset>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("patient");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success("Signed in successfully");
      navigate({ to: portalHome[role] });
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, registerRole: Role = "patient") => {
    setIsLoading(true);
    try {
      await signUp(email, password, registerRole, name);
      toast.success("Account created successfully");
      navigate({ to: portalHome[registerRole] });
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2 bg-background font-sans">
      
      {/* Clean, Solid Left Pane */}
      <div className="relative hidden flex-col justify-between p-12 lg:flex bg-slate-950 text-slate-50">
        <div className="relative z-20">
          <Link to="/" className="inline-block">
            <div className="text-white drop-shadow-sm brightness-0 invert">
              <Logo />
            </div>
          </Link>
        </div>
        
        <div className="relative z-20 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h2 className="text-4xl font-semibold tracking-tight text-white leading-tight">
              Care that starts with understanding.
            </h2>
            <p className="mt-5 text-slate-300 leading-relaxed text-lg">
              One seamless account connects your appointments, AI assessments, reports, and medical timeline
              across every hospital in the network.
            </p>
            <div className="mt-10 bg-slate-900 p-5 rounded-xl border border-slate-800">
               <AiDisclaimer className="text-slate-300 [&_svg]:text-slate-400" />
            </div>
          </motion.div>
        </div>
        
        <p className="relative z-20 text-sm text-slate-500">
          © {new Date().getFullYear()} MedDoc · Secure, consent-based health records
        </p>
      </div>

      {/* Clean Right Pane */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8 bg-background">
        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 lg:hidden flex justify-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="forgot">Reset</TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="login" className="mt-0 outline-none">
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-border shadow-sm bg-card rounded-xl">
                      <CardHeader className="space-y-1.5 pb-6 pt-8 px-8">
                        <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
                        <CardDescription className="text-base">Sign in to your MedDoc portal.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-8 pb-8">
                        <form
                          className="space-y-5"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const data = new FormData(e.currentTarget);
                            handleLogin(String(data.get("email")), String(data.get("password")));
                          }}
                        >
                          <RoleSelect value={role} onChange={setRole} />
                          <div className="space-y-2">
                            <Label htmlFor="login-email">Email address</Label>
                            <Input id="login-email" name="email" type="email" required placeholder="you@example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <Input id="login-password" name="password" type="password" required placeholder="••••••••" />
                          </div>
                          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="register" className="mt-0 outline-none">
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-border shadow-sm bg-card rounded-xl">
                      <CardHeader className="space-y-1.5 pb-6 pt-8 px-8">
                        <CardTitle className="text-2xl font-semibold tracking-tight">Create account</CardTitle>
                        <CardDescription className="text-base">Choose the role that matches how you will use MedDoc.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-8 pb-8">
                        <form
                          className="space-y-5"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const data = new FormData(e.currentTarget);
                            handleRegister(String(data.get("email")), String(data.get("password")), String(data.get("name")), role);
                          }}
                        >
                          <RoleSelect value={role} onChange={setRole} allowed={["patient", "admin"]} />
                          <div className="space-y-2">
                            <Label htmlFor="reg-name">Full name</Label>
                            <Input id="reg-name" name="name" required placeholder="Dilani Rathnayake" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-email">Email address</Label>
                            <Input id="reg-email" name="email" type="email" required placeholder="you@example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-password">Password</Label>
                            <Input id="reg-password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" />
                          </div>
                          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Create account"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="forgot" className="mt-0 outline-none">
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-border shadow-sm bg-card rounded-xl">
                      <CardHeader className="space-y-1.5 pb-6 pt-8 px-8">
                        <CardTitle className="text-2xl font-semibold tracking-tight">Reset password</CardTitle>
                        <CardDescription className="text-base">We will email you a secure reset link.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-8 pb-8">
                        <form
                          className="space-y-5"
                          onSubmit={(e) => {
                            e.preventDefault();
                            toast.success("If the email exists, a reset link is on its way.");
                          }}
                        >
                          <div className="space-y-2">
                            <Label htmlFor="forgot-email">Email address</Label>
                            <Input id="forgot-email" type="email" required placeholder="you@example.com" />
                          </div>
                          <Button type="submit" variant="default" className="w-full h-11 text-base font-medium">
                            Send reset link
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
