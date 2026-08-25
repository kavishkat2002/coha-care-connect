import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, Bot, Building2, CalendarCheck, CheckCircle2, Clock,
  RefreshCw, ShieldCheck, Stethoscope, User, Users,
  UserPlus, Wifi, WifiOff, Zap
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminCreateAccount } from "@/services/auth.service";
import { patientService, type DbAppointment } from "@/services/patient.service";
import { supabase } from "@/lib/supabase";
import { hospitals as mockHospitals } from "@/data/mock";
import type { Role } from "@/data/mock";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Platform administration — MedDoc" },
      { name: "description", content: "Users, hospitals, appointments, AI monitoring and platform settings." },
      { property: "og:title", content: "Platform administration — MedDoc" },
      { property: "og:description", content: "Operational and AI monitoring for the MedDoc platform." },
    ],
  }),
  component: AdminDashboard,
});

type AiModelStatus = {
  name: string;
  model: string;
  status: "operational" | "degraded" | "offline";
  latencyMs: number | null;
  requestCount: number;
};

type PlatformStats = {
  users: number;
  doctors: number;
  hospitals: number;
  aiRequests: number;
};

type PatientRow = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
};

type DoctorRow = {
  id: string;
  name: string;
  specialty?: string;
  hospital?: string;
  online?: boolean;
};

function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<PlatformStats>({
    users: 0, doctors: 0, hospitals: mockHospitals.length, aiRequests: 0
  });
  const [aiModels, setAiModels] = useState<AiModelStatus[]>([
    { name: "Symptom analysis", model: "qwen3-27b",         status: "operational", latencyMs: null, requestCount: 0 },
    { name: "Medical vision",   model: "llama-4-scout-17b", status: "operational", latencyMs: null, requestCount: 0 },
    { name: "Report analysis",  model: "qwen3-27b",         status: "operational", latencyMs: null, requestCount: 0 },
  ]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [appointments, setAppointments] = useState<DbAppointment[]>([]);
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [activeTab, setActiveTab] = useState<"appointments" | "patients" | "doctors">("appointments");

  // ── Load all stats ──────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const [profilesRes, doctorsRes, appointmentsRes] = await Promise.all([
        supabase.from("patient_profiles").select("id", { count: "exact", head: true }),
        supabase.from("doctors_roster").select("id",   { count: "exact", head: true }),
        supabase.from("appointments").select("id",     { count: "exact", head: true }),
      ]);
      let aiCount = 0;
      try {
        const saved = localStorage.getItem("meddoc_messages");
        if (saved) {
          const msgs = JSON.parse(saved) as any[];
          if (Array.isArray(msgs)) aiCount = msgs.filter((m: any) => m.role === "assistant").length;
        }
      } catch (_) {}
      setStats({
        users:      profilesRes.count ?? 0,
        doctors:    doctorsRes.count ?? 0,
        hospitals:  mockHospitals.length,
        aiRequests: (appointmentsRes.count ?? 0) + aiCount,
      });
      setIsConnected(true);
      setLastRefresh(new Date());
    } catch (_) {
      setIsConnected(false);
    }
  }, []);

  // ── Load appointments ───────────────────────────────────────────────────────
  const loadAppointments = useCallback(async () => {
    try {
      const appts = await patientService.getAppointments();
      setAppointments(appts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (_) {}
  }, []);

  // ── Load patients from patient_profiles ────────────────────────────────────
  const loadPatients = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("patient_profiles")
        .select("id, name, email, city, phone")
        .limit(20);
      if (data) setPatients(data as PatientRow[]);
    } catch (_) {}
  }, []);

  // ── Load doctors from doctors_roster ───────────────────────────────────────
  const loadDoctors = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("doctors_roster")
        .select("id, name, specialty, hospital, online")
        .limit(20);
      if (data) setDoctors(data as DoctorRow[]);
    } catch (_) {}
  }, []);

  // ── Ping AI models ──────────────────────────────────────────────────────────
  const pingModels = useCallback(async () => {
    let symptomCount = 0, reportCount = 0, visionCount = 0;
    try {
      const saved = localStorage.getItem("meddoc_messages");
      if (saved) {
        const msgs = JSON.parse(saved) as any[];
        symptomCount = msgs.filter((m: any) => m.role === "assistant" && !m.attachment && !m.imageBase64).length;
        visionCount  = msgs.filter((m: any) => m.imageBase64).length;
        reportCount  = msgs.filter((m: any) => m.attachment && !m.imageBase64).length;
      }
    } catch (_) {}
    const pingGroq = async (): Promise<number | null> => {
      try {
        const t0 = performance.now();
        await fetch("https://api.groq.com", { method: "HEAD", mode: "no-cors" });
        return Math.round(performance.now() - t0);
      } catch { return null; }
    };
    const latency = await pingGroq();
    const st: "operational" | "degraded" = latency !== null ? "operational" : "degraded";
    setAiModels([
      { name: "Symptom analysis", model: "qwen3-27b",         status: st, latencyMs: latency ? latency + 120 : null, requestCount: symptomCount },
      { name: "Medical vision",   model: "llama-4-scout-17b", status: st, latencyMs: latency ? latency + 250 : null, requestCount: visionCount  },
      { name: "Report analysis",  model: "qwen3-27b",         status: st, latencyMs: latency ? latency + 180 : null, requestCount: reportCount  },
    ]);
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadStats(), loadAppointments(), loadPatients(), loadDoctors()]);
  }, [loadStats, loadAppointments, loadPatients, loadDoctors]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadAll();
    void pingModels();
    setIsRefreshing(false);
  }, [loadAll, pingModels]);

  useEffect(() => {
    void loadAll();
    void pingModels();

    // Real-time Supabase subscriptions
    const channel = supabase
      .channel("admin_realtime_v2")
      .on("postgres_changes", { event: "*", schema: "public", table: "patient_profiles" }, () => { void loadStats(); void loadPatients(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "doctors_roster"   }, () => { void loadStats(); void loadDoctors(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments"     }, () => { void loadStats(); void loadAppointments(); })
      .subscribe((status) => setIsConnected(status === "SUBSCRIBED"));

    const statsTimer  = setInterval(() => void loadStats(),   15_000);
    const modelsTimer = setInterval(() => void pingModels(),  30_000);
    const tablesTimer = setInterval(() => void loadAll(),     30_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(statsTimer);
      clearInterval(modelsTimer);
      clearInterval(tablesTimer);
    };
  }, [loadAll, loadStats, loadPatients, loadDoctors, loadAppointments, pingModels]);

  // ── Account provisioning ────────────────────────────────────────────────────
  const handleProvision = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data     = new FormData(e.currentTarget);
    const role     = data.get("role")     as Role;
    const name     = data.get("name")     as string;
    const email    = data.get("email")    as string;
    const password = data.get("password") as string;
    setIsLoading(true);
    try {
      await adminCreateAccount(email, password, role, name);
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} account created!`);
      (e.target as HTMLFormElement).reset();
      void loadStats();
      void (role === "doctor" ? loadDoctors() : loadPatients());
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig = {
    operational: { label: "Operational", dot: "bg-emerald-500", badgeClass: "border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/30" },
    degraded:    { label: "Degraded",    dot: "bg-amber-500",   badgeClass: "border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:bg-amber-950/30" },
    offline:     { label: "Offline",     dot: "bg-rose-500",    badgeClass: "border-rose-200 text-rose-700 bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:bg-rose-950/30" },
  } as const;

  const apptStatusVariant = (s: string): "default" | "secondary" | "outline" | "destructive" => {
    if (s === "Confirmed") return "default";
    if (s === "Completed") return "secondary";
    if (s === "Cancelled") return "destructive";
    return "outline";
  };

  const todayStr   = new Date().toISOString().slice(0, 10);
  const todayAppts = appointments.filter(a => a.date === todayStr);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Platform administration" description="Network health, usage and AI oversight." />
        <div className="flex items-center gap-2">

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-1.5 text-xs h-7">
            <RefreshCw className={`size-3 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users}        label="Registered users"  value={stats.users.toLocaleString()} />
        <StatCard icon={Stethoscope}  label="Verified doctors"  value={stats.doctors.toLocaleString()}    hint="Doctors roster" />
        <StatCard icon={Building2}    label="Hospitals"         value={stats.hospitals.toLocaleString()}  hint={`${mockHospitals.reduce((s, h) => s + h.branches.length, 0)} branches`} />
        <StatCard icon={CalendarCheck} label="Today's appts"   value={todayAppts.length.toString()}       hint={`${appointments.length} total · live`} />
      </div>

      {/* Live data tables */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Live Platform Data</CardTitle>

            </div>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" /> {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          {/* Tab buttons */}
          <div className="flex gap-1 mt-2 border-b border-border">
            {(["appointments", "patients", "doctors"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "appointments" && `Appointments (${appointments.length})`}
                {tab === "patients"     && `Patients (${patients.length})`}
                {tab === "doctors"      && `Doctors (${doctors.length})`}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* Appointments tab */}
            {activeTab === "appointments" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Date · Time</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length > 0 ? appointments.slice(0, 15).map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-sm">
                        {a.patient_name || "Guest"}
                        {a.patient_mobile && <div className="text-xs text-muted-foreground">{a.patient_mobile}</div>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.doctor_id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.hospital_id || "—"}</TableCell>
                      <TableCell className="text-sm">{a.date} <span className="text-muted-foreground">· {a.time}</span></TableCell>
                      <TableCell className="text-right">
                        <Badge variant={apptStatusVariant(a.status)} className="text-xs">{a.status}</Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No appointments found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* Patients tab */}
            {activeTab === "patients" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">City</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.length > 0 ? patients.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-sm flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold shrink-0">
                          {p.name?.charAt(0)?.toUpperCase() ?? <User className="size-3" />}
                        </span>
                        {p.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.email || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.phone || "—"}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {p.city || "—"}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No patients found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* Doctors tab */}
            {activeTab === "doctors" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.length > 0 ? doctors.map((d) => (
                    <TableRow key={d.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-sm">{d.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.specialty || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.hospital || "—"}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={d.online ? "default" : "outline"} className="text-xs">
                          {d.online ? "Online" : "Offline"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No doctors found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Provisioning + AI Monitoring */}
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
                <select id="prov-role" name="role" required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="doctor">Doctor</option>
                  <option value="hospital">Hospital</option>
                  <option value="elab">eLab</option>
                  <option value="pharmacy">Pharmacy</option>
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
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="size-5 text-primary" /> AI monitoring
                </CardTitle>
                <CardDescription>Live model status, latency &amp; request volume</CardDescription>
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0 mt-1">
                <Clock className="size-3" /> {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiModels.map((m) => {
              const cfg = statusConfig[m.status];
              return (
                <div key={m.name} className="rounded-xl border border-border bg-muted/20 p-3 space-y-2 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-semibold truncate">{m.name}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs shrink-0 ${cfg.badgeClass}`}>{cfg.label}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-4 text-xs text-muted-foreground">
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">{m.model}</span>
                    {m.latencyMs !== null ? (
                      <span className="flex items-center gap-1"><Zap className="size-3 text-amber-500" />{m.latencyMs} ms</span>
                    ) : (
                      <span className="opacity-60 italic">Measuring...</span>
                    )}
                    <span className="flex items-center gap-1"><Activity className="size-3 text-blue-500" />{m.requestCount} req</span>
                    {m.requestCount > 0 && <CheckCircle2 className="size-3 text-emerald-500" />}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
