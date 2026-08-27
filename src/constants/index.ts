/**
 * Constants — Barrel Export
 * Central entry point for all application constants.
 *
 * @example
 *   import { ROUTES, AI_DISCLAIMER, SPECIALTIES } from "@/constants";
 */

export {
  GROQ_MODEL_REASONING,
  GROQ_MODEL_FAST,
  GROQ_MODEL_VISION,
  GROQ_MODEL_WHISPER,
  GROQ_MODEL_REPORT,
  GROQ_MODEL_PSYCHOLOGIST,
  GROQ_API_BASE,
  GROQ_CHAT_ENDPOINT,
  GROQ_AUDIO_ENDPOINT,
  AI_DISCLAIMER,
  INTENT,
} from "./ai.constants";

export type { Intent } from "./ai.constants";

export {
  SPECIALTIES,
  BLOOD_GROUPS,
  SRI_LANKA_CITIES,
  KEYWORDS,
  SPECIALTY_KEYWORDS,
  CONDITION_SPECIALTY_MAP,
} from "./medical.constants";

export type { Specialty } from "./medical.constants";

export { ROUTES } from "./routes.constants";
export type { AppRoute } from "./routes.constants";
