import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientProfile } from "@/data/mock";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({
    meta: [
      { title: "My health profile — COHA AI" },
      {
        name: "description",
        content: "Personal details, medical history, medications, allergies and family history.",
      },
      { property: "og:title", content: "My health profile — COHA AI" },
      { property: "og:description", content: "Your digital health record in one place." },
    ],
  }),
  component: ProfilePage,
});

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((i) => (
          <p key={i} className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
            {i}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

function ProfilePage() {
  const p = patientProfile;
  return (
    <div className="space-y-6">
      <PageHeader title="Health profile" description="Keep this current so recommendations stay accurate." />
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Personal information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-5 sm:grid-cols-3">
            {[
              ["Name", p.name],
              ["Age", `${p.age}`],
              ["Gender", p.gender],
              ["Blood group", p.bloodGroup],
              ["City", p.city],
              ["Phone", p.phone],
              ["Email", p.email],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <List title="Past diseases" items={p.pastDiseases} />
        <List title="Current medications" items={p.medications} />
        <List title="Allergies" items={p.allergies} />
        <List title="Family history" items={p.familyHistory} />
      </div>
      <Badge variant="secondary">Records are shared only with clinicians you book with</Badge>
    </div>
  );
}
