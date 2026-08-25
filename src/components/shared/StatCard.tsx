import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  className,
  iconClassName,
  valueClassName,
  labelClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  className?: string | undefined;
  iconClassName?: string | undefined;
  valueClassName?: string | undefined;
  labelClassName?: string | undefined;
}) {
  return (
    <Card className={`shadow-soft ${className || ""}`}>
      <CardContent className="flex items-start gap-3 p-4 sm:p-5">
        <span className={`flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground ${iconClassName || ""}`}>
          <Icon className="size-4 sm:size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className={`text-xs sm:text-sm text-muted-foreground ${labelClassName || ""}`}>{label}</p>
          <p className={`mt-0.5 truncate text-xl sm:text-2xl font-semibold ${valueClassName || ""}`}>{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
