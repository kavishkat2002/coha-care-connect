import { createFileRoute } from "@tanstack/react-router";
import { Bot, CalendarCheck, Stethoscope, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/doctor/")({
  head: () => ({
    meta: [
      { title: "Doctor dashboard — COHA AI" },
      { name: "description", content: "Today's appointments, patient queue and AI assessments awaiting review." },
      { property: "og:title", content: "Doctor dashboard — COHA AI" },
      { property: "og:description", content: "Clinic queue, AI assessments and follow-ups." },
    ],
  }),
  component: DoctorDashboard,
});

const queue = [
  { name: "Dilani Rathnayake", time: "09:00", reason: "Skin lesion review", ai: "Low risk indication" },
  { name: "Kasun Silva", time: "09:30", reason: "Oral ulcer, 3 weeks", ai: "Moderate risk indication" },
  { name: "Nimasha Perera", time: "10:15", reason: "Blood report review", ai: "2 flagged values" },
  { name: "Tharindu Weera", time: "11:00", reason: "Follow-up", ai: "—" },
];

function DoctorDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader title="Today's clinic" description="Wednesday · Lakeside General Hospital, Colombo 07" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Appointments today" value="14" hint="4 telemedicine" />
        <StatCard icon={Users} label="Waiting now" value="3" hint="Average wait 12 min" />
        <StatCard icon={Bot} label="AI assessments to review" value="6" hint="2 flagged moderate" />
        <StatCard icon={Stethoscope} label="Follow-ups due" value="5" hint="This week" />
      </div>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Patient queue</CardTitle>
          <CardDescription>AI notes are indications only and require your review</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="hidden sm:table-cell">Reason</TableHead>
                <TableHead className="text-right">AI note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((q) => (
                <TableRow key={q.name}>
                  <TableCell className="font-medium">{q.name}</TableCell>
                  <TableCell>{q.time}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{q.reason}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{q.ai}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AiDisclaimer className="max-w-2xl" />
    </div>
  );
}
