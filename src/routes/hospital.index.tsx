import { createFileRoute } from "@tanstack/react-router";
import { Building2, CalendarCheck, CreditCard, Star, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Hospital } from "@/data/mock";
import { getSession, type Session } from "@/services/auth.service";
import { hospitalService } from "@/services/hospital.service";
import { patientService, type DbAppointment } from "@/services/patient.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/hospital/")({
  head: () => ({
    meta: [
      { title: "Hospital dashboard — MedDoc" },
      { name: "description", content: "Doctors, departments, appointments, revenue and ratings across your branches." },
      { property: "og:title", content: "Hospital dashboard — MedDoc" },
      { property: "og:description", content: "Operational view of departments, staff and appointments." },
    ],
  }),
  component: HospitalDashboard,
});

function HospitalDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [h, setH] = useState<Hospital | null>(null);
  const [appointments, setAppointments] = useState<DbAppointment[]>([]);
  
  useEffect(() => {
    getSession().then(setSession);
    async function load() {
      const allHospitals = await hospitalService.getAllHospitals();
      if (allHospitals.length > 0) {
        setH(allHospitals[0]!);
      }
      
      const allAppts = await patientService.getAppointments();
      setAppointments(allAppts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    load();
  }, []);

  if (!h) {
    return <LoadingScreen message="Loading dashboard..." fullscreen={false} />;
  }
  
  return (
    <div className="space-y-8">
      <PageHeader title={session?.name ?? h.name} description={`${h.branches.length} branches · ${h.city}`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Stethoscope} label="Active doctors" value="86" hint="12 online now" />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={appointments.length.toString()} hint="Live from system" />
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

      <Card className="shadow-soft mt-8">
        <CardHeader>
          <CardTitle className="text-base">Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.slice(0, 10).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.patient_name || a.patient_id || "Guest"}
                      <div className="text-xs text-muted-foreground">{a.patient_mobile || ""}</div>
                    </TableCell>
                    <TableCell>{a.doctor_id}</TableCell>
                    <TableCell>{a.date} at {a.time}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={a.status === 'Confirmed' ? 'default' : 'outline'}>{a.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-4">No recent appointments</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
