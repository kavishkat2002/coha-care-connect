import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  Calendar,
  Award,
  Pill,
  CheckCircle2,
  Info,
  Clock,
  ExternalLink,
  Check,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/shared/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getSession, signOut, onAuthStateChange, type Session } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { patientService } from "@/services/patient.service";

export type NavItem = { label: string; to: string; icon: LucideIcon };

export type NotificationItem = {
  id: string;
  type: "message" | "appointment" | "epass" | "medication" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "message",
    title: "New Doctor Message & Prescription",
    description: "Dr. Menaka De Alwis sent a follow-up chat message with a PDF medical document.",
    time: "5 mins ago",
    read: false,
    link: "/patient/telemedicine",
  },
  {
    id: "n2",
    type: "appointment",
    title: "Scheduled Video Consultation Today",
    description: "Your Telemedicine video meeting with Dr. Menaka De Alwis is ready for launch.",
    time: "30 mins ago",
    read: false,
    link: "/patient/telemedicine",
  },
  {
    id: "n3",
    type: "medication",
    title: "MedMind Daily Pill Reminder",
    description: "Scheduled dose: Amoxicillin 500mg (Post-lunch). Tap to view dosage schedule.",
    time: "Today, 01:30 PM",
    read: false,
    link: "/patient/medmind-ecare",
  },
  {
    id: "n4",
    type: "epass",
    title: "Digital Health ePass Active",
    description: "Your Gold Care Digital Membership is active and valid for 30 days.",
    time: "Yesterday",
    read: true,
    link: "/patient/epass",
  },
  {
    id: "n5",
    type: "system",
    title: "HD Video Call Feature Enabled",
    description: "Direct 2-way HD video meetings are unlocked for your scheduled consultations.",
    time: "2 days ago",
    read: true,
    link: "/patient/telemedicine",
  },
];

const ADMIN_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "a1",
    type: "system",
    title: "System Update Complete",
    description: "The core platform has been updated to v2.1.0.",
    time: "2 hours ago",
    read: false,
    link: "/admin",
  },
  {
    id: "a2",
    type: "appointment",
    title: "New Hospital Registered",
    description: "CarePoint Hospital has requested verification.",
    time: "4 hours ago",
    read: false,
    link: "/admin",
  },
];

const HOSPITAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "h1",
    type: "appointment",
    title: "New Doctor Onboarded",
    description: "Dr. Sandeep has joined the cardiology department.",
    time: "1 hour ago",
    read: false,
    link: "/hospital",
  },
  {
    id: "h2",
    type: "system",
    title: "Roster Update Required",
    description: "Please update the weekend shift roster.",
    time: "5 hours ago",
    read: true,
    link: "/hospital",
  },
];

export function PortalShell({
  nav,
  portalLabel,
  children,
}: {
  nav: NavItem[];
  portalLabel: string;
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    let initialArray = INITIAL_NOTIFICATIONS;
    let storageKey = "meddoc_notifications_patient";

    if (portalLabel.toLowerCase().includes("admin")) {
      initialArray = ADMIN_NOTIFICATIONS;
      storageKey = "coha_admin_notifs_v1";
    } else if (portalLabel.toLowerCase().includes("hospital")) {
      initialArray = HOSPITAL_NOTIFICATIONS;
      storageKey = "coha_hospital_notifs_v1";
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialArray;
  });

  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    async function loadProfile(s: Session | null) {
      if (s && s.role === "patient") {
        const p = await patientService.getPatientProfile();
        setProfile(p);
      } else {
        setProfile(null);
      }
    }

    getSession().then((s) => {
      setSession(s);
      setIsLoading(false);
      void loadProfile(s);
    });

    const unsubscribe = onAuthStateChange((s) => {
      setSession(s);
      setIsLoading(false);
      void loadProfile(s);
    });

    const channel = typeof window !== "undefined" && "BroadcastChannel" in window 
      ? new BroadcastChannel("coha_profile_sync") 
      : null;

    if (channel) {
      channel.onmessage = () => {
        void patientService.getPatientProfile().then(setProfile);
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "coha_patient_profile_shared") {
        void patientService.getPatientProfile().then(setProfile);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      unsubscribe.unsubscribe();
      channel?.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Sync notifications to localStorage
  useEffect(() => {
    let storageKey = "meddoc_notifications_patient";
    if (portalLabel.toLowerCase().includes("admin")) storageKey = "coha_admin_notifs_v1";
    else if (portalLabel.toLowerCase().includes("hospital")) storageKey = "coha_hospital_notifs_v1";
    
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, portalLabel]);

  useEffect(() => setOpen(false), [pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.info("Notifications panel cleared");
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="size-4 text-blue-600 dark:text-blue-400" />;
      case "appointment":
        return <Calendar className="size-4 text-emerald-600 dark:text-emerald-400" />;
      case "medication":
        return <Pill className="size-4 text-purple-600 dark:text-purple-400" />;
      case "epass":
        return <Award className="size-4 text-amber-600 dark:text-amber-400" />;
      case "system":
      default:
        return <Info className="size-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const initials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "MD";

  const links = (
    <nav className="space-y-1">
      {nav.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card p-4 lg:block">
        <div className="mb-6 flex items-center justify-between px-2">
          <Logo />
        </div>
        <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {portalLabel}
        </div>
        {links}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4">
                <SheetTitle className="sr-only">{portalLabel} navigation</SheetTitle>
                <Logo />
                <div className="mt-6">{links}</div>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-medium lg:hidden">MedDoc</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Interactive Notifications & Reminders Dropdown Panel */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative size-10 rounded-full hover:bg-muted">
                  <Bell className="size-5 text-slate-700 dark:text-slate-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-5 bg-blue-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-card shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-w-sm p-0 rounded-2xl border border-border shadow-2xl overflow-hidden">
                <div className="p-3.5 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="size-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications & Reminders</span>
                    {unreadCount > 0 && (
                      <Badge className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                    >
                      <Check className="size-3" /> Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-88 overflow-y-auto divide-y divide-border">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <CheckCircle2 className="size-8 text-emerald-500 mx-auto opacity-80" />
                      <p className="text-xs font-semibold text-foreground">You are all caught up!</p>
                      <p className="text-[11px] text-muted-foreground">No pending messages or reminders.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.link) navigate({ to: n.link });
                        }}
                        className={cn(
                          "p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-muted/50",
                          !n.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                        )}
                      >
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                          {getNotificationIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn("text-xs leading-tight truncate", !n.read ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300")}>
                              {n.title}
                            </p>
                            {!n.read && <span className="size-2 rounded-full bg-blue-600 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {n.description}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono block pt-0.5">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-2 border-t border-border bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between px-3">
                    <button
                      type="button"
                      onClick={clearAllNotifications}
                      className="text-[11px] text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="size-3" /> Clear panel
                    </button>
                    <Link
                      to="/patient/telemedicine"
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View Consultations <ExternalLink className="size-3" />
                    </Link>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isLoading ? null : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="size-8">
                      {profile?.avatarUrl || profile?.gender ? (
                        <img 
                          src={profile.avatarUrl || (profile.gender?.toLowerCase() === "female" 
                            ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                          )} 
                          className="size-full object-cover rounded-full"
                          alt="User Avatar"
                        />
                      ) : (
                        <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">
                      {session.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <span className="block text-sm font-medium">{session.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {session.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-medium"
                    onClick={async () => {
                      await signOut();
                      toast.success("Signed out successfully. Health profile data cleared.");
                      navigate({ to: "/auth" });
                    }}
                  >
                    <LogOut className="mr-2 size-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" className="ml-2 bg-primary">
                <Link to="/auth">Login as MedDoc member</Link>
              </Button>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10 pb-safe">{children}</main>
      </div>
    </div>
  );
}
