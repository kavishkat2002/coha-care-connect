import { createFileRoute } from "@tanstack/react-router";
import { Building2, CalendarCheck, CreditCard, Star, Stethoscope } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hospitals } from "@/data/mock";

export const Route = createFileRoute("/hospital/")({
  head: () => ({
    meta: [
      { title: "Hospital dashboard — COHA AI" },
      { name: "description", content: "Doctors, departments, appointments, revenue and ratings across your branches." },
      { property: "og:title", content: "Hospital dashboard — COHA AI" },
      { property: "og:description", content: "Operational view of departments, staff and appointments." },
    ],
  }),
  component: HospitalDashboard,
});

function HospitalDashboard() {
  const h = hospitals[0];
  return (
    <div className="space-y-8">
      <PageHeader title={h.name} description={`${h.branches.length} branches · ${h.city}`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Stethoscope} label="Active doctors" value="86" hint="12 online now" />
        <StatCard icon={CalendarCheck} label="Appointments this week" value="1,248" hint="+8% vs last week" />
        <StatCard icon={CreditCard} label="Revenue (month)" value="LKR 24.6M" hint="Across all branches" />
        <StatCard icon={Star} label="Average rating" value={`${h.rating}`} hint={`${h.reviews} reviews`} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Departments</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {h.departments.map((d) => (
              <Badge key={d} variant="secondary">
                {d}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-primary" aria-hidden="true" /> Branches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {h.branches.map((b) => (
              <p key={b} className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                {b}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
