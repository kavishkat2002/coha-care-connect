import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  HeartPulse, 
  TrendingUp, 
  ClipboardCheck, 
  BellRing, 
  ShieldCheck,
  Lock,
  UserCog,
  Lightbulb,
  Send,
  Activity,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/medifit")({
  component: MedifitComingSoon,
});

function MedifitComingSoon() {
  const [email, setEmail] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("You've been added to the early access list!");
      setEmail("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      {/* Back button */}
      <button 
        onClick={() => history.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-5" />
        <span className="font-medium">Back</span>
      </button>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              Connected health, <br />
              <span className="text-teal-600">coming soon</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              We're building secure integrations with the health platforms and devices you already use. Your activity, sleep and wellness data will soon flow into MedDoc to give your doctors a more complete picture of your health.
            </p>
          </div>
        </div>

        {/* Hero Visual Mockup - Custom UI Design */}
        <div className="flex-1 w-full max-w-2xl relative z-10 lg:translate-x-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-blue-500/20 rounded-[32px] blur-3xl -z-10" />
          
          <div className="relative bg-background border border-border/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-auto min-h-[450px] sm:min-h-[400px] sm:h-[400px] text-left pb-4 sm:pb-0">
            {/* Window Header */}
            <div className="h-10 bg-muted/40 border-b border-border/50 flex items-center px-4 gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background border border-border/60 text-[10px] font-medium text-muted-foreground px-4 py-1 rounded-full shadow-sm">
                  app.meddoc.ai/medifit
                </div>
              </div>
              <div className="w-10"></div>
            </div>

            {/* Dashboard Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Mock Sidebar */}
              <div className="w-40 border-r border-border/50 bg-muted/10 p-4 space-y-4 hidden sm:block">
                <div className="font-bold text-foreground flex items-center gap-2 mb-6">
                  <HeartPulse className="size-5 text-teal-600" />
                  MedDoc
                </div>
                <div className="space-y-1">
                  <div className="h-7 rounded-md bg-muted/30" />
                  <div className="h-7 rounded-md bg-muted/30" />
                  <div className="h-7 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center px-2 gap-2">
                    <Activity className="size-3 text-teal-600" />
                    <span className="text-[10px] font-semibold text-teal-700">Health activity</span>
                  </div>
                  <div className="h-7 rounded-md bg-muted/30" />
                </div>
              </div>

              {/* Main Dashboard Area */}
              <div className="flex-1 p-5 bg-background space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Health activity</h3>
                  <p className="text-[10px] text-muted-foreground">Your connected health data and trends</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Heart Rate Card */}
                  <div className="border border-border/60 rounded-xl p-3 shadow-sm flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-muted-foreground">Heart rate</span>
                      <span className="text-[9px] font-bold bg-teal-500/10 text-teal-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" /> Live
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-foreground">72</span>
                      <span className="text-[10px] text-muted-foreground font-medium">bpm</span>
                    </div>
                    {/* Mock sparkline */}
                    <div className="mt-auto pt-4 flex items-end h-10 gap-1 opacity-70">
                      {[4, 5, 4, 6, 7, 5, 8, 9, 7, 6, 5, 6].map((h, i) => (
                        <div key={i} className="w-full bg-teal-500/40 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                      ))}
                    </div>
                  </div>

                  {/* Steps Card */}
                  <div className="border border-border/60 rounded-xl p-3 shadow-sm flex flex-col">
                    <span className="text-xs font-semibold text-muted-foreground mb-2">Steps</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-foreground">7,842</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">Today</span>
                    {/* Mock bar chart */}
                    <div className="mt-auto pt-4 flex items-end h-10 gap-[2px] opacity-70">
                      {[3, 5, 2, 7, 4, 8, 6, 9, 10, 5, 3].map((h, i) => (
                        <div key={i} className="w-full bg-blue-500/50 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                      ))}
                    </div>
                  </div>

                  {/* Sleep Card */}
                  <div className="border border-border/60 rounded-xl p-3 shadow-sm">
                    <span className="text-xs font-semibold text-muted-foreground mb-1 block">Sleep</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-foreground">7<span className="text-xs font-medium text-muted-foreground">h</span> 24<span className="text-xs font-medium text-muted-foreground">m</span></span>
                    </div>
                    <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-indigo-500 rounded-full" />
                    </div>
                  </div>

                  {/* Calories Card */}
                  <div className="border border-border/60 rounded-xl p-3 shadow-sm">
                    <span className="text-xs font-semibold text-muted-foreground mb-1 block">Active calories</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-foreground">412 <span className="text-xs font-medium text-muted-foreground">kcal</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Floating Phone Mockup (overlapping) */}
            <div className="absolute -left-6 -bottom-6 w-32 h-48 bg-background border-[4px] border-muted-foreground/20 rounded-2xl shadow-xl hidden sm:block rotate-[-5deg] overflow-hidden">
              <div className="bg-teal-600 h-10 flex items-center justify-center text-[10px] font-bold text-white">Apple Health</div>
              <div className="p-3 space-y-2">
                <div className="h-3 w-1/2 bg-muted/50 rounded" />
                <div className="h-10 w-full bg-teal-500/10 rounded-lg flex items-center justify-center">
                  <HeartPulse className="size-5 text-teal-600 animate-bounce" />
                </div>
                <div className="h-3 w-3/4 bg-muted/50 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px bg-border flex-1" />
          <h2 className="text-xl font-bold text-foreground">What you'll be able to do</h2>
          <div className="h-px bg-border flex-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <FeatureCard 
            icon={HeartPulse} 
            color="text-emerald-500" 
            bg="bg-emerald-500/10"
            title="Track in real time" 
            desc="Monitor heart rate, activity, sleep and more in near real time." 
          />
          <FeatureCard 
            icon={TrendingUp} 
            color="text-indigo-500" 
            bg="bg-indigo-500/10"
            title="See meaningful trends" 
            desc="Understand patterns and changes over time with clear insights." 
          />
          <FeatureCard 
            icon={ClipboardCheck} 
            color="text-blue-500" 
            bg="bg-blue-500/10"
            title="Share with your doctor" 
            desc="Give your doctor better context for more accurate assessments." 
          />
          <FeatureCard 
            icon={BellRing} 
            color="text-amber-500" 
            bg="bg-amber-500/10"
            title="Get smart alerts" 
            desc="Receive personalised alerts for important changes and goals." 
          />
          <FeatureCard 
            icon={ShieldCheck} 
            color="text-teal-500" 
            bg="bg-teal-500/10"
            title="Stay in control" 
            desc="Manage permissions and privacy anytime from your account." 
          />
        </div>
      </div>

      {/* Supported Platforms */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px bg-border flex-1" />
          <h2 className="text-xl font-bold text-foreground">Supported platforms</h2>
          <div className="h-px bg-border flex-1" />
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-card border border-border/60 rounded-3xl p-8 shadow-sm">
          <PlatformBadge name="Apple Health" image="/images/apple-health.png" />
          <PlatformBadge name="Google Health Connect" image="/images/google-health-connect.png" />
          <PlatformBadge name="Fitbit" image="/images/fitbit.png" />
          <PlatformBadge name="Garmin" image="/images/garmin.png" />
          <PlatformBadge name="Samsung Health" image="/images/samsung-health.png" />
        </div>
      </div>

      {/* Early Access CTA */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20 border border-teal-100 dark:border-teal-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
            <Send className="size-5 text-teal-600" />
            Be the first to know when integrations go live.
          </h3>
          <p className="text-sm text-muted-foreground">
            Join the early access list and we'll notify you as soon as your favorite platforms are available.
          </p>
        </div>
        <form onSubmit={handleJoin} className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full md:w-64 bg-background"
            required
          />
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white gap-2 shrink-0">
            Join early access
            <Send className="size-4" />
          </Button>
        </form>
      </div>

      {/* Footer Trust Markers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-border/50">
        <div className="flex gap-4">
          <div className="mt-1 bg-teal-500/10 p-2 rounded-xl h-fit">
            <Lock className="size-5 text-teal-600" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">Your data is secure</h4>
            <p className="text-xs text-muted-foreground mt-1">End-to-end encryption and strict privacy.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 bg-blue-500/10 p-2 rounded-xl h-fit">
            <UserCog className="size-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">You're in control</h4>
            <p className="text-xs text-muted-foreground mt-1">Choose what to share and when.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 bg-emerald-500/10 p-2 rounded-xl h-fit">
            <Lightbulb className="size-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">Better insights</h4>
            <p className="text-xs text-muted-foreground mt-1">Health data + medical records, together.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, color, bg, title, desc }: { icon: any, color: string, bg: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center`}>
        <Icon className={`size-6 ${color}`} />
      </div>
      <div>
        <h4 className="font-bold text-sm text-foreground mb-1.5">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PlatformBadge({ name, image }: { name: string; image?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-border/40 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors w-40 gap-2">
      {image && <img src={image} alt={name} className="w-8 h-8 object-contain" />}
      <div className="flex flex-col items-center">
        <span className="font-bold text-sm text-foreground text-center">{name}</span>
      </div>
    </div>
  );
}
