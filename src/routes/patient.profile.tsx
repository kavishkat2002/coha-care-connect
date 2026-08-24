import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientService, type PatientProfile } from "@/services/patient.service";
import { signOut } from "@/services/auth.service";
import { Pencil, Save, X, Loader2, Plus, Trash2, Paperclip, Upload, Check, LogOut } from "lucide-react";
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

function List({ 
  title, 
  items = [], 
  onUpdate 
}: { 
  title: string; 
  items: string[]; 
  onUpdate: (newItems: string[]) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onUpdate([...items, newItem.trim()]);
    setNewItem("");
    setIsAdding(false);
    toast.success(`Successfully added record to "${title}"`);
  };

  const handleDelete = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    onUpdate(updated);
    toast.success("Record removed from health profile");
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const cleanText = (items[index] || "").replace(/\s*\[Attached:\s*.*\]$/, "");
    const updatedItemText = `${cleanText} [Attached: ${file.name}]`;
    
    const updated = [...items];
    updated[index] = updatedItemText;
    onUpdate(updated);
    toast.success(`Document "${file.name}" uploaded successfully for this record!`);
  };

  const handleDownloadAttachment = (filename: string) => {
    const docContent = `MEDDOC HEALTH RECORD ATTACHMENT
-----------------------------------
File Reference: ${filename}
Category: ${title}
Verification Code: MD-ARC-${Math.random().toString(36).substring(7).toUpperCase()}

[MedDoc Certified Digital Health Record]
This document has been archived directly by the patient inside their personal medical profile.
`;

    const blob = new Blob([docContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Initiated download for health record document: ${filename}`);
  };

  return (
    <Card className="shadow-soft rounded-[24px]">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-extrabold text-foreground">{title}</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 px-2.5 text-[11px] gap-1 cursor-pointer" 
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? <X className="size-3" /> : <Plus className="size-3" />}
          {isAdding ? "Cancel" : "Add manually"}
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-3.5">
        {isAdding && (
          <div className="flex gap-2 pb-2">
            <Input
              placeholder={`Enter new ${title.toLowerCase()}...`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="h-8 text-xs flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button size="sm" className="h-8 text-xs font-bold gap-1 cursor-pointer" onClick={handleAdd}>
              <Check className="size-3" /> Add
            </Button>
          </div>
        )}

        {(!items || items.length === 0) ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">No records listed in this category.</p>
        ) : (
          <div className="space-y-3">
            {items.map((i, index) => {
              const attachmentMatch = i ? i.match(/(.*)\s*\[Attached:\s*(.*)\]$/) : null;
              const text = (attachmentMatch && attachmentMatch[1]) ? attachmentMatch[1].trim() : i;
              const attachment = (attachmentMatch && attachmentMatch[2]) ? attachmentMatch[2].trim() : null;

              return (
                <div key={index} className="p-3 border border-border/80 rounded-xl bg-muted/5 flex flex-col justify-between relative group/item hover:border-border transition-all">
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <span className="font-semibold text-foreground leading-relaxed">{text}</span>
                    <button 
                      onClick={() => handleDelete(index)}
                      className="text-muted-foreground hover:text-red-600 transition-colors shrink-0 cursor-pointer p-0.5"
                      title="Remove record"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  {attachment ? (
                    <div 
                      className="flex items-center gap-1.5 mt-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-500/20 cursor-pointer w-fit transition-all" 
                      onClick={() => handleDownloadAttachment(attachment)}
                    >
                      <Paperclip className="size-3 shrink-0" />
                      <span className="underline truncate max-w-[180px]">{attachment}</span>
                    </div>
                  ) : (
                    <label className="flex items-center gap-1 mt-2 text-[9px] font-semibold text-muted-foreground hover:text-primary cursor-pointer w-fit border border-dashed border-border px-2 py-0.5 rounded-md hover:bg-muted/10 transition-all">
                      <Upload className="size-2.5 shrink-0" />
                      <span>Upload Medical Doc</span>
                      <input type="file" className="hidden" onChange={(e) => handleFileChange(index, e)} />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const [p, setP] = useState<PatientProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<PatientProfile>>({});
  const [saving, setSaving] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully. Health profile cleared.");
    navigate({ to: "/auth" });
  };

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
        if (event.data?.type === "LOGOUT") {
          setP(null);
          setEditData({});
        } else if (event.data?.profile && !isEditing) {
          setP(event.data.profile);
          setEditData(event.data.profile);
        }
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "coha_patient_profile_shared" && !isEditing) {
        if (!e.newValue) {
          setP(null);
          setEditData({});
        } else {
          try {
            const parsed = JSON.parse(e.newValue);
            setP(parsed);
            setEditData(parsed);
          } catch (err) {}
        }
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const updated = { ...p, avatarUrl: base64 } as PatientProfile;
      setP(updated);
      setEditData((prev) => ({ ...prev, avatarUrl: base64 }));
      
      const result = await patientService.updatePatientProfile(updated);
      if (result) {
        toast.success("Profile photo uploaded and synced successfully!");
      } else {
        toast.error("Failed to sync profile photo");
      }
    };
    reader.readAsDataURL(file);
  };

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
        <CardContent className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar Upload / View Section */}
          <div className="flex flex-col items-center shrink-0 w-full md:w-44 p-4 border border-border/60 bg-muted/10 rounded-2xl">
            <div className="relative size-24 mb-3 rounded-full overflow-hidden border border-border group">
              <img 
                src={p.avatarUrl || (p.gender?.toLowerCase() === "female" 
                  ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                  : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                )}
                alt="Profile Avatar"
                className="size-full object-cover"
              />
              <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[9px] font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="size-4 mb-1" />
                Upload Photo
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
            <div className="mt-1 text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20 select-all cursor-pointer" title="Click to copy Patient ID">
              {p.patientId || "Generating ID..."}
            </div>
          </div>

          <dl className="grid gap-5 sm:grid-cols-3 flex-1 w-full pt-1">
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
        <List 
          title="Past diseases" 
          items={p.pastDiseases} 
          onUpdate={(newItems) => {
            const updated = { ...p, pastDiseases: newItems };
            setP(updated);
            void patientService.updatePatientProfile(updated);
          }} 
        />
        <List 
          title="Current medications" 
          items={p.medications} 
          onUpdate={(newItems) => {
            const updated = { ...p, medications: newItems };
            setP(updated);
            void patientService.updatePatientProfile(updated);
          }} 
        />
        <List 
          title="Allergies" 
          items={p.allergies} 
          onUpdate={(newItems) => {
            const updated = { ...p, allergies: newItems };
            setP(updated);
            void patientService.updatePatientProfile(updated);
          }} 
        />
        <List 
          title="Family history" 
          items={p.familyHistory} 
          onUpdate={(newItems) => {
            const updated = { ...p, familyHistory: newItems };
            setP(updated);
            void patientService.updatePatientProfile(updated);
          }} 
        />
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <Badge variant="secondary">Records are shared only with clinicians you book with</Badge>
      </div>

      {/* Account Sign Out / Privacy Card */}
      <Card className="shadow-soft border-destructive/20 bg-destructive/[0.02]">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
              <LogOut className="size-4 text-destructive" />
              Sign out of account
            </h4>
            <p className="text-xs text-muted-foreground">
              Sign out of your MedDoc profile. All cached health records and session data on this device will be cleared.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 cursor-pointer font-bold border-destructive/30" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
