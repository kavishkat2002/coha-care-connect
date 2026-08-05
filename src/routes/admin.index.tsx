import { createFileRoute } from "@tanstack/react-router";
import { Building2, ShieldCheck, Stethoscope, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <div className="space-y-8">
      <PageHeader title="Platform administration" description="Network health, usage and AI oversight." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Registered users" value="182,340" hint="+2.1% this month" />
        <StatCard icon={Stethoscope} label="Verified doctors" value="1,312" hint="24 pending review" />
        <StatCard icon={Building2} label="Hospitals" value="42" hint="97 branches" />
        <StatCard icon={ShieldCheck} label="AI requests (24h)" value="9,481" hint="0 escalations" />
      </div>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">AI monitoring</CardTitle>
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
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4 text-sm"
            >
              <span className="font-medium">{name}</span>
              <span className="text-muted-foreground">{status}</span>
              <Badge variant="outline">{note}</Badge>
            </div>
          ))}
          <AiDisclaimer />
        </CardContent>
      </Card>
    </div>
  );
}
