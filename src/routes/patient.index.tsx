import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  CalendarCheck,
  FileText,
  HeartPulse,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { appointments, patientProfile, reports, timeline } from "@/data/mock";

export const Route = createFileRoute("/patient/")({
  head: () => ({
    meta: [
      { title: "Patient dashboard — COHA AI" },
      {
        name: "description",
        content:
          "Your health summary, upcoming appointments, recent reports and AI health insights in one place.",
      },
      { property: "og:title", content: "Patient dashboard — COHA AI" },
      { property: "og:description", content: "Health summary, appointments and AI insights." },
    ],
  }),
  component: PatientOverview,
});

const quickActions = [
  { label: "Book appointment", to: "/patient/book", icon: CalendarCheck },
  { label: "Start AI chat", to: "/patient/assistant", icon: Bot },
  { label: "Upload report", to: "/patient/reports", icon: Upload },
  { label: "Upload medical image", to: "/patient/images", icon: ImageIcon },
];

function PatientOverview() {
  const upcoming = appointments.filter((a) => a.status !== "Completed" && a.status !== "Cancelled");

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Good day, ${patientProfile.name.split(" ")[0]}`}
        description="Here is your current health picture and what needs attention next."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={HeartPulse} label="Health score" value="82 / 100" hint="Stable this month" />
        <StatCard icon={CalendarCheck} label="Upcoming visits" value={String(upcoming.length)} hint="Next: 12 Aug" />
        <StatCard icon={FileText} label="Reports analysed" value="2" hint="3 flagged values" />
        <StatCard icon={Activity} label="Timeline events" value={String(timeline.length)} hint="Last 60 days" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Upcoming appointments</CardTitle>
            <CardDescription>Confirmed and pending visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
              >
                <div>
                  <p className="text-sm font-medium">{a.doctor}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.specialty} · {a.hospital}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {a.date} · {a.time}
                  </p>
                  <Badge variant={a.status === "Confirmed" ? "secondary" : "outline"} className="mt-1">
                    {a.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" size="sm">
              <Link to="/patient/appointments">View appointment history</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((qa) => (
              <Button key={qa.to} asChild variant="outline" className="justify-start">
                <Link to={qa.to}>
                  <qa.icon className="mr-2 size-4" /> {qa.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Recent reports</CardTitle>
            <CardDescription>AI summaries of your uploads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((r) => (
              <div key={r.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{r.title}</p>
                  <Badge variant={r.status === "Analysed" ? "secondary" : "outline"}>{r.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.type} · {r.date} · {r.flagged} flagged value(s)
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.summary}</p>
                <Separator className="mt-4" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Personal health insights</CardTitle>
            <CardDescription>Generated from your records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Annual skin screening is due — your last review was 13 months ago.",
              "Iron levels trended low across two reports. A dietary review may help.",
              "Family history noted: consider a breast screening consultation this year.",
            ].map((insight) => (
              <div key={insight} className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
                {insight}
              </div>
            ))}
            <AiDisclaimer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
