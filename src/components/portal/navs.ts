import {
  Activity,
  Bot,
  CalendarCheck,
  ClipboardList,
  FileText,
  Image,
  LayoutDashboard,
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

export const doctorNav: NavItem[] = [{ label: "Overview", to: "/doctor", icon: LayoutDashboard }];

export const hospitalNav: NavItem[] = [{ label: "Overview", to: "/hospital", icon: LayoutDashboard }];

export const adminNav: NavItem[] = [{ label: "Overview", to: "/admin", icon: LayoutDashboard }];
