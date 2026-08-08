import { createFileRoute } from "@tanstack/react-router";
import { Bot, CalendarCheck, Stethoscope, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { patientService, type DbAppointment } from "@/services/patient.service";

export const Route = createFileRoute("/doctor/")({
  head: () => ({
    meta: [
      { title: "Doctor dashboard — MedDoc" },
      { name: "description", content: "Today's appointments, patient queue and AI assessments awaiting review." },
      { property: "og:title", content: "Doctor dashboard — MedDoc" },
      { property: "og:description", content: "Clinic queue, AI assessments and follow-ups." },
    ],
  }),
  component: DoctorDashboard,
});



function DoctorDashboard() {
  const [appointments, setAppointments] = useState<DbAppointment[]>([]);
  
  useEffect(() => {
    async function fetchAppts() {
      const allAppts = await patientService.getAppointments();
      setAppointments(allAppts.sort((a, b) => a.time.localeCompare(b.time)));
    }
    fetchAppts();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Today's clinic" description="Wednesday · Lakeside General Hospital, Colombo 07" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Appointments today" value={appointments.length.toString()} hint="Live from booking system" />
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
              {appointments.length > 0 ? (
                appointments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.patient_name || a.patient_id || "Guest Patient"}
                      <div className="text-xs text-muted-foreground">{a.patient_mobile || "No Mobile"}</div>
                    </TableCell>
                    <TableCell>{a.time} - {a.date}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">Patient #{a.queue_number}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">Unreviewed</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-4">No appointments today</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AiDisclaimer className="max-w-2xl" />
    </div>
  );
}
