import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
import {
  type Appointment,
  type ReportItem,
  type TimelineItem,
  doctors,
  hospitals,
  SPECIALTIES
} from "@/data/mock";
import { patientService, type DbAppointment, type PatientProfile } from "@/services/patient.service";

export const Route = createFileRoute("/patient/")({
  head: () => ({
    meta: [
      { title: "Patient dashboard — MedDoc" },
      {
        name: "description",
        content:
          "Your health summary, upcoming appointments, recent reports and AI health insights in one place.",
      },
      { property: "og:title", content: "Patient dashboard — MedDoc" },
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
  const [appointments, setAppointments] = useState<DbAppointment[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  const [chatMessagesCount, setChatMessagesCount] = useState(0);
  const [reportsAnalysedCount, setReportsAnalysedCount] = useState(0);
  const [healthScore, setHealthScore] = useState(82);
  const [healthHint, setHealthHint] = useState("Stable this month");

  useEffect(() => {
    async function loadData() {
      const [appts, profile, rpts, tl] = await Promise.all([
        patientService.getAppointments(),
        patientService.getPatientProfile(),
        patientService.getReports(),
        patientService.getTimeline()
      ]);
      setAppointments(appts);
      setPatientProfile(profile);
      setReports(rpts);
      setTimeline(tl);

      // --- Real Data Analytics from AI Collaboration ---
      setReportsAnalysedCount(rpts.length);
      const savedMessages = localStorage.getItem("meddoc_messages");
      if (savedMessages) {
        try {
          const messages = JSON.parse(savedMessages);
          setChatMessagesCount(Math.max(0, messages.length - 1)); // exclude initial greeting
          const attachmentsCount = messages.filter((m: any) => m.attachment || m.imageBase64).length;
          setReportsAnalysedCount(rpts.length + attachmentsCount);
        } catch (e) {
          console.error(e);
        }
      }

      const savedAssessment = localStorage.getItem("meddoc_assessment");
      if (savedAssessment) {
        try {
          const assessment = JSON.parse(savedAssessment);
          if (assessment.risk === "low") {
            setHealthScore(94);
            setHealthHint("Looking great based on assessment");
          } else if (assessment.risk === "moderate") {
            setHealthScore(72);
            setHealthHint("Needs attention soon");
          } else if (assessment.risk === "elevated") {
            setHealthScore(45);
            setHealthHint("Action required immediately");
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    loadData();
  }, []);

  const upcoming = appointments.filter((a) => a.status !== "Completed" && a.status !== "Cancelled");

  if (!patientProfile) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Good day, ${patientProfile.name.split(" ")[0]}`}
        description="Here is your current health picture and what needs attention next."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={HeartPulse} label="Health score" value={`${healthScore} / 100`} hint={healthHint} />
        <StatCard icon={CalendarCheck} label="Upcoming visits" value={String(upcoming.length)} hint="Next: 12 Aug" />
        <StatCard icon={FileText} label="Reports analysed" value={String(reportsAnalysedCount)} hint={reportsAnalysedCount > reports.length ? `${reportsAnalysedCount - reports.length} new from chat` : "3 flagged values"} />
        <StatCard icon={Activity} label="AI Interactions" value={String(chatMessagesCount)} hint="Recent collaborations" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Upcoming appointments</CardTitle>
            <CardDescription>Confirmed and pending visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((a) => {
              const doc = doctors.find(d => d.id === a.doctor_id);
              const hosp = hospitals.find(h => h.id === a.hospital_id);
              
              return (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{doc ? doc.name : a.doctor_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc ? doc.specialty : "General"} · {hosp ? hosp.name : a.hospital_id}
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
              );
            })}
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
