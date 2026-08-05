import { Activity } from "lucide-react";

export function Logo({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Activity className="size-5" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-semibold tracking-tight">COHA AI</span>
        {subtitle ? (
          <span className="block text-[11px] text-muted-foreground">Intelligent Healthcare</span>
        ) : null}
      </span>
    </span>
  );
}
