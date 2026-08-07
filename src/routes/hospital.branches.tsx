import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, MoreHorizontal, Users, MapPin, Activity, Loader2, ArrowLeft, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { type Doctor, type Hospital } from "@/data/mock";
import { doctorService } from "@/services/doctor.service";
import { hospitalService } from "@/services/hospital.service";

export const Route = createFileRoute("/hospital/branches")({
  head: () => ({
    meta: [{ title: "Manage Branches — Hospital Portal" }],
  }),
  component: HospitalBranches,
});

type BranchData = {
  name: string;
  capacity: number;
};

function HospitalBranches() {
  // Load Doctors Roster from Supabase to cross-reference
  const [doctorRoster, setDoctorRoster] = useState<Doctor[]>([]);

  useEffect(() => {
    async function loadRoster() {
      const data = await doctorService.getAllDoctors();
      setDoctorRoster(data);
    }
    loadRoster();
  }, []);

  // Load Branches
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [h, setH] = useState<Hospital | null>(null);

  useEffect(() => {
    async function loadBranches() {
      try {
        const hospitalsData = await hospitalService.getAllHospitals();
        const mainHospital = hospitalsData[0];
        if (mainHospital) {
          setH(mainHospital as Hospital);
          if (mainHospital.branches) {
            // Initialize with 100% capacity mock data for each branch name
            setBranches(mainHospital.branches.map((b: string) => ({ name: b, capacity: 100 })));
          }
        }
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      }
    }
    loadBranches();
  }, []);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [manageBranch, setManageBranch] = useState<BranchData | null>(null);
  const [manageView, setManageView] = useState<"menu" | "capacity" | "roster">("menu");

  const handleAddBranch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const branchName = formData.get("branchName") as string;
    
    if (!branchName.trim()) {
      toast.error("Please enter a branch name");
      return;
    }
    
    setIsAdding(true);
    
    setTimeout(() => {
      setBranches([{ name: branchName, capacity: 100 }, ...branches]);
      setIsAdding(false);
      setIsAddOpen(false);
      toast.success("Branch successfully added to your facility list!");
    }, 1000);
  };

  const handleRemoveBranch = () => {
    if (!manageBranch) return;
    setBranches(branches.filter(b => b.name !== manageBranch.name));
    setManageBranch(null);
    toast.success(`${manageBranch.name} branch removed.`);
  };

  const updateCapacity = (newCap: number[]) => {
    if (!manageBranch) return;
    setManageBranch({ ...manageBranch, capacity: newCap[0]! });
    setBranches(branches.map(b => b.name === manageBranch.name ? { ...b, capacity: newCap[0]! } : b));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Facility Branches" description="Manage physical locations, departments, and capacity." />
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 size-4" /> Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>
                Create a new physical location for your hospital.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBranch} className="pt-4">
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="branch-name">Branch Location Name</Label>
                  <Input 
                    id="branch-name" 
                    name="branchName"
                    placeholder="e.g. Mount Lavinia" 
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Branch"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Manage Operations Dialog */}
      <Dialog 
        open={!!manageBranch} 
        onOpenChange={(open) => {
          if (!open) {
            setManageBranch(null);
            setTimeout(() => setManageView("menu"), 300);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          {manageView === "menu" && (
            <>
              <DialogHeader>
                <DialogTitle>Manage Operations: {manageBranch?.name}</DialogTitle>
                <DialogDescription>
                  Adjust capacities, assign staff, or remove this facility.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => setManageView("roster")}>
                  <Users className="mr-2 size-4" /> Manage Shift Roster
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setManageView("capacity")}>
                  <Activity className="mr-2 size-4" /> Adjust Branch Capacity
                </Button>
              </div>
              <DialogFooter className="sm:justify-between border-t pt-4">
                <Button variant="destructive" onClick={handleRemoveBranch}>
                  Remove Branch
                </Button>
                <Button variant="secondary" onClick={() => setManageBranch(null)}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}

          {manageView === "capacity" && manageBranch && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="-ml-2 size-8 text-muted-foreground" onClick={() => setManageView("menu")}>
                    <ArrowLeft className="size-4" />
                  </Button>
                  <DialogTitle>Capacity: {manageBranch.name}</DialogTitle>
                </div>
                <DialogDescription className="pl-10">
                  Slide to adjust the maximum operational capacity for this facility.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-8 py-8 px-2">
                <div className="flex items-center justify-between">
                  <Label>Operational Capacity</Label>
                  <span className="font-mono font-medium">{manageBranch.capacity}%</span>
                </div>
                <Slider 
                  value={[manageBranch.capacity]} 
                  onValueChange={updateCapacity} 
                  max={100} 
                  step={1} 
                />
              </div>
              <DialogFooter>
                <Button onClick={() => setManageView("menu")}>Save Adjustments</Button>
              </DialogFooter>
            </>
          )}

          {manageView === "roster" && manageBranch && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="-ml-2 size-8 text-muted-foreground" onClick={() => setManageView("menu")}>
                    <ArrowLeft className="size-4" />
                  </Button>
                  <DialogTitle>Roster: {manageBranch.name}</DialogTitle>
                </div>
                <DialogDescription className="pl-10">
                  Doctors currently assigned to this branch.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[300px] overflow-y-auto pr-2">
                {doctorRoster.filter((d: any) => d.branch === manageBranch.name).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No doctors assigned to this branch.</p>
                ) : (
                  doctorRoster.filter((d: any) => d.branch === manageBranch.name).map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <UserRound className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-[10px] text-muted-foreground">{doc.specialty}</p>
                        </div>
                      </div>
                      <Badge variant={doc.online ? "default" : "secondary"} className="text-[10px]">
                        {doc.online ? "Active" : "Offline"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch, i) => (
          <Card key={branch.name + i} className="shadow-sm border-border flex flex-col hover:border-primary/30 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="size-4 text-primary" />
                    {branch.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <MapPin className="size-3" /> {h?.city} Region
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="-mt-2 -mr-2 text-muted-foreground">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 p-3 rounded-lg bg-muted/40 border border-border">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="size-3" /> Doctors
                  </div>
                  <div className="text-lg font-semibold">
                    {doctorRoster.filter((d: any) => d.branch === branch.name).length}
                  </div>
                </div>
                <div className="space-y-1 p-3 rounded-lg bg-muted/40 border border-border">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Activity className="size-3" /> Capacity
                  </div>
                  <div className="text-lg font-semibold">{branch.capacity}%</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Key Departments</div>
                <div className="flex flex-wrap gap-1.5">
                  {h?.departments?.slice(0, 3 - (i % 2)).map((d: string) => (
                    <Badge key={d} variant="secondary" className="text-[10px] px-2 py-0 h-5">
                      {d}
                    </Badge>
                  ))}
                  {h?.departments && h.departments.length > 3 && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-dashed">
                      +{h.departments.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

            </CardContent>
            <CardFooter className="pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setManageBranch(branch)}>
                Manage Operations
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
