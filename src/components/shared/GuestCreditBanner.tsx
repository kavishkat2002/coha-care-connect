import { Link } from "@tanstack/react-router";
import { LogIn, Award, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GuestCreditBannerProps {
  creditsLeft: number;
  totalGuest?: number;
  variant?: "warning" | "exhausted";
  feature?: string;
}

export function GuestCreditBanner({
  creditsLeft,
  totalGuest = 450,
  variant = creditsLeft <= 0 ? "exhausted" : "warning",
  feature = "AI analysis",
}: GuestCreditBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed && variant === "warning") return null;

  return (
    <div className={`relative rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${variant === "exhausted" ? "bg-stone-50 border-stone-200" : "bg-[#438787]/5 border-[#438787]/20"}`}>
      {variant === "warning" && (
        <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Dismiss">
          <X className="size-4" />
        </button>
      )}
      <div className={`shrink-0 p-3 rounded-xl ${variant === "exhausted" ? "bg-stone-100" : "bg-[#438787]/10"}`}>
        {variant === "exhausted" ? <Award className="size-6 text-stone-500" strokeWidth={1.5} /> : <Zap className="size-6 text-[#438787]" strokeWidth={1.5} />}
      </div>
      <div className="flex-1 min-w-0">
        {variant === "exhausted" ? (
          <>
            <p className="font-semibold text-slate-800 text-sm">Guest credits used up</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              You have used your <strong className="text-slate-700">{totalGuest} free guest credits</strong> for {feature}. Sign in or get a <strong className="text-slate-700">MedDoc ePass</strong> to unlock unlimited access. Silver, Gold and Platinum plans available.
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-slate-800 text-sm">{creditsLeft} guest credits remaining</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">You are using free guest credits for {feature}. Sign in or get a MedDoc ePass for unlimited access.</p>
          </>
        )}
      </div>
      <div className="flex gap-2 shrink-0 flex-col sm:flex-row w-full sm:w-auto">
        <Button asChild size="sm" className="bg-[#438787] hover:bg-[#346a6f] text-white text-xs h-9 px-4 rounded-lg font-semibold">
          <Link to="/auth"><LogIn className="size-3.5 mr-1.5" />Sign In</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-[#438787]/30 text-[#438787] hover:bg-[#438787]/5 text-xs h-9 px-4 rounded-lg font-semibold">
          <Link to="/patient/epass"><Award className="size-3.5 mr-1.5" />Get ePass</Link>
        </Button>
      </div>
    </div>
  );
}
