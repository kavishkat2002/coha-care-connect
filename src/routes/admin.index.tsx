import { createFileRoute } from "@tanstack/react-router";
import { Building2, ShieldCheck, Stethoscope, Users, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCreateAccount } from "@/services/auth.service";
import type { Role } from "@/data/mock";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Platform administration — COHA AI" },
      { name: "description", content: "Users, hospitals, appointments, AI monitoring and platform settings." },
      { property: "og:title", content: "Platform administration — COHA AI" },
      { property: "og:description", content: "Operational and AI monitoring for the COHA AI platform." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleProvision = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const role = data.get("role") as Role;
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    setIsLoading(true);
    try {
      await adminCreateAccount(email, password, role, name);
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully!`);
      (e.target as HTMLFormElement).reset(); // clear form
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Platform administration" description="Network health, usage and AI oversight." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Registered users" value="182,340" hint="+2.1% this month" />
        <StatCard icon={Stethoscope} label="Verified doctors" value="1,312" hint="24 pending review" />
        <StatCard icon={Building2} label="Hospitals" value="42" hint="97 branches" />
        <StatCard icon={ShieldCheck} label="AI requests (24h)" value="9,481" hint="0 escalations" />
      </div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              <CardTitle className="text-lg">Account Provisioning</CardTitle>
            </div>
            <CardDescription>Securely create new Doctor and Hospital accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProvision} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prov-role">Account Role</Label>
                <select 
                  id="prov-role" 
                  name="role" 
                  required 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="doctor">Doctor</option>
                  <option value="hospital">Hospital</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prov-name">Full Name or Organization Name</Label>
                <Input id="prov-name" name="name" required placeholder="Dr. Jane Doe / Central Hospital" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prov-email">Email Address</Label>
                <Input id="prov-email" name="email" type="email" required placeholder="contact@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prov-password">Initial Password</Label>
                <Input id="prov-password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border h-fit">
          <CardHeader>
            <CardTitle className="text-lg">AI monitoring</CardTitle>
            <CardDescription>Model versions, latency and review coverage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Symptom analysis", "Placeholder service", "Awaiting model"],
              ["Medical vision", "Placeholder service", "Awaiting model"],
              ["Report analysis", "Placeholder service", "Awaiting model"],
            ].map(([name, status, note]) => (
              <div
                key={name}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm bg-muted/30"
              >
                <span className="font-medium">{name}</span>
                <span className="text-muted-foreground">{status}</span>
                <Badge variant="outline">{note}</Badge>
              </div>
            ))}
            <AiDisclaimer className="mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
