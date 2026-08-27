/**
 * Types — Barrel Export
 * Central entry point for all shared domain types in Coha Care Connect.
 *
 * Import from "@/types" for all shared domain types rather than
 * reaching into individual service or data files.
 *
 * @example
 *   import type { Doctor, PatientProfile, Assessment } from "@/types";
 */

export type { Role } from "./auth.types";
export type { Doctor } from "./doctor.types";
export type { Hospital } from "./hospital.types";
export type { Appointment, DbAppointment } from "./appointment.types";
export type {
  PatientProfile,
  ReportItem,
  TimelineItem,
  AssistantMessage,
  ChatSession,
} from "./patient.types";
export type {
  RiskLevel,
  ChatMessage,
  AgenticAction,
  Assessment,
  Recommendation,
  ReportAnalysis,
  SkinCancerClassification,
  EyeCancerClassification,
  ImageAnalysis,
  DoctorName,
} from "./ai.types";
