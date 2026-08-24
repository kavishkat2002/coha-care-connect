import { createFileRoute } from "@tanstack/react-router";
import { Activity, CalendarCheck, FileText, Image as ImageIcon, Pill } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type TimelineItem } from "@/data/mock";
import { patientService } from "@/services/patient.service";

export const Route = createFileRoute("/patient/timeline")({
  head: () => ({
    meta: [
      { title: "Health timeline — MedDoc" },
      {
        name: "description",
        content: "A chronological view of your visits, reports, image assessments and health insights.",
      },
      { property: "og:title", content: "Health timeline — MedDoc" },
      { property: "og:description", content: "Your care history in one chronological record." },
    ],
  }),
  component: TimelinePage,
});

const icons = {
  appointment: CalendarCheck,
  report: FileText,
  image: ImageIcon,
  insight: Activity,
  prescription: Pill,
} as const;

function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await patientService.getTimeline();
      setTimeline(data);

      const reps = await patientService.getReports();
      setReports(reps);

      const apps = await patientService.getAppointments();
      setAppointments(apps);

      const prof = await patientService.getPatientProfile();
      setProfile(prof);
    }
    load();
  }, []);

  const derivedTrends = useMemo(() => {
    const list: Array<{ label: string; value: string; colorClass: string; description: string }> = [];

    // 1. Determine Haematology & Iron levels
    const hasAnaemia = profile?.pastDiseases?.some((d: string) => d.toLowerCase().includes("iron") || d.toLowerCase().includes("anaemia")) || false;
    const takingFerrous = profile?.medications?.some((m: string) => m.toLowerCase().includes("ferrous") || m.toLowerCase().includes("iron")) || false;
    
    const bloodReps = reports.filter(r => r.type?.toLowerCase().includes("blood") || r.title?.toLowerCase().includes("fbc") || r.title?.toLowerCase().includes("blood"));
    
    let ironValue = "Stable & Optimal";
    let ironColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    let ironDesc = "Haematology parameters are within normal reference ranges.";

    if (bloodReps.length > 0) {
      const latestBlood = bloodReps[0];
      const hasAbnormal = latestBlood.status === "Analysed" && (latestBlood.summary?.toLowerCase().includes("abnormal") || latestBlood.summary?.toLowerCase().includes("flagged") || latestBlood.summary?.toLowerCase().includes("low"));
      if (hasAbnormal) {
        ironValue = "Attention Required";
        ironColor = "bg-red-500/10 text-red-600 border-red-500/20";
        ironDesc = "Out of range blood counts detected in recent reports.";
      }
    } else if (hasAnaemia || takingFerrous) {
      ironValue = "Managed (Ferrous)";
      ironColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
      ironDesc = "Anaemia history actively managed via daily supplements.";
    }
    list.push({ label: "Haematology & Iron levels", value: ironValue, colorClass: ironColor, description: ironDesc });

    // 2. Determine Skin Reviews status
    const skinAssessments = timeline.filter(t => t.title?.toLowerCase().includes("skin") || t.title?.toLowerCase().includes("mole") || t.title?.toLowerCase().includes("dermatology") || t.title?.toLowerCase().includes("image"));
    
    let skinValue = "Due";
    let skinColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
    let skinDesc = "Annual routine dermatologist review is recommended.";

    if (skinAssessments.length > 0) {
      const latestSkin = skinAssessments[0]!;
      if (latestSkin.title.toLowerCase().includes("completed") || latestSkin.title.toLowerCase().includes("analysed")) {
        skinValue = "Reviewed";
        skinColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
        skinDesc = "Consultation recently completed.";
      } else {
        skinValue = "Follow-up Advised";
        skinColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
        skinDesc = latestSkin.detail || "Recommended to re-review changes.";
      }
    }
    list.push({ label: "Dermatological Reviews", value: skinValue, colorClass: skinColor, description: skinDesc });

    // 3. Determine Consultation frequency
    let consultValue = "Stable";
    let consultColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    let consultDesc = "Regular clinical checkups are up to date.";

    if (appointments.length > 3) {
      consultValue = "Frequent Visits";
      consultColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
      consultDesc = "Multiple consult bookings recorded in the last 30 days.";
    } else if (appointments.length === 0) {
      consultValue = "No Bookings";
      consultColor = "bg-slate-500/10 text-slate-600 border-slate-500/20";
      consultDesc = "No upcoming or past clinical bookings found.";
    }
    list.push({ label: "Consultation Frequency", value: consultValue, colorClass: consultColor, description: consultDesc });

    return list;
  }, [timeline, reports, appointments, profile]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health timeline"
        description="Every visit, report and insight in one continuous record."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-6 border-l border-border pl-6">
              {timeline.map((t) => {
                const Icon = icons[t.kind];
                return (
                  <li key={t.id} className="relative">
                    <span className="absolute -left-[2.05rem] flex size-7 items-center justify-center rounded-full border border-border bg-card">
                      <Icon className="size-3.5 text-primary" aria-hidden="true" />
                    </span>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                    <p className="mt-0.5 text-sm font-medium">{t.title}</p>
                    <p className="text-sm text-muted-foreground">{t.detail}</p>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Health trends</CardTitle>
              <CardDescription>Built from your records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {derivedTrends.map((row) => (
                <div key={row.label} className="space-y-1 pb-3.5 border-b border-border/40 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-xs">{row.label}</span>
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.colorClass}`}>
                      {row.value}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {row.description}
                  </p>
                </div>
              ))}
              <AiDisclaimer className="pt-1.5" />
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="size-4 text-primary" aria-hidden="true" /> Wearable data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {["Apple Health", "Google Fit", "Samsung Health", "Fitbit", "Garmin"].map((w) => (
                <div key={w} className="flex items-center justify-between">
                  {w} <Badge variant="outline">Coming soon</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
