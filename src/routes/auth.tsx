import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, ShieldCheck, Stethoscope, UserRound, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import type { Role } from "@/data/mock";
import { portalHome, signIn, signUp } from "@/services/auth.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MedDoc" },
      {
        name: "description",
        content:
          "Sign in or create a MedDoc account as a patient, doctor or hospital to access your care portal.",
      },
    ],
  }),
  component: AuthPage,
});

const roles: { value: Role; label: string; icon: typeof UserRound; blurb: string }[] = [
  { value: "patient", label: "Patient", icon: UserRound, blurb: "Book care and track your health" },
  { value: "doctor", label: "Doctor", icon: Stethoscope, blurb: "Manage your clinic and queue" },
  { value: "hospital", label: "Hospital", icon: Building2, blurb: "Run departments and staff" },
  { value: "admin", label: "Administrator", icon: ShieldCheck, blurb: "Platform operations" },
];

function RoleSelect({ value, onChange, allowed }: { value: Role; onChange: (r: Role) => void; allowed?: Role[] }) {
  const visibleRoles = allowed ? roles.filter((r) => allowed.includes(r.value)) : roles;

  return (
    <fieldset className="space-y-4 pt-2">
      <legend className="text-sm font-semibold text-slate-900">I am signing in as</legend>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {visibleRoles.map((r) => (
          <button
            key={r.value}
            type="button"
            aria-pressed={value === r.value}
            onClick={() => onChange(r.value)}
            className={cn(
              "flex flex-col items-center justify-start p-4 rounded-xl border text-center transition-all",
              value === r.value
                ? "border-slate-300 bg-slate-50 shadow-sm"
                : "border-border bg-white hover:border-slate-300 hover:bg-slate-50/50"
            )}
          >
            <r.icon
              className={cn("size-6 mb-3 transition-colors", value === r.value ? "text-[#438787]" : "text-slate-500")}
              strokeWidth={1.5}
            />
            <span className="text-sm font-semibold text-slate-900">{r.label}</span>
            <span className="text-xs text-slate-500 mt-1 leading-tight hidden sm:block">{r.blurb}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("patient");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success("Signed in successfully");
      navigate({ to: portalHome[role] });
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, registerRole: Role = "patient") => {
    setIsLoading(true);
    try {
      await signUp(email, password, registerRole, name);
      toast.success("Account created successfully");
      navigate({ to: portalHome[registerRole] });
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col lg:grid lg:grid-cols-2 bg-white font-sans text-slate-900">
      
      {/* Brand Side (Left) */}
      <div className="relative hidden flex-col justify-between lg:flex bg-[#F8F7F4] overflow-hidden min-h-dvh">
        
        {/* Top Logo */}
        <div className="relative z-20 p-12 pb-0">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
        </div>
        
        {/* Middle Content */}
        <div className="relative z-20 max-w-[420px] px-12 mt-16 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h1 className="text-[2.75rem] font-medium tracking-tight text-[#112325] leading-[1.15]">
              Care that starts with understanding.
            </h1>
            <div className="h-0.5 w-12 bg-[#438787] mt-8 mb-6 rounded-full" />
            <p className="text-slate-600 leading-relaxed text-base font-medium">
              One seamless account connects your appointments, AI assessments, reports, and medical timeline
              across every hospital in the network.
            </p>
            
            <div className="mt-12 bg-[#E9EBE8]/60 border border-[#D1D5D2] p-5 rounded-xl flex gap-4 items-start max-w-sm">
               <div className="mt-0.5">
                 <Shield className="size-5 text-[#438787]" strokeWidth={1.5} />
               </div>
               <p className="text-xs text-slate-600 font-medium leading-relaxed">
                 This platform is for informational purposes only and does not replace professional medical advice.
               </p>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Footer & Background Image */}
        <div className="relative z-20 px-12 pb-8 pt-0 mt-auto">
          <p className="text-xs font-medium text-slate-500/80">
            © {new Date().getFullYear()} MedDoc. All rights reserved.
          </p>
        </div>
        
        {/* Background Desk Image matching the vibe */}
        <div className="absolute -bottom-1 left-0 right-0 w-full h-[60%] z-10 pointer-events-none flex items-end justify-center">
           <img 
              src="/auth-bg.png" 
              alt="MedDoc Care Team" 
              className="w-full h-full object-cover object-bottom"
              style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%)' }}
           />
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="flex flex-1 items-center justify-center p-4 py-10 sm:p-8 lg:p-12 bg-white w-full">
        <div className="w-full max-w-[460px] mx-auto">
          
          <div className="mb-8 lg:hidden flex justify-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 border-b border-border/60 h-auto rounded-none">
                <TabsTrigger 
                  value="login" 
                  className="rounded-none border-b-2 border-transparent px-2 py-3 font-medium text-slate-500 data-[state=active]:border-[#438787] data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent sm:text-base text-sm whitespace-normal h-auto"
                >
                  Sign in
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="rounded-none border-b-2 border-transparent px-2 py-3 font-medium text-slate-500 data-[state=active]:border-[#438787] data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent sm:text-base text-sm whitespace-normal h-auto"
                >
                  Register
                </TabsTrigger>
                <TabsTrigger 
                  value="forgot" 
                  className="rounded-none border-b-2 border-transparent px-2 py-3 font-medium text-slate-500 data-[state=active]:border-[#438787] data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent sm:text-base text-sm whitespace-normal h-auto"
                >
                  Reset password
                </TabsTrigger>
              </TabsList>

              <div className="mt-8 sm:mt-10">
                {/* SIGN IN TAB */}
                <TabsContent value="login" className="mt-0 outline-none space-y-5 sm:space-y-6">
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-5 sm:space-y-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <h2 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-slate-900">Welcome back</h2>
                      <p className="text-[15px] text-slate-600">Sign in to access your MedDoc portal.</p>
                    </div>

                    <form
                      className="space-y-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const data = new FormData(e.currentTarget);
                        handleLogin(String(data.get("email")), String(data.get("password")));
                      }}
                    >
                      <RoleSelect value={role} onChange={setRole} />
                      
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="text-sm font-semibold text-slate-900">Email address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" strokeWidth={2} />
                            <Input id="login-email" name="email" type="email" required placeholder="you@example.com" className="pl-10 h-11 border-slate-200 focus-visible:ring-[#438787]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password" className="text-sm font-semibold text-slate-900">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" strokeWidth={2} />
                            <Input id="login-password" name="password" type={showPassword ? "text" : "password"} required placeholder="Enter your password" className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-[#438787]" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                              {showPassword ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" className="border-slate-300 rounded-[4px] data-[state=checked]:bg-[#438787] data-[state=checked]:border-[#438787]" />
                          <label htmlFor="remember" className="text-sm font-medium text-slate-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                            Remember me
                          </label>
                        </div>
                        <a href="#" className="text-sm font-medium text-[#438787] hover:underline hover:text-[#2d5f60]">
                          Forgot password?
                        </a>
                      </div>

                      <Button type="submit" className="w-full h-12 text-base font-medium bg-[#438787] hover:bg-[#356f6f] text-white rounded-lg shadow-sm" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                      </Button>
                      
                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-3 text-slate-500 font-medium">or continue with</span>
                        </div>
                      </div>
                      
                      <Button type="button" variant="outline" className="w-full h-12 text-[15px] font-medium border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm flex items-center justify-center gap-3">
                        <svg className="size-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                      </Button>
                      
                      <div className="text-center text-sm font-medium text-slate-600">
                        Don't have an account? <a href="#" className="text-[#438787] hover:underline hover:text-[#2d5f60]">Register</a>
                      </div>
                    </form>
                  </motion.div>
                </TabsContent>

                {/* REGISTER TAB */}
                <TabsContent value="register" className="mt-0 outline-none space-y-5 sm:space-y-6">
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-5 sm:space-y-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <h2 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-slate-900">Create account</h2>
                      <p className="text-[15px] text-slate-600">Choose the role that matches how you will use MedDoc.</p>
                    </div>

                    <form
                      className="space-y-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const data = new FormData(e.currentTarget);
                        handleRegister(String(data.get("email")), String(data.get("password")), String(data.get("name")), role);
                      }}
                    >
                      <RoleSelect value={role} onChange={setRole} allowed={["patient", "admin"]} />
                      
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="reg-name" className="text-sm font-semibold text-slate-900">Full name</Label>
                          <div className="relative">
                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" strokeWidth={2} />
                            <Input id="reg-name" name="name" required placeholder="John Doe" className="pl-10 h-11 border-slate-200 focus-visible:ring-[#438787]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email" className="text-sm font-semibold text-slate-900">Email address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" strokeWidth={2} />
                            <Input id="reg-email" name="email" type="email" required placeholder="you@example.com" className="pl-10 h-11 border-slate-200 focus-visible:ring-[#438787]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password" className="text-sm font-semibold text-slate-900">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" strokeWidth={2} />
                            <Input id="reg-password" name="password" type={showPassword ? "text" : "password"} required minLength={8} placeholder="At least 8 characters" className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-[#438787]" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                              {showPassword ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full h-12 text-base font-medium bg-[#438787] hover:bg-[#356f6f] text-white rounded-lg shadow-sm" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create account"}
                      </Button>
                      
                      <div className="text-center text-sm font-medium text-slate-600">
                        Already have an account? <a href="#" className="text-[#438787] hover:underline hover:text-[#2d5f60]">Sign in</a>
                      </div>
                    </form>
                  </motion.div>
                </TabsContent>

                {/* FORGOT PASSWORD TAB */}
                <TabsContent value="forgot" className="mt-0 outline-none space-y-5 sm:space-y-6">
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-5 sm:space-y-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <h2 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-slate-900">Reset password</h2>
                      <p className="text-[15px] text-slate-600">We will email you a secure reset link.</p>
                    </div>

                    <form
                      className="space-y-6 pt-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        toast.success("If the email exists, a reset link is on its way.");
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email" className="text-sm font-semibold text-slate-900">Email address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" strokeWidth={2} />
                          <Input id="forgot-email" type="email" required placeholder="you@example.com" className="pl-10 h-11 border-slate-200 focus-visible:ring-[#438787]" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-12 text-base font-medium bg-[#438787] hover:bg-[#356f6f] text-white rounded-lg shadow-sm">
                        Send reset link
                      </Button>
                    </form>
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
