import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Save, Stethoscope, Building2, UserRound, Banknote, Languages, BookOpen } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSession, signOut, type Session } from "@/services/auth.service";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/doctor/profile")({
  head: () => ({
    meta: [
      { title: "Doctor Profile — MedDoc" },
      { name: "description", content: "Manage your professional doctor profile and settings." },
    ],
  }),
  component: DoctorProfile,
});

function DoctorProfile() {
  const [session, setSession] = useState<Session | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth" });
  };

  const initials = (session?.name ?? "Doctor")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8">
      <PageHeader title="Doctor Profile" description="Manage your professional details and system scope." />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Avatar & Account Settings */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="shadow-sm border-border">
            <CardHeader className="text-center pb-4">
              <Avatar className="mx-auto size-24 mb-4 ring-2 ring-primary/20">
                <AvatarFallback className="text-2xl bg-accent text-accent-foreground">{initials}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{session?.name ?? "Loading..."}</CardTitle>
              <CardDescription>{session?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Account Role</Label>
                <Input value="Doctor" disabled className="bg-muted/50 font-medium text-primary" />
              </div>
              <div className="space-y-2">
                <Label>Registration ID</Label>
                <div className="relative">
                  <Input 
                    value={session?.registration_id || `DOC-${session?.id?.substring(0, 6).toUpperCase() || 'UNKNOWN'}`} 
                    disabled 
                    className="bg-muted/50 font-mono text-sm tracking-wide text-foreground pr-10" 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      const id = session?.registration_id || `DOC-${session?.id?.substring(0, 6).toUpperCase() || 'UNKNOWN'}`;
                      navigator.clipboard.writeText(id);
                      toast.success("Registration ID copied to clipboard!");
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Share this ID with hospitals to link your profile.</p>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleSignOut}>
                <LogOut className="mr-2 size-4" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Professional Details Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave}>
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="size-5 text-primary" />
                  Professional Settings
                </CardTitle>
                <CardDescription>
                  Update your clinical specialties, hospital affiliations, and consultation details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="prof-name">Full Name (Public Display)</Label>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input id="prof-name" defaultValue={session?.name} className="pl-9" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prof-specialty">Specialty</Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input id="prof-specialty" defaultValue="General Medicine" className="pl-9" />
                    </div>
                  </div>

                  {(() => {
                    // Look up the doctor's real-time hospital and branch from the global roster
                    const savedRoster = localStorage.getItem("mock_hospital_roster");
                    let rosterDetails: any = null;
                    if (savedRoster && session) {
                      try {
                        const roster = JSON.parse(savedRoster);
                        const id = session.registration_id || `DOC-${session.id.substring(0, 6).toUpperCase()}`;
                        rosterDetails = roster.find((d: any) => d.id === id || d.name === session.name);
                      } catch (e) {}
                    }
                    
                    return (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="prof-hospital">Affiliated Hospital</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <Input 
                              id="prof-hospital" 
                              value={rosterDetails?.hospital || "Not Affiliated"} 
                              disabled
                              className="pl-9 bg-muted/50" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="prof-branch">Assigned Branch</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <Input 
                              id="prof-branch" 
                              value={rosterDetails?.branch || "N/A"} 
                              disabled
                              className="pl-9 bg-muted/50" 
                            />
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <div className="space-y-2">
                    <Label htmlFor="prof-fee">Consultation Fee (LKR)</Label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input id="prof-fee" type="number" defaultValue="2500" className="pl-9" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="prof-languages">Languages Spoken</Label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input id="prof-languages" defaultValue="English, Sinhala" className="pl-9" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Separate multiple languages with commas.</p>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="prof-about">About / Biography</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Textarea 
                        id="prof-about" 
                        defaultValue="Primary care physician coordinating referrals and preventive health reviews."
                        className="min-h-[100px] pl-9 pt-2.5" 
                      />
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-muted/30 pt-6 border-t border-border">
                <Button type="submit" disabled={isSaving} className="ml-auto">
                  {isSaving ? "Saving changes..." : (
                    <>
                      <Save className="mr-2 size-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>

          {/* Availability Scheduling Card */}
          <Card className="mt-8 shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                Availability Schedule
              </CardTitle>
              <CardDescription>
                Set your availability for specific dates. Hospitals will see this status for your assigned branch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                {(() => {
                  const today = new Date().toISOString().split('T')[0] as string;
                  const [date, setDate] = useState<string>(today);
                  const [status, setStatus] = useState<boolean>(true);

                  useEffect(() => {
                    const savedRoster = localStorage.getItem("mock_hospital_roster");
                    if (savedRoster && session) {
                      try {
                        const roster = JSON.parse(savedRoster);
                        const id = session.registration_id || `DOC-${session.id.substring(0, 6).toUpperCase()}`;
                        const doc = roster.find((d: any) => d.id === id || d.name === session.name);
                        
                        if (doc) {
                          // Check if specific date exists in availability map, else fallback to general 'online' status
                          const isAvailable = doc.availability && doc.availability[date] !== undefined 
                            ? doc.availability[date] 
                            : doc.online;
                          setStatus(isAvailable);
                        }
                      } catch (e) {}
                    }
                  }, [date, session]);

                  const handleUpdateStatus = (newStatus: boolean) => {
                    const savedRoster = localStorage.getItem("mock_hospital_roster");
                    if (savedRoster && session) {
                      try {
                        const roster = JSON.parse(savedRoster);
                        const id = session.registration_id || `DOC-${session.id.substring(0, 6).toUpperCase()}`;
                        const updatedRoster = roster.map((d: any) => {
                          if (d.id === id || d.name === session.name) {
                            return {
                              ...d,
                              availability: {
                                ...(d.availability || {}),
                                [date]: newStatus
                              }
                            };
                          }
                          return d;
                        });
                        
                        localStorage.setItem("mock_hospital_roster", JSON.stringify(updatedRoster));
                        setStatus(newStatus);
                        toast.success(`Marked as ${newStatus ? 'Available' : 'Offline'} for ${date}`);
                        
                        // Dispatch storage event to keep other tabs in sync if needed
                        window.dispatchEvent(new Event('storage'));
                      } catch (e) {}
                    }
                  };

                  return (
                    <>
                      <div className="space-y-2 w-full sm:w-auto flex-1">
                        <Label htmlFor="schedule-date">Select Date</Label>
                        <Input 
                          id="schedule-date" 
                          type="date" 
                          value={date} 
                          onChange={(e) => setDate(e.target.value)} 
                          min={today}
                        />
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                          type="button" 
                          variant={status ? "default" : "outline"} 
                          className={status ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => handleUpdateStatus(true)}
                        >
                          Available
                        </Button>
                        <Button 
                          type="button" 
                          variant={!status ? "destructive" : "outline"}
                          onClick={() => handleUpdateStatus(false)}
                        >
                          Offline
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
