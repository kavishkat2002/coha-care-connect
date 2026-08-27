/**
 * AI Services — Barrel Index
 *
 * This barrel re-exports all public symbols from the AI service layer.
 * The underlying functions are defined in src/services/ai.service.ts
 * which is the single source of truth for all AI logic.
 *
 * Future sub-module split (when ai.service.ts is split into individual
 * files): each sub-module is re-exported here so consumer imports
 * do not need to change.
 *
 * Current structure:
 *   src/services/ai.service.ts  — monolith (2743 lines, all logic here)
 *   src/services/ai/index.ts    — this file (re-export barrel)
 *
 * All public API re-exported from ai.service.ts:
 */
export {
  // Functions
  detectIntent,
  analyseSymptoms,
  analyseMedicalImage,
  analyseMedicalReport,
  recommendCare,
  transcribeAudio,
  searchMedicalInformation,
  consultPsychologist,
} from "@/services/ai.service";

export type {
  // Types
  RiskLevel,
  SkinCancerClassification,
  EyeCancerClassification,
  ImageAnalysis,
  ChatMessage,
  AgenticAction,
  Assessment,
  Recommendation,
  ReportAnalysis,
  DoctorName,
} from "@/services/ai.service";
