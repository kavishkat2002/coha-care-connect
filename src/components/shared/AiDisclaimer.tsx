import { Info } from "lucide-react";
import { AI_DISCLAIMER } from "@/data/mock";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={
        "flex items-start gap-2 rounded-xl border border-border bg-muted/60 p-3 text-xs text-muted-foreground " +
        (className ?? "")
      }
    >
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span>{AI_DISCLAIMER}</span>
    </p>
  );
}
