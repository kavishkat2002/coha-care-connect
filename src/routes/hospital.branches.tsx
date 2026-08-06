import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, MoreHorizontal, Users, MapPin, Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { hospitals } from "@/data/mock";

export const Route = createFileRoute("/hospital/branches")({
  head: () => ({
    meta: [{ title: "Manage Branches — Hospital Portal" }],
  }),
  component: HospitalBranches,
});

function HospitalBranches() {
  const h = hospitals[0]!;
  
  const [branches, setBranches] = useState<string[]>(() => {
    const saved = localStorage.getItem("mock_hospital_branches");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return h.branches;
      }
    }
    return h.branches;
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [manageBranch, setManageBranch] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("mock_hospital_branches", JSON.stringify(branches));
  }, [branches]);

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
      setBranches([branchName, ...branches]);
      setIsAdding(false);
      setIsAddOpen(false);
      toast.success("Branch successfully added to your facility list!");
    }, 1000);
  };

  const handleRemoveBranch = () => {
    if (!manageBranch) return;
    setBranches(branches.filter(b => b !== manageBranch));
    setManageBranch(null);
    toast.success(`${manageBranch} branch removed.`);
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
      <Dialog open={!!manageBranch} onOpenChange={(open) => !open && setManageBranch(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Operations: {manageBranch}</DialogTitle>
            <DialogDescription>
              Adjust capacities, assign staff, or remove this facility.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button variant="outline" className="w-full justify-start" onClick={() => toast("Redirecting to Staff Scheduler...")}>
              <Users className="mr-2 size-4" /> Manage Shift Roster
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast("Redirecting to Capacity Manager...")}>
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
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch, i) => (
          <Card key={branch + i} className="shadow-sm border-border flex flex-col hover:border-primary/30 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="size-4 text-primary" />
                    {branch}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <MapPin className="size-3" /> {h.city} Region
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
                  <div className="text-lg font-semibold">{12 + (i % 4) * 4}</div>
                </div>
                <div className="space-y-1 p-3 rounded-lg bg-muted/40 border border-border">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Activity className="size-3" /> Capacity
                  </div>
                  <div className="text-lg font-semibold">{80 - (i % 4) * 10}%</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Key Departments</div>
                <div className="flex flex-wrap gap-1.5">
                  {h.departments.slice(0, 3 - (i % 2)).map(d => (
                    <Badge key={d} variant="secondary" className="text-[10px] px-2 py-0 h-5">
                      {d}
                    </Badge>
                  ))}
                  {h.departments.length > 3 && (
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
