import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientService, type PatientProfile } from "@/services/patient.service";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({
    meta: [
      { title: "My health profile — MedDoc" },
      {
        name: "description",
        content: "Personal details, medical history, medications, allergies and family history.",
      },
      { property: "og:title", content: "My health profile — MedDoc" },
      { property: "og:description", content: "Your digital health record in one place." },
    ],
  }),
  component: ProfilePage,
});

function List({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
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
  const [p, setP] = useState<PatientProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<PatientProfile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (isEditing) return;
      const data = await patientService.getPatientProfile();
      if (data) {
        setP(data);
        setEditData(data);
      }
    }
    void load();

    // Listen for live profile updates from other browser windows/tabs automatically
    const channel = typeof window !== "undefined" && "BroadcastChannel" in window 
      ? new BroadcastChannel("coha_profile_sync") 
      : null;

    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.profile && !isEditing) {
          setP(event.data.profile);
          setEditData(event.data.profile);
        }
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "coha_patient_profile_shared" && e.newValue && !isEditing) {
        try {
          const parsed = JSON.parse(e.newValue);
          setP(parsed);
          setEditData(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // Background polling every 3 seconds (only when not editing)
    const pollInterval = setInterval(() => {
      if (!isEditing) {
        void load();
      }
    }, 3000);

    return () => {
      channel?.close();
      window.removeEventListener("storage", handleStorage);
      clearInterval(pollInterval);
    };
  }, [isEditing]);

  const handleSave = async () => {
    if (!p) return;
    setSaving(true);
    try {
      const updated = { ...p, ...editData } as PatientProfile;
      setP(updated);
      setIsEditing(false);

      const result = await patientService.updatePatientProfile(updated);
      if (result) {
        setP(result);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (!p) {
    return <LoadingScreen message="Loading profile..." fullscreen={false} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Health profile" description="Keep this current so recommendations stay accurate." />
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Personal information</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="size-3.5 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={saving}>
                <X className="size-3.5 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="size-3.5 mr-2 animate-spin" /> : <Save className="size-3.5 mr-2" />}
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <dl className="grid gap-5 sm:grid-cols-3">
            {[
              { label: "Name", key: "name", type: "text" },
              { label: "Age", key: "age", type: "number" },
              { label: "Gender", key: "gender", type: "text" },
              { label: "Blood group", key: "bloodGroup", type: "text" },
              { label: "City", key: "city", type: "text" },
              { label: "Phone", key: "phone", type: "text" },
              { label: "Email", key: "email", type: "email" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <dt className="text-xs text-muted-foreground mb-1">{label}</dt>
                {isEditing ? (
                  <Input 
                    type={type}
                    value={editData[key as keyof PatientProfile] as string | number || ""}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      [key]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value 
                    })}
                    className="h-8 text-sm"
                  />
                ) : (
                  <dd className="text-sm font-medium">{p[key as keyof PatientProfile]}</dd>
                )}
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
