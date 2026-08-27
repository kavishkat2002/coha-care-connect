/**
 * AI Domain Types
 * All types used by the AI service layer — symptom assessment, image analysis,
 * lab report analysis, clinical chat, care recommendations, and agentic actions.
 */

import type { Doctor } from "./doctor.types";

// ─── Risk / Confidence ────────────────────────────────────────────────────────

export type RiskLevel = "low" | "moderate" | "elevated";

// ─── Conversation ─────────────────────────────────────────────────────────────

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  imageBase64?: string;
};

// ─── Agentic Actions ─────────────────────────────────────────────────────────

export type AgenticAction = {
  type: "redirect" | "book_doctor" | "find_specialist" | "analyze_image" | "book_specific_doctor" | "none";
  targetRoute?: string;
  specialty?: string;
  message?: string;
  parameters?: Record<string, any>;
};

// ─── Symptom Assessment ──────────────────────────────────────────────────────

export type Assessment = {
  intent: string;
  possibleConditions: { name: string; likelihood: number }[];
  risk: RiskLevel;
  confidence: number;
  summary: string;
  plainLanguageSummary: string;
  followUpQuestions: string[];
  recommendation: string[];
  suggestedSpecialty: string;
  disclaimer: string;
  reasoning?: string;
  agenticAction?: AgenticAction;
};

// ─── Care Recommendations ────────────────────────────────────────────────────

export type Recommendation = {
  topRated: Doctor[];
  nearest: Doctor[];
  mostAvailable: Doctor[];
};

// ─── Lab Report Analysis ─────────────────────────────────────────────────────

export type ReportAnalysis = {
  fileName: string;
  documentType: string;
  confidence: number;
  results: {
    testName: string;
    loincCode?: string;
    value: number | string;
    unit: string;
    referenceRange: {
      low?: number | string;
      high?: number | string;
      rawRange: string;
    };
    flag: "normal" | "low" | "high" | "critical" | "unknown";
    normalized?: {
      value: number | string;
      unit: string;
    };
  }[];
  patterns: string[];
  criticalFlags: string[];
  plainLanguage: string;
  overallInterpretation: string;
  suggestedSpecialty: string;
  recommendations: string[];
  disclaimer: string;
};

// ─── Skin Cancer Image Analysis ──────────────────────────────────────────────

export type SkinCancerClassification = {
  classification: "benign" | "malignant" | "indeterminate";
  subtype: "melanocytic_nevi" | "melanoma" | "benign_keratosis_like_lesions" | "basal_cell_carcinoma" | "actinic_keratoses" | "vascular_lesions" | "dermatofibroma" | "seborrheic_keratosis" | "squamous_cell_carcinoma" | "dysplastic_nevus" | "inflammatory" | "indeterminate" | "unknown";
  malignancyProbability: number;
  qualityCheck: {
    quality: "good" | "acceptable" | "poor";
    qualityScore: number;
    skinDetected: boolean;
    lesionVisible: boolean;
    fitzpatrickGroup?: "I-II" | "III-IV" | "V-VI";
    imageMode?: "smartphone" | "dermoscopy";
  };
  lesionSegmentation?: {
    detected: boolean;
    bbox: [number, number, number, number];
    areaPixels: number;
  };
  abcde: {
    asymmetry: "symmetric" | "asymmetric";
    border: "regular" | "irregular" | "jagged" | "notched" | "blurred" | "fading";
    color: "light_brown" | "dark_brown" | "black" | "blue_gray" | "red" | "white" | "mixed";
    diameter: "unable_to_determine" | string;
    evolution: "unable_to_determine" | string;
  };
  dermoscopy?: {
    available: boolean;
    atypicalNetwork: boolean;
    dotsGlobules: boolean;
    blueGrayStructures: boolean;
    blueWhiteVeil: boolean;
    regression: boolean;
    vascularStructures: boolean;
  };
  uncertaintyLayer: {
    confidenceLevel: "high" | "moderate" | "low" | "insufficient_image";
    clinicalCertainty: string;
    referralTriage: "low_concern" | "suspicious" | "highly_suspicious";
  };
  tnmStagingReference: {
    confirmedDiagnosisRequired: boolean;
    T: string | null;
    N: string | null;
    M: string | null;
    stage: string | null;
    reason: string;
  };
  sensitivity: string;
  specificity: string;
};

// ─── Eye Cancer Image Analysis ───────────────────────────────────────────────

export type EyeCancerClassification = {
  classification: "benign" | "malignant" | "indeterminate";
  subtype: "retinoblastoma" | "uveal_melanoma" | "orbital_lymphoma" | "conjunctival_melanoma" | "benign_nevus" | "conjunctival_nevus" | "primary_acquired_melanosis" | "diabetic_retinopathy" | "glaucoma" | "macular_degeneration" | "indeterminate" | "unknown";
  malignancyProbability: number;
  isFundusScan: boolean;
  fundusPathology?: string;
  qualityCheck: {
    quality: "good" | "acceptable" | "poor";
    qualityScore: number;
    eyeDetected: boolean;
    anatomicalRegionVisible: boolean;
    modalityCheck: string;
  };
  anatomicalRegion: "conjunctiva" | "cornea" | "iris" | "pupil" | "eyelid" | "fundus_retina" | "periocular" | "unknown";
  abnormalityDetected: boolean;
  abnormalityConfidence: number;
  lesionSegmentation?: {
    detected: boolean;
    bbox: [number, number, number, number];
    areaPixels: number;
  };
  clinicalFeatureVector: {
    pigmentation: "none" | "light" | "brown" | "dark_brown" | "black" | "blue_black" | "mixed";
    shape: "flat" | "elevated" | "nodular" | "diffuse" | "irregular";
    border: "regular" | "irregular" | "well_defined" | "poorly_defined";
    location: "bulbar_conjunctiva" | "limbal" | "palpebral_conjunctiva" | "fornix" | "caruncle" | "cornea" | "other";
    vascularity: "none" | "mild" | "moderate" | "prominent";
    extent: "small" | "medium" | "large";
    lesionArea?: number;
    lesionPerimeter?: number;
    circularity?: number;
  };
  uncertaintyLayer: {
    confidenceLevel: "high" | "moderate" | "low" | "insufficient_image";
    clinicalCertainty: string;
    referralTriage: "low_concern" | "suspicious" | "highly_suspicious";
  };
  tnmStagingReference: {
    confirmedDiagnosisRequired: boolean;
    T: string | null;
    N: string | null;
    M: string | null;
    stage: string | null;
    reason: string;
  };
  rcpathHistopathologyReference?: {
    requiredCoreDataItems: string[];
    microscopicCellTypeReference: string;
    extravascularMatrixPatternsReference: string;
    mitoticCountReference: string;
    extraocularExtensionReference: string;
    bap1ExpressionReference: string;
  };
};

// ─── General Image Analysis ───────────────────────────────────────────────────

export type ImageAnalysis = {
  quality: "Good" | "Acceptable" | "Poor";
  region: string;
  lesionsDetected: number;
  risk: RiskLevel;
  confidence: number;
  explanation: string;
  plainLanguageExplanation: string;
  recommendation: string[];
  suggestedSpecialty: string;
  skinCancerClassification?: SkinCancerClassification;
  eyeCancerClassification?: EyeCancerClassification;
  boundingBox?: [number, number, number, number];
  cancerModelVerified?: boolean;
  cancerModelMetrics?: any;
  skinCancerModelMetrics?: any;
  skinCancerDatasetMetrics?: any;
  eyeCancerModelMetrics?: any;
  disclaimer: string;
  predictionScore?: number;
  reasoningSteps?: string[];
  externalSearchContext?: string;
  isMedicalImage?: boolean;
};

// ─── Psychologist / Voice Care ────────────────────────────────────────────────

/** Supported AI psychologist personas in MedMind Voice eCare. */
export type DoctorName = "Nuwan" | "Ishani" | "Kavi";
