import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Stethoscope, Mail, MoreHorizontal, Link as LinkIcon, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { doctors as initialDoctors } from "@/data/mock";
import { adminCreateAccount } from "@/services/auth.service";

export const Route = createFileRoute("/hospital/doctors")({
  head: () => ({
    meta: [{ title: "Manage Doctors — Hospital Portal" }],
  }),
  component: HospitalDoctors,
});

function HospitalDoctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roster, setRoster] = useState(initialDoctors);
  
  // Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  
  // Create New Doctor State
  const [isCreating, setIsCreating] = useState(false);

  const filteredDoctors = roster.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLinkDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const linkId = formData.get("linkId") as string;
    const linkName = formData.get("linkName") as string;
    const linkSpecialty = formData.get("linkSpecialty") as string;

    if (!linkId.trim()) {
      toast.error("Please enter a Doctor ID");
      return;
    }
    
    setIsLinking(true);
    
    // Simulate API verification delay
    setTimeout(() => {
      const initials = (linkName || "Doctor").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
      const newDoctor = {
        id: linkId,
        name: linkName || "Linked Doctor", 
        specialty: linkSpecialty || "General Medicine",
        hospital: "Lakeside General Hospital",
        branch: "Colombo 07",
        rating: 0,
        reviews: 0,
        fee: 2000,
        about: "Newly linked physician.",
        languages: ["English"],
        photoInitials: initials,
        online: true,
      };
      
      setRoster([newDoctor, ...roster]);
      setIsLinking(false);
      setIsAddOpen(false);
      toast.success("Doctor successfully linked to your hospital roster!");
    }, 1500);
  };

  const handleCreateDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const specialty = formData.get("specialty") as string;
    
    try {
      // Actually provision the doctor in Supabase Auth
      await adminCreateAccount(email, password, "doctor", name);
      
      // Add to local UI roster
      const initials = name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
      const newDoctor = {
        id: `DOC-${Math.floor(Math.random() * 90000) + 10000}`,
        name,
        specialty,
        hospital: "Lakeside General Hospital", // Mock current hospital context
        branch: "Main Branch",
        rating: 0,
        reviews: 0,
        fee: 2500,
        about: "Newly provisioned physician.",
        languages: ["English"],
        photoInitials: initials,
        online: false,
      };
      
      setRoster([newDoctor, ...roster]);
      setIsAddOpen(false);
      toast.success(`Account created for ${name} and added to roster.`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create doctor account");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Manage Doctors" description="View and assign medical staff to your branches." />
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 size-4" /> Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[475px]">
            <DialogHeader>
              <DialogTitle>Add Doctor to Roster</DialogTitle>
              <DialogDescription>
                Link an existing doctor or provision a new account.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="link" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Link Existing</TabsTrigger>
                <TabsTrigger value="create">Create New Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="link" className="pt-4">
                <form onSubmit={handleLinkDoctor}>
                  <div className="space-y-4 mb-6">
                    <p className="text-sm text-muted-foreground">
                      Enter the Registration ID of a doctor who is already registered on the platform.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="doc-id">Doctor Registration ID</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input 
                          id="doc-id" 
                          name="linkId"
                          placeholder="e.g. DOC-98421" 
                          className="pl-9" 
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-name">Confirm Doctor Name</Label>
                      <Input 
                        id="doc-name" 
                        name="linkName"
                        placeholder="e.g. Dr. Sandun Perera" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-spec">Doctor Specialty</Label>
                      <Input 
                        id="doc-spec" 
                        name="linkSpecialty"
                        placeholder="e.g. General Medicine" 
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLinking}>
                      {isLinking ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Link Doctor"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>

              <TabsContent value="create" className="pt-4">
                <form onSubmit={handleCreateDoctor}>
                  <div className="space-y-4 mb-6">
                    <p className="text-sm text-muted-foreground">
                      Provision a new Doctor account. They will receive an email to access the platform.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="new-name">Full Name</Label>
                        <Input id="new-name" name="name" placeholder="Dr. Jane Doe" required />
                      </div>
                      
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="new-email">Email Address</Label>
                        <Input id="new-email" name="email" type="email" placeholder="jane.doe@example.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">Temporary Password</Label>
                        <Input id="new-password" name="password" type="password" placeholder="••••••••" minLength={6} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-specialty">Specialty</Label>
                        <Input id="new-specialty" name="specialty" placeholder="Cardiology" required />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Provisioning...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 size-4" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Medical Staff Roster</CardTitle>
              <CardDescription>All doctors currently affiliated with your organization.</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or specialty..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden md:table-cell">Specialty</TableHead>
                <TableHead className="hidden sm:table-cell">Primary Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 hidden sm:flex">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {doc.photoInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{doc.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{doc.specialty}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="size-3.5" />
                      {doc.specialty}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {doc.branch}
                  </TableCell>
                  <TableCell>
                    {doc.online ? (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Offline
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDoctors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No doctors found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
