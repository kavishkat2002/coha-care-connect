/**
 * Placeholder AI service layer.
 * No models are called here yet — each function returns a deterministic
 * mock payload with the same shape the real API will use, so screens can be
 * wired now and swapped to live endpoints later.
 */
import { AI_DISCLAIMER, doctors, type Doctor } from "@/data/mock";

export type RiskLevel = "low" | "moderate" | "elevated";

export type Assessment = {
  intent: string;
  possibleConditions: { name: string; likelihood: number }[];
  risk: RiskLevel;
  confidence: number;
  summary: string;
  recommendation: string[];
  suggestedSpecialty: string;
  disclaimer: string;
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const KEYWORDS: { match: string[]; specialty: string; intent: string; conditions: string[] }[] = [
  {
    match: ["ulcer", "mouth", "oral", "tongue", "gum"],
    specialty: "Dentistry & Oral Medicine",
    intent: "Oral lesion assessment",
    conditions: ["Aphthous ulcer", "Traumatic mucosal irritation", "Oral lichen planus"],
  },
  {
    match: ["rash", "skin", "mole", "itch", "patch", "acne"],
    specialty: "Dermatology",
    intent: "Skin condition assessment",
    conditions: ["Contact dermatitis", "Fungal skin infection", "Benign pigmented naevus"],
  },
  {
    match: ["breast", "lump", "nipple"],
    specialty: "Gynaecology",
    intent: "Breast symptom assessment",
    conditions: ["Fibroadenoma", "Cyclical breast pain", "Benign breast cyst"],
  },
  {
    match: ["eye", "vision", "blur", "red eye"],
    specialty: "Ophthalmology",
    intent: "Eye symptom assessment",
    conditions: ["Conjunctivitis", "Dry eye syndrome", "Blepharitis"],
  },
];

export function detectIntent(message: string) {
  const text = message.toLowerCase();
  const hit = KEYWORDS.find((k) => k.match.some((m) => text.includes(m)));
  return (
    hit ?? {
      specialty: "General Medicine",
      intent: "General symptom assessment",
      conditions: ["Viral illness", "Stress related symptoms", "Nutritional deficiency"],
    }
  );
}

export async function analyseSymptoms(message: string): Promise<Assessment> {
  await delay(900);
  const hit = detectIntent(message);
  return {
    intent: hit.intent,
    possibleConditions: hit.conditions.map((name, i) => ({ name, likelihood: 72 - i * 21 })),
    risk: message.toLowerCase().includes("weeks") ? "moderate" : "low",
    confidence: 78,
    summary:
      "Based on the details you shared, your symptoms most closely match common, treatable conditions. Nothing you described indicates an emergency.",
    recommendation: [
      `Consult a ${hit.specialty.toLowerCase()} specialist within 7 days`,
      "Avoid irritants and keep the area clean and dry",
      "Return sooner if symptoms worsen, bleed, or spread",
    ],
    suggestedSpecialty: hit.specialty,
    disclaimer: AI_DISCLAIMER,
  };
}

export type ImageAnalysis = {
  quality: "Good" | "Acceptable" | "Poor";
  region: string;
  lesionsDetected: number;
  risk: RiskLevel;
  confidence: number;
  explanation: string;
  recommendation: string[];
  disclaimer: string;
};

export async function analyseMedicalImage(region: string): Promise<ImageAnalysis> {
  await delay(1400);
  return {
    quality: "Good",
    region,
    lesionsDetected: 1,
    risk: "low",
    confidence: 81,
    explanation:
      "A single well-demarcated area was highlighted. Its borders appear regular and colour distribution is even, which is typical of benign changes.",
    recommendation: [
      "Monitor the area for 14 days and re-capture an image",
      `Book a ${region.toLowerCase()} specialist review if it grows or changes colour`,
    ],
    disclaimer: AI_DISCLAIMER,
  };
}

export type ReportAnalysis = {
  fileName: string;
  abnormal: { label: string; value: string; range: string }[];
  plainLanguage: string;
  suggestedSpecialty: string;
  disclaimer: string;
};

export async function analyseMedicalReport(fileName: string): Promise<ReportAnalysis> {
  await delay(1200);
  return {
    fileName,
    abnormal: [
      { label: "Haemoglobin", value: "10.8 g/dL", range: "12.0 – 15.5" },
      { label: "Serum ferritin", value: "9 ng/mL", range: "15 – 150" },
    ],
    plainLanguage:
      "Two values relating to iron levels are lower than the usual range. This pattern is often linked to iron deficiency and is commonly managed with diet changes and supplements.",
    suggestedSpecialty: "General Medicine",
    disclaimer: AI_DISCLAIMER,
  };
}

export type Recommendation = {
  topRated: Doctor[];
  nearest: Doctor[];
  mostAvailable: Doctor[];
};

export async function recommendCare(specialty: string): Promise<Recommendation> {
  await delay(500);
  const pool = doctors.filter((d) => d.specialty === specialty);
  const list = pool.length ? pool : doctors;
  return {
    topRated: [...list].sort((a, b) => b.rating - a.rating).slice(0, 3),
    nearest: [...list].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3),
    mostAvailable: [...list].sort((a, b) => a.queue - b.queue).slice(0, 3),
  };
}
