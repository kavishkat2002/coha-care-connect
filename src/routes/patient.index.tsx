import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Bot,
  CalendarCheck,
  FileText,
  Image as ImageIcon,
  Upload,
  Stethoscope,
  Pill,
  ClipboardList,
  AlertTriangle
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
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
import { supabase } from "@/lib/supabase";

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

function getDynamicHealthInsights(
  profile: PatientProfile | null, 
  reports: ReportItem[], 
  timeline: TimelineItem[]
): string[] {
  const insights: string[] = [];

  if (profile) {
    // 1. Allergies alert
    if (profile.allergies && profile.allergies.length > 0) {
      insights.push(`Allergy warning active: ${profile.allergies.join(", ")} — inform attending clinicians before new prescriptions.`);
    }

    // 2. Past diseases alert
    if (profile.pastDiseases && profile.pastDiseases.length > 0) {
      const diseaseStr = profile.pastDiseases.slice(0, 2).join(" & ");
      insights.push(`Medical history noted (${diseaseStr}) — periodic routine checkups recommended to monitor stability.`);
    }

    // 3. Active medications alert
    if (profile.medications && profile.medications.length > 0) {
      insights.push(`Active prescribed medications: ${profile.medications.slice(0, 2).join(", ")} — adhere to prescribed dosage schedule.`);
    }

    // 4. Family history risk alert
    if (profile.familyHistory && profile.familyHistory.length > 0) {
      insights.push(`Family history noted: ${profile.familyHistory.join("; ")} — consider specialized preventive screening.`);
    }

    // 5. Senior health screening alert
    if (profile.age && profile.age >= 60) {
      insights.push(`Senior health profile (${profile.age} yrs): Annual comprehensive geriatric & cardiovascular screening recommended.`);
    }
  }

  // 6. Timeline-specific insights
  if (timeline && timeline.length > 0) {
    // Check if there is an image analysis or mole review in the timeline
    const imageReviews = timeline.filter(t => t.kind === "image");
    if (imageReviews.length > 0) {
      const latestImage = imageReviews[0]!;
      insights.push(`Skin / Lesion Screening Log: ${latestImage.title} (${latestImage.detail}) — review with clinical dermatologist if changes persist.`);
    }

    // Check if there is a preventative health insight generated
    const insightEvents = timeline.filter(t => t.kind === "insight");
    if (insightEvents.length > 0) {
      const latestInsight = insightEvents[0]!;
      insights.push(`Wellness Recommendation: ${latestInsight.detail}`);
    }

    // Check if there are active prescriptions
    const prescriptions = timeline.filter(t => t.kind === "prescription");
    if (prescriptions.length > 0) {
      const latestPresc = prescriptions[0]!;
      insights.push(`Prescription management: ${latestPresc.title} (${latestPresc.detail}) — complete the designated treatment course.`);
    }
  }

  // 7. Report Flagged alert
  const flaggedReport = reports.find((r) => (r.flagged || 0) > 0);
  if (flaggedReport) {
    insights.push(`Recent report alert: "${flaggedReport.title}" contains ${flaggedReport.flagged} flagged parameter(s) needing physician review.`);
  }

  if (insights.length === 0) {
    insights.push("Annual routine wellness checkup is due — keep your health record up to date.");
    insights.push("Maintain hydration and daily physical activity for optimal health maintenance.");
  }

  // Deduplicate and slice the top 4
  const uniqueInsights = Array.from(new Set(insights));
  return uniqueInsights.slice(0, 4);
}

function PatientOverview() {
  const [appointments, setAppointments] = useState<DbAppointment[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  const [reportsAnalysedCount, setReportsAnalysedCount] = useState(0);
  const [chatMessagesCount, setChatMessagesCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [alertsHint, setAlertsHint] = useState("");
  const [alertLink, setAlertLink] = useState("/patient/reports");

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

      if (profile && profile.id) {
        // Automatically sync the local data to Supabase in the background
        void patientService.syncLocalDataToSupabase(profile.id);
      }

      // --- Real Data Analytics from AI Collaboration & Profile ---
      let chatCount = 0;
      let attachmentsCount = 0;
      const savedMessages = localStorage.getItem("meddoc_messages");
      if (savedMessages) {
        try {
          const messages = JSON.parse(savedMessages);
          if (Array.isArray(messages)) {
            chatCount = messages.length;
            attachmentsCount = messages.filter((m: any) => m.attachment || m.imageBase64).length;
          }
        } catch (e) {}
      }
      setReportsAnalysedCount(rpts.length + attachmentsCount);
      setChatMessagesCount(chatCount);

      // Calculate Critical Alerts / Attention Required
      let totalAlerts = 0;
      let hint = "No immediate action needed";
      let alertLinkUrl = "/patient/reports";
      
      if (profile) {
        const flaggedCount = rpts.reduce((sum, r) => sum + (r.flagged || 0), 0);
        totalAlerts += flaggedCount;
        if (flaggedCount > 0) {
          hint = "Review flagged values in reports";
          const flaggedReport = rpts.find(r => (r.flagged || 0) > 0);
          if (flaggedReport) {
            alertLinkUrl = `/patient/reports?reportId=${flaggedReport.id}`;
          }
        }
      }

      const savedAssessment = localStorage.getItem("meddoc_assessment");
      if (savedAssessment) {
        try {
          const assessment = JSON.parse(savedAssessment);
          if (assessment.risk === "moderate") {
            totalAlerts += 1;
            hint = "Moderate risk assessment detected";
          } else if (assessment.risk === "elevated") {
            totalAlerts += 1;
            hint = "High risk assessment detected - action required";
          }
        } catch (e) {}
      }
      
      setAlertsCount(totalAlerts);
      setAlertsHint(hint);
      setAlertLink(alertLinkUrl);
    }
    void loadData();

    // Listen for live profile & database updates
    const channel = typeof window !== "undefined" && "BroadcastChannel" in window 
      ? new BroadcastChannel("coha_profile_sync") 
      : null;

    if (channel) {
      channel.onmessage = () => {
        void loadData();
      };
    }

    const realtimeSub = supabase
      .channel('dashboard_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patient_profiles' }, () => {
        void loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        void loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        void loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'timeline' }, () => {
        void loadData();
      })
      .subscribe();

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === "coha_patient_profile_shared" || 
        e.key === "mock_appointments" || 
        e.key === "mock_reports" || 
        e.key === "mock_timeline" ||
        e.key === "meddoc_messages" ||
        e.key === "meddoc_assessment"
      ) {
        void loadData();
      }
    };
    window.addEventListener("storage", handleStorage);

    // Background polling every 3 seconds to sync dashboard stats across browsers & devices
    const pollInterval = setInterval(() => {
      void loadData();
    }, 3000);

    return () => {
      channel?.close();
      supabase.removeChannel(realtimeSub);
      window.removeEventListener("storage", handleStorage);
      clearInterval(pollInterval);
    };
  }, []);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const upcoming = appointments
    .filter((a) => {
      if (a.status === "Completed" || a.status === "Cancelled") return false;
      const apptTime = new Date(a.date).getTime();
      return isNaN(apptTime) || apptTime >= todayStart.getTime();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextVisitHint = upcoming[0]?.date ? `Next: ${upcoming[0].date}` : "No upcoming visits";

  const { derivedTrends, recentActivities } = useMemo(() => {
    if (!patientProfile) return { derivedTrends: [], recentActivities: [] };
    const list: Array<{ label: string; value: string; colorClass: string; description: string; to: string }> = [];

    // 1. Determine Haematology & Iron levels
    const hasAnaemia = patientProfile?.pastDiseases?.some((d: string) => d.toLowerCase().includes("iron") || d.toLowerCase().includes("anaemia")) || false;
    const takingFerrous = patientProfile?.medications?.some((m: string) => m.toLowerCase().includes("ferrous") || m.toLowerCase().includes("iron")) || false;
    
    const bloodReps = reports.filter(r => r.type?.toLowerCase().includes("blood") || r.title?.toLowerCase().includes("fbc") || r.title?.toLowerCase().includes("blood"));
    
    let ironValue = "Stable & Optimal";
    let ironDesc = "Haematology parameters are within normal reference ranges.";

    if (bloodReps.length > 0) {
      const latestBlood = bloodReps[0];
      if (latestBlood) {
        const hasAbnormal = latestBlood.status === "Analysed" && (latestBlood.summary?.toLowerCase().includes("abnormal") || latestBlood.summary?.toLowerCase().includes("flagged") || latestBlood.summary?.toLowerCase().includes("low"));
        if (hasAbnormal) {
          ironValue = "Attention Required";
          ironDesc = "Out of range blood counts detected in recent reports.";
        }
      }
    } else if (hasAnaemia || takingFerrous) {
      ironValue = "Managed (Ferrous)";
      ironDesc = "Anaemia history actively managed via daily supplements.";
    }
    list.push({ 
      label: "Haematology & Iron levels", 
      value: ironValue, 
      colorClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50", 
      description: ironDesc, 
      to: "/patient/reports" 
    });

    // 2. Determine Skin Reviews status
    const skinAssessments = timeline.filter(t => t.title?.toLowerCase().includes("skin") || t.title?.toLowerCase().includes("mole") || t.title?.toLowerCase().includes("dermatology") || t.title?.toLowerCase().includes("image"));
    
    let skinValue = "Due";
    let skinDesc = "Annual routine dermatologist review is recommended.";

    if (skinAssessments.length > 0) {
      const latestSkin = skinAssessments[0];
      if (latestSkin) {
        if (latestSkin.title.toLowerCase().includes("completed") || latestSkin.title.toLowerCase().includes("analysed")) {
          skinValue = "Reviewed";
          skinDesc = "Consultation recently completed.";
        } else {
          skinValue = "Follow-up Advised";
          skinDesc = latestSkin.detail || "Recommended to re-review changes.";
        }
      }
    }
    list.push({ 
      label: "Dermatological Reviews", 
      value: skinValue, 
      colorClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50", 
      description: skinDesc, 
      to: "/patient/images" 
    });

    // 3. Determine Consultation frequency
    let consultValue = "Stable";
    let consultDesc = "Regular clinical checkups are up to date.";

    if (appointments.length > 3) {
      consultValue = "Frequent Visits";
      consultDesc = "Multiple consult bookings recorded in the last 30 days.";
    } else if (appointments.length === 0) {
      consultValue = "No Bookings";
      consultDesc = "No upcoming or past clinical bookings found.";
    }
    list.push({ 
      label: "Consultation Frequency", 
      value: consultValue, 
      colorClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50", 
      description: consultDesc, 
      to: "/patient/appointments" 
    });

    // Generate Recent Health Activity dynamically
    const activities: Array<{
      id: string;
      icon: string;
      type: string;
      details: string;
      status: string;
      statusVariant: "default" | "secondary" | "outline" | "destructive";
      statusClass?: string;
      dateMs: number;
    }> = [];

    reports.forEach((r) => {
      activities.push({
        id: `report-${r.id}`,
        icon: "file",
        type: "Medical report",
        details: `${r.type || r.title} · ${r.date}`,
        status: r.status,
        statusVariant: r.status === "Analysed" ? "secondary" : "outline",
        dateMs: new Date(r.date).getTime()
      });
    });

    appointments.forEach((a) => {
      if (a.status === "Completed") {
        activities.push({
          id: `appt-${a.id}`,
          icon: "stethoscope",
          type: "Consultation",
          details: `Visit · ${a.date}`,
          status: "Completed",
          statusVariant: "outline",
          dateMs: new Date(a.date).getTime()
        });
      }
    });

    timeline.forEach((t) => {
      if (t.kind === "prescription") {
        activities.push({
          id: `timeline-${t.id}`,
          icon: "pill",
          type: "Medication update",
          details: `${t.title} · ${t.date}`,
          status: "Updated",
          statusVariant: "outline",
          statusClass: "text-teal-600 border-teal-200 bg-teal-50 dark:bg-teal-950/30",
          dateMs: new Date(t.date).getTime()
        });
      } else if (t.kind === "insight" || t.kind === "image") {
        activities.push({
          id: `timeline-${t.id}`,
          icon: "clipboard",
          type: "Health record",
          details: `${t.title} · ${t.date}`,
          status: "Updated",
          statusVariant: "outline",
          statusClass: "text-teal-600 border-teal-200 bg-teal-50 dark:bg-teal-950/30",
          dateMs: new Date(t.date).getTime()
        });
      }
    });

    const sortedActivities = activities.sort((a, b) => {
      if (isNaN(a.dateMs) && isNaN(b.dateMs)) return 0;
      if (isNaN(a.dateMs)) return 1;
      if (isNaN(b.dateMs)) return -1;
      return b.dateMs - a.dateMs;
    }).slice(0, 5);

    return { derivedTrends: list, recentActivities: sortedActivities };
  }, [timeline, reports, appointments, patientProfile]);

  if (!patientProfile) {
    return <LoadingScreen message="Loading dashboard..." fullscreen={false} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={`Good day, ${patientProfile.name.split(" ")[0]}`}
        description="Here is your current health picture and what needs attention next."
      />

      <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <Link to={alertLink} className={alertsCount > 0 ? "block transition-transform hover:scale-[1.02] active:scale-[0.98]" : "block"}>
          <StatCard 
            icon={alertsCount > 0 ? AlertTriangle : Activity} 
            label="Attention Required" 
            value={String(alertsCount)} 
            hint={alertsHint} 
            className="cursor-pointer"
            iconClassName={alertsCount > 0 ? "text-rose-600 dark:text-rose-300" : undefined}
            valueClassName={alertsCount > 0 ? "text-rose-600 dark:text-rose-400" : undefined}
            labelClassName={alertsCount > 0 ? "text-rose-600 font-medium dark:text-rose-400" : undefined}
          />
        </Link>
        <StatCard icon={CalendarCheck} label="Upcoming visits" value={String(upcoming.length)} hint={nextVisitHint} />
        <StatCard icon={FileText} label="Reports analysed" value={String(reportsAnalysedCount)} hint={`${reports.reduce((sum, r) => sum + (r.flagged || 0), 0)} flagged value(s)`} />
        <StatCard icon={Bot} label="AI Interactions" value={String(chatMessagesCount)} hint="Recent collaborations" />
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
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc ? doc.name : a.doctor_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc ? doc.specialty : "General"} · {hosp ? hosp.name : a.hospital_id}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
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
          <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-1">
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
            {reports.slice(0, 2).map((r) => (
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

        <Card className="shadow-soft rounded-[24px] flex-1">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-extrabold text-foreground">Recent Health Activity</CardTitle>
            <CardDescription className="text-xs">Your latest reports, consultations and health records</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {recentActivities.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentActivities.map((act) => {
                  let Icon = FileText;
                  let iconBg = "bg-blue-500/10 text-blue-600 dark:text-blue-400";
                  
                  if (act.icon === "stethoscope") {
                    Icon = Stethoscope;
                    iconBg = "bg-purple-500/10 text-purple-600 dark:text-purple-400";
                  } else if (act.icon === "pill") {
                    Icon = Pill;
                    iconBg = "bg-rose-500/10 text-rose-600 dark:text-rose-400";
                  } else if (act.icon === "clipboard") {
                    Icon = ClipboardList;
                    iconBg = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
                  }

                  return (
                    <div 
                      key={act.id} 
                      className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-muted/20 p-3 hover:bg-muted/40 hover:shadow-sm transition-all"
                    >
                      <div className={`flex items-center justify-center size-10 rounded-xl shrink-0 ${iconBg}`}>
                        <Icon className="size-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{act.type}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{act.details}</p>
                      </div>
                      <Badge variant={act.statusVariant} className={`shrink-0 ${act.statusClass || ''}`}>
                        {act.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm border border-dashed rounded-xl border-border/40">
                No recent activity found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
