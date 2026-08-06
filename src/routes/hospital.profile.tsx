import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Save, Building2, Phone, MapPin, Building, ShieldPlus } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSession, signOut, type Session } from "@/services/auth.service";

export const Route = createFileRoute("/hospital/profile")({
  head: () => ({
    meta: [
      { title: "Hospital Profile — COHA AI" },
      { name: "description", content: "Manage your hospital profile, facilities, and contact details." },
    ],
  }),
  component: HospitalProfile,
});

function HospitalProfile() {
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
      toast.success("Hospital profile updated successfully");
    }, 1000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth" });
  };

  const initials = (session?.name ?? "Hospital")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8">
      <PageHeader title="Hospital Profile" description="Manage your organization's systemic details." />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Avatar & Account Settings */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="shadow-sm border-border">
            <CardHeader className="text-center pb-4">
              <Avatar className="mx-auto size-24 mb-4 ring-2 ring-primary/20 rounded-xl">
                <AvatarFallback className="text-2xl bg-accent text-accent-foreground rounded-xl">{initials}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{session?.name ?? "Loading..."}</CardTitle>
              <CardDescription>{session?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Account Role</Label>
                <Input value="Hospital Administrator" disabled className="bg-muted/50 font-medium text-primary" />
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

        {/* Right Column: Facility Details Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave}>
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="size-5 text-primary" />
                  Facility Settings
                </CardTitle>
                <CardDescription>
                  Update your hospital's contact information, headquarters, and core facilities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hosp-name">Organization Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input id="hosp-name" defaultValue={session?.name} className="pl-9" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hosp-phone">Main Contact Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input id="hosp-phone" defaultValue="+94 11 234 5678" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hosp-city">Headquarters / Main City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input id="hosp-city" defaultValue="Colombo" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hosp-facilities">Core Facilities (Comma separated)</Label>
                    <div className="relative">
                      <ShieldPlus className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input id="hosp-facilities" defaultValue="24/7 Emergency, Digital Imaging, Pharmacy, Laboratory" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="hosp-about">Organization Overview</Label>
                    <Textarea 
                      id="hosp-about" 
                      defaultValue="A leading multispecialty healthcare provider with advanced diagnostic facilities and a 24-hour trauma center."
                      className="min-h-[100px]" 
                    />
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
        </div>
      </div>
    </div>
  );
}
