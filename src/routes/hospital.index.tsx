import { createFileRoute } from "@tanstack/react-router";
import {
  Building2, CalendarCheck, CreditCard, RefreshCw,
  Star, Stethoscope, Wifi, WifiOff
} from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Hospital } from "@/data/mock";
import { getSession, type Session } from "@/services/auth.service";
import { hospitalService } from "@/services/hospital.service";
import { patientService, type DbAppointment } from "@/services/patient.service";
import { supabase } from "@/lib/supabase";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";

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
  const [doctorCount, setDoctorCount] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const loadAppointments = useCallback(async () => {
    try {
      const allAppts = await patientService.getAppointments();
      setAppointments(allAppts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsConnected(true);
      setLastRefresh(new Date());
    } catch (_) {
      setIsConnected(false);
    }
  }, []);

  const loadDoctorCount = useCallback(async () => {
    try {
      const { count } = await supabase
        .from("doctors_roster")
        .select("id", { count: "exact", head: true });
      setDoctorCount(count ?? 0);
    } catch (_) {}
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([loadAppointments(), loadDoctorCount()]);
    setIsRefreshing(false);
  }, [loadAppointments, loadDoctorCount]);

  useEffect(() => {
    // Initial load
    getSession().then(setSession);
    hospitalService.getAllHospitals().then(hospitals => {
      if (hospitals.length > 0) setH(hospitals[0]!);
    });
    void loadAppointments();
    void loadDoctorCount();

    // Real-time subscription on appointments table
    const channel = supabase
      .channel("hospital_appointments_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => { void loadAppointments(); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "doctors_roster" },
        () => { void loadDoctorCount(); }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    // Polling fallback every 20s
    const interval = setInterval(() => void loadAppointments(), 20_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [loadAppointments, loadDoctorCount]);

  if (!h) {
    return <LoadingScreen message="Loading dashboard..." fullscreen={false} />;
  }

  // Derived stats
  const confirmedCount = appointments.filter(a => a.status === "Confirmed").length;
  const pendingCount   = appointments.filter(a => a.status === "Pending").length;
  const todayStr       = new Date().toISOString().slice(0, 10);
  const todayAppts     = appointments.filter(a => a.date === todayStr);

  const statusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    if (status === "Confirmed") return "default";
    if (status === "Completed") return "secondary";
    if (status === "Cancelled") return "destructive";
    return "outline";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={session?.name ?? h.name}
          description={`${h.branches.length} branches · ${h.city}`}
        />
        <div className="flex items-center gap-2">

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs h-7"
          >
            <RefreshCw className={`size-3 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stat cards — real-time */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Stethoscope}
          label="Active doctors"
          value={doctorCount !== null ? doctorCount.toString() : "—"}
          hint="Live from roster"
        />
        <StatCard
          icon={CalendarCheck}
          label="Total bookings"
          value={appointments.length.toString()}
          hint={`${confirmedCount} confirmed · ${pendingCount} pending`}
        />
        <StatCard
          icon={CreditCard}
          label="Today's appointments"
          value={todayAppts.length.toString()}
          hint={`As of ${lastRefresh.toLocaleTimeString()}`}
        />
        <StatCard
          icon={Star}
          label="Average rating"
          value={`${h.rating}`}
          hint={`${h.reviews} reviews`}
        />
      </div>

      {/* Departments + Branches */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Departments</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {h.departments.map((d) => (
              <Badge key={d} variant="secondary">{d}</Badge>
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
              <p key={b} className="rounded-xl border border-border bg-muted/40 p-3 text-sm">{b}</p>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Live appointments table */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Recent Appointments</CardTitle>
            <div className="flex items-center gap-2">

              <span className="text-xs text-muted-foreground">
                Updated {lastRefresh.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date &amp; Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length > 0 ? (
                  appointments.slice(0, 15).map((a) => (
                    <TableRow key={a.id} className="transition-colors hover:bg-muted/30">
                      <TableCell className="font-medium">
                        {a.patient_name || a.patient_id || "Guest"}
                        {a.patient_mobile && (
                          <div className="text-xs text-muted-foreground">{a.patient_mobile}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {a.doctor_id}
                      </TableCell>
                      <TableCell className="text-sm">
                        {a.date}
                        <span className="text-muted-foreground"> · {a.time}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
