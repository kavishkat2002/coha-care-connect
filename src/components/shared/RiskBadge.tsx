import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  low: "bg-success/10 text-success border-success/20",
  moderate: "bg-warning/15 text-warning-foreground border-warning/30",
  elevated: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RiskBadge({ level }: { level: "low" | "moderate" | "elevated" }) {
  return (
    <Badge variant="outline" className={cn("capitalize", styles[level])}>
      {level} risk indication
    </Badge>
  );
}
