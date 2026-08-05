import {
  Activity,
  BarChart3,
  Bot,
  Building2,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileText,
  Image,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  Video,
  UserRound,
} from "lucide-react";
import type { NavItem } from "./PortalShell";

export const patientNav: NavItem[] = [
  { label: "Overview", to: "/patient", icon: LayoutDashboard },
  { label: "AI Assistant", to: "/patient/assistant", icon: Bot },
  { label: "Book Appointment", to: "/patient/book", icon: CalendarCheck },
  { label: "Appointments", to: "/patient/appointments", icon: ClipboardList },
  { label: "Medical Images", to: "/patient/images", icon: Image },
  { label: "Reports", to: "/patient/reports", icon: FileText },
  { label: "Health Timeline", to: "/patient/timeline", icon: Activity },
  { label: "Telemedicine", to: "/patient/telemedicine", icon: Video },
  { label: "Profile", to: "/patient/profile", icon: UserRound },
];

export const doctorNav: NavItem[] = [
  { label: "Overview", to: "/doctor", icon: LayoutDashboard },
  { label: "Patient Queue", to: "/doctor/queue", icon: Users },
  { label: "AI Assessments", to: "/doctor/assessments", icon: Bot },
  { label: "Prescriptions", to: "/doctor/prescriptions", icon: Stethoscope },
  { label: "Telemedicine", to: "/doctor/telemedicine", icon: Video },
  { label: "Analytics", to: "/doctor/analytics", icon: BarChart3 },
];

export const hospitalNav: NavItem[] = [
  { label: "Overview", to: "/hospital", icon: LayoutDashboard },
  { label: "Doctors", to: "/hospital/doctors", icon: Stethoscope },
  { label: "Departments", to: "/hospital/departments", icon: Building2 },
  { label: "Appointments", to: "/hospital/appointments", icon: CalendarCheck },
  { label: "Revenue", to: "/hospital/revenue", icon: CreditCard },
];

export const adminNav: NavItem[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Hospitals", to: "/admin/hospitals", icon: Building2 },
  { label: "AI Monitoring", to: "/admin/ai", icon: ShieldCheck },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];
