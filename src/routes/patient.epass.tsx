import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  QrCode,
  Sparkles,
  CreditCard,
  Building2,
  Users,
  Award,
  Clock,
  PhoneCall,
  Lock,
  Heart,
  User,
  Ticket,
  CalendarCheck,
  FileText,
  Percent,
  Activity,
  Shield,
  Crown,
  Stethoscope,
  Headphones,
  Check,
  Bot,
  UserCheck,
  LogIn,
  UserPlus,
  Phone,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { patientService, type PatientProfile } from "@/services/patient.service";
import { getSession, onAuthStateChange, type Session } from "@/services/auth.service";
import { toast } from "sonner";

function CleanPassQRCode({ memberId, memberName }: { memberId: string; memberName: string }) {
  return (
    <svg viewBox="0 0 33 33" className="w-full h-full text-slate-900 fill-current">
      <rect width="33" height="33" fill="white" rx="6" />
      {/* Top-Left Finder Outer Square */}
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {/* Top-Left Finder Inner Dot */}
      <rect x="5.8" y="5.8" width="2.4" height="2.4" rx="0.8" fill="currentColor" />

      {/* Top-Right Finder Outer Square */}
      <rect x="22.5" y="3.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {/* Top-Right Finder Inner Dot */}
      <rect x="24.8" y="5.8" width="2.4" height="2.4" rx="0.8" fill="currentColor" />

      {/* Bottom-Left Finder Outer Square */}
      <rect x="3.5" y="22.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {/* Bottom-Left Finder Inner Dot */}
      <rect x="5.8" y="24.8" width="2.4" height="2.4" rx="0.8" fill="currentColor" />

      {/* Data Pattern Modules */}
      <rect x="13" y="4" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="17" y="4" width="2" height="2" rx="0.6" fill="currentColor" />

      <rect x="13" y="8" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="18" y="8" width="2" height="2" rx="0.6" fill="currentColor" />

      <rect x="4" y="13" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="8" y="13" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="13" y="13" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="17" y="13" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="22" y="13" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="27" y="13" width="2" height="2" rx="0.6" fill="currentColor" />

      <rect x="4" y="17" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="9" y="17" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="14" y="17" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="19" y="17" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="24" y="17" width="2" height="2" rx="0.6" fill="currentColor" />

      <rect x="13" y="22" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="18" y="22" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="23" y="22" width="2" height="2" rx="0.6" fill="currentColor" />

      <rect x="14" y="27" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="20" y="27" width="2" height="2" rx="0.6" fill="currentColor" />
      <rect x="26" y="27" width="2" height="2" rx="0.6" fill="currentColor" />
    </svg>
  );
}

export const Route = createFileRoute("/patient/epass")({
  head: () => ({
    meta: [
      { title: "MedDoc ePass — Digital Health Pass" },
      {
        name: "description",
        content: "Access priority hospital queues, discounted diagnostics, and 24/7 digital care with MedDoc ePass.",
      },
    ],
  }),
  component: EPassPage,
});

type EPassPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  popular?: boolean;
  color: string;
  features: string[];
};

const EPASS_PLANS: EPassPlan[] = [
  {
    id: "silver",
    name: "Silver Health ePass",
    price: "LKR 2,500",
    period: "/ month",
    color: "from-slate-700 to-slate-900",
    features: [
      "Limited MedMind AI Health Assistant",
      "10% discount on laboratory reports",
      "Priority online appointment booking",
      "Digital health profile cloud sync",
      "Standard email & chat support",
    ],
  },
  {
    id: "gold",
    name: "Gold Care ePass",
    price: "LKR 5,900",
    period: "/ month",
    popular: true,
    badge: "Most Popular",
    color: "from-blue-600 to-indigo-900",
    features: [
      "10K AI Credits for AI assistance",
      "Coverage for up to 4 family members",
      "1 free Telemedicine GP consultation / month",
      "20% discount on labs & imaging diagnostics",
      "Free home blood sample collection",
      "Fast-track OPD queue at partner hospitals",
      "24/7 priority clinical chat hotline",
    ],
  },
  {
    id: "platinum",
    name: "Platinum ePass",
    price: "LKR 12,500",
    period: "/ month",
    color: "from-amber-600 to-amber-900",
    features: [
      "100K AI Credits for AI assistance",
      "Full family & senior care coverage",
      "Dedicated personal doctor liaison",
      "30% discount on specialist consultation fees",
      "Free annual executive health screening package",
      "Hospital admission fast-track",
      "24/7 emergency ambulance dispatch assistance",
    ],
  },
];

function EPassPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isSignedOut, setIsSignedOut] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("meddoc_user_signed_out") === "true";
    }
    return false;
  });
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [selectedPlanModal, setSelectedPlanModal] = useState<EPassPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "ezcash" | "bank">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiCredits, setAiCredits] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("meddoc_ai_credits");
    if (saved) {
      setAiCredits(parseInt(saved, 10));
    } else if (activePlan) {
      const planCredits = activePlan === "platinum" ? 100000 : activePlan === "gold" ? 10000 : 1000;
      setAiCredits(planCredits);
    }
  }, [activePlan]);

  // Profile Linkage State
  const [profileMode, setProfileMode] = useState<"existing" | "login" | "signup">("existing");
  const [patientNameInput, setPatientNameInput] = useState("");
  const [patientPhoneInput, setPatientPhoneInput] = useState("");
  const [patientNicInput, setPatientNicInput] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const sess = await getSession();
      setSession(sess);
      if (!sess && localStorage.getItem("meddoc_user_signed_out") === "true") {
        setIsSignedOut(true);
      }
      const p = await patientService.getPatientProfile();
      setProfile(p);
      const savedPass = localStorage.getItem("meddoc_active_epass");
      if (savedPass) {
        setActivePlan(savedPass);
      }

      // Check if user came back from authentication after selecting a membership plan
      const pendingPlanId = localStorage.getItem("meddoc_pending_checkout_plan");
      if (pendingPlanId && (sess || p?.name)) {
        const found = EPASS_PLANS.find((item) => item.id === pendingPlanId);
        if (found) {
          setSelectedPlanModal(found);
          localStorage.removeItem("meddoc_pending_checkout_plan");
        }
      }
    }
    void load();

    const unsub = onAuthStateChange((sess) => {
      setSession(sess);
      if (!sess) {
        setIsSignedOut(true);
      } else {
        setIsSignedOut(false);
        localStorage.setItem("meddoc_user_signed_out", "false");
      }
    });
    return () => {
      unsub.unsubscribe();
    };
  }, []);

  const handlePurchase = (plan: EPassPlan) => {
    // If user is signed out, redirect to sign in / register page (/auth)
    if (isSignedOut || (!session && localStorage.getItem("meddoc_user_signed_out") === "true")) {
      localStorage.setItem("meddoc_pending_checkout_plan", plan.id);
      toast.info("Please sign in or register your MedDoc account to activate your ePass membership.", {
        description: `Selected Plan: ${plan.name}`,
      });
      void navigate({ to: "/auth" });
      return;
    }

    // If user is signed in, open the payment modal directly!
    setSelectedPlanModal(plan);
  };

  const confirmPurchase = async () => {
    if (!selectedPlanModal) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Update or link profile if edited or logged in
    const targetName = patientNameInput.trim() || profile?.name || "Mahinda Rajapaksha";
    const targetPhone = patientPhoneInput.trim() || profile?.phone || "+94 77 123 4567";
    const targetNic = patientNicInput.trim() || profile?.nic || "781293849V";

    const updatedProfile: PatientProfile = {
      ...(profile || {
        id: "p1",
        name: "Mahinda Rajapaksha",
        age: 62,
        gender: "Male",
        bloodGroup: "O+",
        city: "Tangalle",
        phone: "+94 77 123 4567",
        email: "m.rajapaksha@lifora.lk",
        pastDiseases: ["Hypertension"],
        medications: ["Amlodipine 5mg"],
        allergies: ["Penicillin"],
        familyHistory: ["Diabetes"],
      }),
      name: targetName,
      phone: targetPhone,
      nic: targetNic,
    };

    await patientService.updatePatientProfile(updatedProfile);
    setProfile(updatedProfile);

    let planCredits = 1000;
    if (selectedPlanModal.id === "platinum") planCredits = 100000;
    else if (selectedPlanModal.id === "gold") planCredits = 10000;

    // Instantly sync active membership & profile details to Supabase
    await patientService.syncEPassMembershipToSupabase({
      patient_id: updatedProfile.id || "p1",
      patient_name: targetName,
      patient_phone: targetPhone,
      patient_nic: targetNic,
      plan_id: selectedPlanModal.id,
      plan_name: selectedPlanModal.name,
      status: "Active",
      ai_credits: planCredits,
    });

    localStorage.setItem("meddoc_active_epass", selectedPlanModal.id);
    localStorage.setItem("meddoc_ai_credits", planCredits.toString());
    localStorage.setItem("meddoc_user_signed_out", "false");
    localStorage.setItem("meddoc_epass_activation_date", new Date().toISOString());
    setIsSignedOut(false);
    setActivePlan(selectedPlanModal.id);
    setIsProcessing(false);
    setSelectedPlanModal(null);

    toast.success(`Congratulations! Your ${selectedPlanModal.name} is now active!`, {
      description: `Linked to MedDoc Patient Profile: ${targetName} (${targetPhone}) & synced with Supabase.`,
    });
  };

  const currentPlan = EPASS_PLANS.find((p) => p.id === activePlan);
  const memberName = profile?.name || "Mahinda Rajapaksha";
  const memberId = `ePASS-LK-${profile?.id ? profile.id.substring(0, 6).toUpperCase() : "11D71E"}`;

  // Compute exact 30 days validity from activation timestamp
  const activationDateStr = localStorage.getItem("meddoc_epass_activation_date") || new Date().toISOString();
  const activationDate = new Date(activationDateStr);
  const expiryDate = new Date(activationDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const formattedExpiryDate = expiryDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const qrDataText = encodeURIComponent(
    `MEDDOC DIGITAL HEALTH ePASS\n----------------------------\nMember Name: ${memberName}\nMember ID: ${memberId}\nPass Status: Active Membership (30 Days)\nValid Until: ${formattedExpiryDate}\nVerification: Hospital Counter Ready`
  );
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrDataText}&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="MedDoc ePass Digital Health Membership"
        description="Unlock priority hospital queue access, discounted lab tests, free telemedicine visits, and 24/7 clinical AI support."
      />

      {/* Digital Member Card Section (Only rendered when user is signed in) */}
      {!isSignedOut && (
        <div className="w-full">
          {activePlan === "platinum" ? (
          /* PLATINUM ePASS PREMIUM EXECUTIVE DESIGN */
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[28px] p-4 sm:p-8 bg-gradient-to-br from-[#0F1117] via-[#161822] to-[#0D0E14] border border-slate-700/80 ring-1 ring-white/10 shadow-2xl text-slate-100">
            {/* Watermark Golden Crown Accent */}
            <div className="absolute -bottom-12 -right-12 opacity-[0.07] text-amber-300 pointer-events-none hidden sm:block">
              <Crown className="w-96 h-96" />
            </div>

            {/* Top Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg border border-amber-200/50 shrink-0">
                  <Crown className="size-6 sm:size-7 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-xl sm:text-2.5xl tracking-tight text-white leading-none">
                      MedDoc
                    </h3>
                    <span className="font-bold text-xl sm:text-2.5xl text-amber-400 leading-none">
                      ePass
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                    Executive Health Membership
                  </p>
                </div>
              </div>

              {/* Platinum Executive Status Badge */}
              <div className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-600/20 border border-amber-400/40 shadow-sm flex items-center gap-2">
                <Crown className="size-3.5 sm:size-4 text-amber-300 fill-amber-300" />
                <span className="text-[11px] sm:text-xs font-bold text-amber-300 tracking-wide">
                  ACTIVE — Platinum ePass
                </span>
              </div>
            </div>

            {/* Member Info Section */}
            <div className="my-5 sm:my-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-12 relative z-10 p-3.5 sm:p-0 rounded-xl bg-white/5 sm:bg-transparent border border-white/10 sm:border-0">
              <div>
                <p className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-slate-400">
                  MEMBER NAME
                </p>
                <p className="text-xl sm:text-2.5xl font-bold text-white mt-0.5 sm:mt-1">
                  {memberName}
                </p>
              </div>

              <div className="hidden sm:block h-12 w-[1px] bg-slate-700/80" />

              <div>
                <p className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-slate-400">
                  MEMBER ID
                </p>
                <p className="text-lg sm:text-xl font-mono font-bold text-amber-200 mt-0.5 sm:mt-1">
                  {memberId}
                </p>
              </div>
            </div>

            {/* Benefits Feature Grid (5 Columns) */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-inner grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-4 relative z-10 my-4 sm:my-6">
              {[
                {
                  title: `${localStorage.getItem("meddoc_ai_credits") ? parseInt(localStorage.getItem("meddoc_ai_credits") || "0").toLocaleString() : "100K"} AI Credits`,
                  desc: "AI Credits for AI assistant evaluations",
                  icon: Bot,
                },
                {
                  title: "Personal Doctor",
                  desc: "Dedicated personal doctor liaison",
                  icon: User,
                },
                {
                  title: "30% Specialist Off",
                  desc: "30% off specialist consultation fees",
                  icon: Percent,
                },
                {
                  title: "Executive Health",
                  desc: "Free annual executive health screening",
                  icon: FileText,
                },
                {
                  title: "24/7 Priority Hotline",
                  desc: "Instant priority ambulance & clinical hotline",
                  icon: Headphones,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-2 md:border-r md:border-white/10 md:last:border-0"
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mb-2 shadow-sm shrink-0">
                    <item.icon className="size-4 sm:size-5" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-100 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Verification & Expiry Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 pt-4 sm:pt-5 border-t border-slate-700/80 relative z-10 mt-4 sm:mt-6">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-slate-950 flex items-center justify-center shadow-md shrink-0">
                  <Check className="size-4 sm:size-5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  Instant Hospital Fast-Track Verification
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                  Renews: {formattedExpiryDate}
                </span>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-amber-300/60 shadow-md flex items-center justify-center p-2 shrink-0">
                  <CleanPassQRCode memberId={memberId} memberName={memberName} />
                </div>
              </div>
            </div>
          </div>
        ) : activePlan === "gold" ? (
          /* GOLD CARE ePASS DESIGN */
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[28px] p-4 sm:p-8 bg-[#FAF6EE] dark:bg-[#1A1612] border border-[#E8DFC8] dark:border-[#3D3428] shadow-2xl text-slate-900 dark:text-amber-50">
            {/* Watermark Golden Shield Accent */}
            <div className="absolute -bottom-12 -right-12 opacity-[0.06] dark:opacity-[0.1] text-[#B38B3F] pointer-events-none hidden sm:block">
              <Shield className="w-96 h-96" />
            </div>

            {/* Top Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#E6C687] via-[#C5A059] to-[#9A7B38] flex items-center justify-center shadow-md border border-[#F5E6C4] shrink-0">
                  <Shield className="size-6 sm:size-7 fill-white text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-xl sm:text-2.5xl tracking-tight text-[#0A2540] dark:text-white leading-none">
                      MedDoc
                    </h3>
                    <span className="font-bold text-xl sm:text-2.5xl text-[#B38B3F] leading-none">
                      ePass
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-amber-200/70 mt-1">
                    Digital Health Membership
                  </p>
                </div>
              </div>

              {/* Gold Tier Status Badge */}
              <div className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#F5E2B8] via-[#E8CD90] to-[#D4B36A] dark:from-[#5C4924] dark:via-[#423317] dark:to-[#2B210F] border border-[#D1B168] dark:border-[#7A602B] shadow-sm flex items-center gap-2">
                <Crown className="size-3.5 sm:size-4 text-[#7A5B1E] dark:text-amber-300 fill-[#7A5B1E] dark:fill-amber-300" />
                <span className="text-[11px] sm:text-xs font-bold text-[#5C4212] dark:text-amber-200 tracking-wide">
                  ACTIVE — Gold Health ePass
                </span>
              </div>
            </div>

            {/* Member Info Section */}
            <div className="my-5 sm:my-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-12 relative z-10 p-3.5 sm:p-0 rounded-xl bg-white/50 sm:bg-transparent border border-[#E8DFC8]/60 sm:border-0">
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-amber-300/60">
                  MEMBER NAME
                </p>
                <p className="text-xl sm:text-2.5xl font-bold text-[#0A2540] dark:text-amber-100 mt-0.5 sm:mt-1">
                  {memberName}
                </p>
              </div>

              <div className="hidden sm:block h-12 w-[1px] bg-[#E8DFC8] dark:bg-[#3D3428]" />

              <div>
                <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-amber-300/60">
                  MEMBER ID
                </p>
                <p className="text-lg sm:text-xl font-mono font-bold text-[#0A2540] dark:text-amber-100 mt-0.5 sm:mt-1">
                  {memberId}
                </p>
              </div>
            </div>

            {/* Benefits Feature Grid (5 Columns) */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#241E18]/80 border border-[#E8DFC8]/80 dark:border-[#3D3428] shadow-xs grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-4 relative z-10 my-4 sm:my-6">
              {[
                {
                  title: `${localStorage.getItem("meddoc_ai_credits") ? parseInt(localStorage.getItem("meddoc_ai_credits") || "0").toLocaleString() : "10K"} AI Credits`,
                  desc: "AI Credits for AI assistant evaluations",
                  icon: Bot,
                },
                {
                  title: "Priority Appointments",
                  desc: "Fastest bookings at top hospitals",
                  icon: CalendarCheck,
                },
                {
                  title: "Advanced Health Records",
                  desc: "Secure access & sharing of your health data",
                  icon: FileText,
                },
                {
                  title: "Exclusive Discounts",
                  desc: "Save more on tests, medicines & services",
                  icon: Percent,
                },
                {
                  title: "24/7 Premium Support",
                  desc: "Dedicated support whenever you need",
                  icon: Headphones,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-2 md:border-r md:border-[#E8DFC8]/60 md:last:border-0 md:dark:border-[#3D3428]/60"
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F7EEDC] dark:bg-[#34291B] border border-[#E5CE9F] dark:border-[#52412A] text-[#B38B3F] dark:text-amber-300 flex items-center justify-center mb-2 shadow-xs shrink-0">
                    <item.icon className="size-4 sm:size-5" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-amber-100 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-amber-200/70 mt-0.5 sm:mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Verification & Expiry Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 pt-4 sm:pt-5 border-t border-[#E8DFC8] dark:border-[#3D3428] relative z-10 mt-4 sm:mt-6">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#D9B668] to-[#A38136] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Check className="size-4 sm:size-5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-amber-100">
                  Instant Hospital Counter Verification
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-amber-200/80">
                  Renews: {formattedExpiryDate}
                </span>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-[#E8DFC8] shadow-md flex items-center justify-center p-2 shrink-0">
                  <CleanPassQRCode memberId={memberId} memberName={memberName} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SILVER HEALTH ePASS DESIGN */
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[28px] p-4 sm:p-8 bg-[#F4F8FC] dark:bg-[#0D1627] border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100">
            {/* Subtle background curved accent */}
            <div className="absolute top-0 left-0 w-36 h-20 bg-[#0E5CA8]/10 rounded-br-full pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 opacity-[0.06] dark:opacity-[0.1] text-[#0E5CA8] pointer-events-none hidden sm:block">
              <Activity className="w-72 h-72" />
            </div>

            {/* Top Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#0052CC] to-[#0A66C2] flex items-center justify-center text-white shadow-md shrink-0">
                  <Heart className="size-5 sm:size-6 fill-white text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-xl sm:text-2xl tracking-tight text-[#0A2540] dark:text-white leading-none">
                      MedDoc
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      Your Health, Our Priority
                    </p>
                  </div>
                  <div className="h-9 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block" />
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Digital Health Membership</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Access Better Care, Anytime</p>
                  </div>
                </div>
              </div>

              {/* Silver Tier Metallic Emblem Badge */}
              <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 border border-slate-300/80 dark:border-slate-600 shadow-sm flex items-center gap-2.5 sm:gap-3">
                <div className="p-1 sm:p-1.5 rounded-full bg-slate-800 text-slate-100 shadow-sm">
                  <Award className="size-3.5 sm:size-4" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    SILVER TIER
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Silver Health ePass
                  </p>
                </div>
              </div>
            </div>

            {/* Member Info Card Box */}
            <div className="my-4 sm:my-6 p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <User className="size-4 sm:size-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-400 uppercase tracking-widest font-bold">
                    MEMBER NAME
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {memberName}
                  </p>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">MedDoc Digital Health Member</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Ticket className="size-4 sm:size-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-400 uppercase tracking-widest font-bold">
                    MEMBER ID
                  </p>
                  <p className="text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {memberId}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Feature Cards Row */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-4 sm:my-6 relative z-10">
              {[
                { label: "Priority Appointment Booking", icon: CalendarCheck },
                { 
                  label: localStorage.getItem("meddoc_ai_credits") 
                    ? `${parseInt(localStorage.getItem("meddoc_ai_credits") || "0").toLocaleString()} AI Credits Remaining` 
                    : "Limited AI Health Assistant Access", 
                  icon: Sparkles 
                },
                { label: "Digital Health Records Storage", icon: FileText },
                { label: "Exclusive Health Offers & Discounts", icon: Percent },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5 sm:gap-3 shadow-xs"
                >
                  <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                    <item.icon className="size-3.5 sm:size-4" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Verification & QR Code Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 relative z-10">
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 w-full sm:w-auto">
                <CheckCircle2 className="size-5 sm:size-6 text-emerald-600 fill-emerald-100 dark:fill-emerald-950 shrink-0" />
                <div>
                  <p className="text-[11px] sm:text-xs font-bold leading-none">Hospital Counter Verification Ready</p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-1">
                    Present this ePass for instant verification
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">VALID UNTIL</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">{formattedExpiryDate}</p>
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center p-2 sm:p-2.5 shrink-0">
                  <CleanPassQRCode memberId={memberId} memberName={memberName} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Credits Section */}
        <div className="mt-6 max-w-xl mx-auto w-full">
          <Card className="shadow-soft border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-bold">
                <span className="flex items-center gap-1.5 text-primary">
                  <Bot className="size-4" />
                  MedMind AI Assistant Credits
                </span>
                <Badge>
                  {activePlan ? `${activePlan.toUpperCase()} Tier` : "Free Tier"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Remaining tokens for diagnostic screening & clinical evaluations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-foreground tracking-tight">
                  {aiCredits.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Credits Remaining
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3">
                <Progress 
                  value={
                    activePlan === "platinum" ? (aiCredits / 100000) * 100 
                    : activePlan === "gold" ? (aiCredits / 10000) * 100 
                    : activePlan === "silver" ? (aiCredits / 1000) * 100 
                    : 100
                  } 
                  className="h-2" 
                />
              </div>
              
              <p className="text-[11px] text-muted-foreground mt-3">
                Your ePass health membership is active. Credits reset in 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      )}

      {/* Benefits Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Building2, title: "Priority Queue", desc: "Fast-track OPD check-in" },
          { icon: Sparkles, title: "Lab Discounts", desc: "Up to 30% off diagnostics" },
          { icon: PhoneCall, title: "24/7 Telehealth", desc: "Instant GP video consults" },
          { icon: Users, title: "Family Coverage", desc: "Add parents & children" },
        ].map((b, idx) => (
          <Card key={idx} className="p-4 border-border shadow-soft flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <b.icon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{b.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ePass Plans Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">Select Your MedDoc ePass Plan</h2>
          <p className="text-sm text-muted-foreground">
            Choose the membership tier that fits your healthcare needs. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {EPASS_PLANS.map((plan) => {
            const isCurrent = activePlan === plan.id;
            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col justify-between border transition-all ${
                  plan.popular
                    ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-500/40"
                    : "border-border shadow-soft hover:shadow-md"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-1 font-semibold shadow-sm">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pt-6">
                  <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-foreground">{plan.price}</span>
                    <span className="text-xs text-muted-foreground font-medium">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 flex-1">
                  <div className="border-t border-border pt-4 space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    onClick={() => handlePurchase(plan)}
                    disabled={isCurrent}
                    className={`w-full font-medium rounded-xl h-11 ${
                      isCurrent
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-default"
                        : plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    }`}
                  >
                    {isCurrent ? "Active Membership" : `Get ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Checkout / Purchase Modal */}
      <Dialog open={!!selectedPlanModal} onOpenChange={() => setSelectedPlanModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Award className="size-5 text-blue-600 dark:text-blue-400" />
              Activate {selectedPlanModal?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete payment to activate instant MedDoc ePass membership benefits.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Selected Plan Summary Banner */}
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedPlanModal?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Monthly MedDoc Digital Membership</p>
              </div>
              <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{selectedPlanModal?.price}</p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-900 dark:text-white">Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="text-xs h-9 gap-1.5"
                >
                  <CreditCard className="size-3.5" />
                  Card
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "ezcash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("ezcash")}
                  className="text-xs h-9 gap-1.5"
                >
                  <Zap className="size-3.5" />
                  eZ Cash
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "bank" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("bank")}
                  className="text-xs h-9 gap-1.5"
                >
                  <Building2 className="size-3.5" />
                  Bank Transfer
                </Button>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-3 text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <Label className="text-[11px]">Cardholder Name</Label>
                  <Input defaultValue={profile?.name || "Mahinda Rajapaksha"} className="mt-1 h-9 text-xs" />
                </div>
                <div>
                  <Label className="text-[11px]">Card Number</Label>
                  <Input placeholder="4532 •••• •••• 8910" className="mt-1 h-9 text-xs font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[11px]">Expiry Date</Label>
                    <Input placeholder="MM/YY" className="mt-1 h-9 text-xs" />
                  </div>
                  <div>
                    <Label className="text-[11px]">CVV</Label>
                    <Input placeholder="•••" type="password" maxLength={4} className="mt-1 h-9 text-xs" />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "ezcash" && (
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Label className="text-[11px]">Mobile Wallet Number</Label>
                <Input placeholder="+94 77 123 4567" defaultValue={profile?.phone || "+94 77 123 4567"} className="h-9 text-xs" />
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border">
              <Lock className="size-3.5 text-emerald-500 shrink-0" />
              <span>256-bit SSL encrypted secure payment process.</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSelectedPlanModal(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={confirmPurchase} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              {isProcessing ? "Processing Activation..." : "Confirm Payment & Activate ePass"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
