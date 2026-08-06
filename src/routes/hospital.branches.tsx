import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, MoreHorizontal, Users, MapPin, Activity } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hospitals } from "@/data/mock";

export const Route = createFileRoute("/hospital/branches")({
  head: () => ({
    meta: [{ title: "Manage Branches — Hospital Portal" }],
  }),
  component: HospitalBranches,
});

function HospitalBranches() {
  const h = hospitals[0]!;

  const handleAddBranch = () => {
    toast.success("Branch creation wizard opened.");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Facility Branches" description="Manage physical locations, departments, and capacity." />
        <Button onClick={handleAddBranch} className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" /> Add Branch
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {h.branches.map((branch, i) => (
          <Card key={branch} className="shadow-sm border-border flex flex-col hover:border-primary/30 transition-colors">
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
                  <div className="text-lg font-semibold">{12 + i * 4}</div>
                </div>
                <div className="space-y-1 p-3 rounded-lg bg-muted/40 border border-border">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Activity className="size-3" /> Capacity
                  </div>
                  <div className="text-lg font-semibold">{80 - i * 10}%</div>
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
              <Button variant="outline" size="sm" className="w-full">
                Manage Operations
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
