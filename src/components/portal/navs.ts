import {
  Activity,
  Bot,
  CalendarCheck,
  ClipboardList,
  FileText,
  Image,
  LayoutDashboard,
  UserRound,
  Building2,
  Stethoscope,
  CreditCard,
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
  { label: "Profile", to: "/patient/profile", icon: UserRound },
];

export const doctorNav: NavItem[] = [
  { label: "Overview", to: "/doctor", icon: LayoutDashboard },
  { label: "Profile", to: "/doctor/profile", icon: UserRound },
];

export const hospitalNav: NavItem[] = [
  { label: "Overview", to: "/hospital", icon: LayoutDashboard },
  { label: "Doctors", to: "/hospital/doctors", icon: Stethoscope },
  { label: "Branches", to: "/hospital/branches", icon: Building2 },
  { label: "Profile", to: "/hospital/profile", icon: UserRound },
];

export const adminNav: NavItem[] = [{ label: "Overview", to: "/admin", icon: LayoutDashboard }];
