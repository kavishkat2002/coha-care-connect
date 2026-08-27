/**
 * AI Constants
 * All Groq model identifiers, intent strings, and the AI disclaimer used
 * throughout the AI service layer. Centralising these prevents typos and
 * makes model upgrades a single-line change.
 */

// ─── Groq Model Identifiers ───────────────────────────────────────────────────

/** Primary reasoning model used for symptom analysis and intent detection. */
export const GROQ_MODEL_REASONING = "qwen/qwen3-32b";

/** Fallback fast model used for simple chat and intent classification. */
export const GROQ_MODEL_FAST = "llama-3.1-8b-instant";

/** Vision-capable model used for image analysis. */
export const GROQ_MODEL_VISION = "meta-llama/llama-4-maverick-17b-128e-instruct";

/** Audio transcription model (Whisper large). */
export const GROQ_MODEL_WHISPER = "whisper-large-v3";

/** GPT-class model used for deep report analysis. */
export const GROQ_MODEL_REPORT = "openai/gpt-4o-mini";

/** Model used for psychologist / voice care persona interactions. */
export const GROQ_MODEL_PSYCHOLOGIST = "qwen/qwen3-32b";

// ─── Groq API Base URL ────────────────────────────────────────────────────────

export const GROQ_API_BASE = "https://api.groq.com/openai/v1";
export const GROQ_CHAT_ENDPOINT = `${GROQ_API_BASE}/chat/completions`;
export const GROQ_AUDIO_ENDPOINT = `${GROQ_API_BASE}/audio/transcriptions`;

// ─── AI Disclaimer ────────────────────────────────────────────────────────────

export const AI_DISCLAIMER =
  "This is an AI-assisted health assessment and should not replace professional medical advice.";

// ─── Intent Classification Keys ───────────────────────────────────────────────

export const INTENT = {
  GREETING: "greeting",
  CAPABILITIES: "capabilities",
  GRATITUDE: "gratitude",
  SYMPTOM: "symptom",
  SPECIALIST_REQUEST: "specialist_request",
  IMAGE_ANALYSIS: "image_analysis",
  REPORT_ANALYSIS: "report_analysis",
  GENERAL: "general",
} as const;

export type Intent = (typeof INTENT)[keyof typeof INTENT];
