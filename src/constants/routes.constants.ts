/**
 * Route Path Constants
 * All TanStack Router route path strings in one place.
 * Use these when constructing navigate() calls or Link hrefs.
 *
 * @example
 *   import { ROUTES } from "@/constants/routes.constants";
 *   navigate({ to: ROUTES.PATIENT_BOOK });
 */

export const ROUTES = {
  // ─── Public ───────────────────────────────────────────────────────────────
  HOME: "/",
  AUTH: "/auth",

  // ─── Patient Portal ───────────────────────────────────────────────────────
  PATIENT: "/patient",
  PATIENT_ASSISTANT: "/patient/assistant",
  PATIENT_BOOK: "/patient/book",
  PATIENT_APPOINTMENTS: "/patient/appointments",
  PATIENT_REPORTS: "/patient/reports",
  PATIENT_PROFILE: "/patient/profile",
  PATIENT_IMAGES: "/patient/images",
  PATIENT_ELAB: "/patient/elab",
  PATIENT_EPASS: "/patient/epass",
  PATIENT_MEDIFIT: "/patient/medifit",
  PATIENT_MEDMIND_ECARE: "/patient/medmind-ecare",
  PATIENT_TELEMEDICINE: "/patient/telemedicine",
  PATIENT_TIMELINE: "/patient/timeline",

  // ─── Doctor Portal ────────────────────────────────────────────────────────
  DOCTOR: "/doctor",
  DOCTOR_PROFILE: "/doctor/profile",

  // ─── Hospital Portal ─────────────────────────────────────────────────────
  HOSPITAL: "/hospital",
  HOSPITAL_BRANCHES: "/hospital/branches",
  HOSPITAL_DOCTORS: "/hospital/doctors",
  HOSPITAL_PROFILE: "/hospital/profile",

  // ─── Admin Portal ─────────────────────────────────────────────────────────
  ADMIN: "/admin",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
