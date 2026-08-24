import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Bot,
  CalendarCheck,
  FileText,
  Image as ImageIcon,
  Upload,
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

      // Calculate Dynamic Health Score from Profile & Assessment
      let score = 95;
      let hint = "Stable health record";
      if (profile) {
        const diseaseCount = profile.pastDiseases?.length || 0;
        const medsCount = profile.medications?.length || 0;
        const allergyCount = profile.allergies?.length || 0;
        const flaggedCount = rpts.reduce((sum, r) => sum + (r.flagged || 0), 0);

        score = Math.max(35, 96 - (diseaseCount * 6) - (medsCount * 2) - (allergyCount * 3) - (flaggedCount * 4));
        
        if (score >= 85) hint = "Excellent health profile";
        else if (score >= 70) hint = "Stable health record";
        else if (score >= 50) hint = "Needs periodic checkups";
        else hint = "Requires clinician review";
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
          } else {
            setHealthScore(score);
            setHealthHint(hint);
          }
        } catch (e) {
          setHealthScore(score);
          setHealthHint(hint);
        }
      } else {
        setHealthScore(score);
        setHealthHint(hint);
      }
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

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === "coha_patient_profile_shared" || 
        e.key === "mock_appointments" || 
        e.key === "mock_reports" || 
        e.key === "mock_timeline"
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

  const derivedTrends = useMemo(() => {
    if (!patientProfile) return [];
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

    return list;
  }, [timeline, reports, appointments, patientProfile]);

  if (!patientProfile) {
    return <LoadingScreen message="Loading dashboard..." fullscreen={false} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Good day, ${patientProfile.name.split(" ")[0]}`}
        description="Here is your current health picture and what needs attention next."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Activity} label="Health score" value={`${healthScore} / 100`} hint={healthHint} />
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

        <Card className="shadow-soft rounded-[24px]">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-extrabold text-foreground">Health trends</CardTitle>
            <CardDescription className="text-xs">Built dynamically from your health records & medical history</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 pt-4">
            {derivedTrends.map((row) => (
              <Link
                key={row.label}
                to={row.to}
                className="block space-y-1 pb-3.5 border-b border-border/40 last:border-0 last:pb-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 p-2 -mx-2 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-xs">{row.label}</span>
                  <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.colorClass}`}>
                    {row.value}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-normal">
                  {row.description}
                </p>
              </Link>
            ))}
            <AiDisclaimer className="pt-1.5" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
