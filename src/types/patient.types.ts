/**
 * Patient Domain Types
 * Patient profile, health records, reports, timeline, chat sessions, and ePass plan types.
 */

import type { Assessment } from "./ai.types";
import type { Doctor } from "./doctor.types";

/** Patient profile shape used throughout the patient portal. */
export type PatientProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  city: string;
  phone: string;
  email: string;
  nic?: string;
  pastDiseases: string[];
  medications: string[];
  allergies: string[];
  familyHistory: string[];
  avatarUrl?: string;
  patientId?: string;
};

/** Lab/diagnostic report item used in the patient reports list. */
export type ReportItem = {
  id: string;
  title: string;
  type: "Blood" | "MRI" | "CT" | "Biopsy" | "Lab";
  date: string;
  status: "Analysed" | "Processing";
  flagged: number;
  summary: string;
};

/** Patient health timeline item (appointments, reports, prescriptions, insights). */
export type TimelineItem = {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: "appointment" | "report" | "image" | "insight" | "prescription";
};

/** A single message in the AI assistant conversation. */
export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  attachment?: string;
  imageBase64?: string;
  reasoning?: string;
  reasoningDuration?: number;
  agenticAction?: import("./ai.types").AgenticAction;
  loadedCare?: import("./ai.types").Recommendation | null;
};

/** Persisted AI assistant chat session. */
export type ChatSession = {
  id: string;
  title: string;
  updatedAt: number;
  messages: AssistantMessage[];
  assessment: Assessment | null;
  care: {
    topRated: Doctor[];
    nearest: Doctor[];
    mostAvailable: Doctor[];
    originalNearest?: Doctor[];
  } | null;
  dynamicSuggestions: string[];
};
