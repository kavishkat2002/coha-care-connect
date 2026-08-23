import { createFileRoute } from "@tanstack/react-router";
import { Activity, CalendarCheck, FileText, Image as ImageIcon, Pill } from "lucide-react";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    async function load() {
      const data = await patientService.getTimeline();
      setTimeline(data);
    }
    load();
  }, []);

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
            <CardContent className="space-y-3 text-sm">
              {[
                { label: "Iron levels", value: "Improving" },
                { label: "Skin reviews", value: "Due" },
                { label: "Consultation frequency", value: "Stable" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{row.label}</span>
                  <Badge variant="secondary">{row.value}</Badge>
                </div>
              ))}
              <AiDisclaimer />
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
