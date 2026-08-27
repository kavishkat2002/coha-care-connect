/**
 * Medical Domain Constants
 * Medical specialties, blood groups, cities, symptom keyword maps,
 * and specialty lookup maps used across AI services, forms, and filters.
 */

// ─── Specialties ──────────────────────────────────────────────────────────────

/** All medical specialties available in the Coha Care Connect doctor pool. */
export const SPECIALTIES = [
  "Psychiatry & Mental Health",
  "Dermatology",
  "Oncology",
  "Ophthalmology",
  "Dentistry & Oral Medicine",
  "General Medicine",
  "Radiology",
  "Cardiology",
  "Gynaecology",
  "Subfertility & Gynaecology",
  "Oral & Maxillofacial Surgery",
  "Orthopaedic Surgery",
  "Neurology",
  "Nephrology",
  "Rheumatology",
  "General Surgery",
  "Nutrition",
  "Virology",
  "Vascular & Transplant Surgery",
  "Gastroenterology",
  "Endocrinology",
] as const;

export type Specialty = (typeof SPECIALTIES)[number];

// ─── Blood Groups ─────────────────────────────────────────────────────────────

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

// ─── Sri Lanka Cities ─────────────────────────────────────────────────────────

export const SRI_LANKA_CITIES = [
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Negombo",
  "Kurunegala",
  "Ratnapura",
  "Badulla",
  "Anuradhapura",
  "Polonnaruwa",
  "Matara",
  "Batticaloa",
  "Trincomalee",
  "Nuwara Eliya",
  "Kegalle",
  "Gampaha",
  "Monaragala",
  "Hambantota",
] as const;

// ─── Symptom → Condition/Specialty Keyword Map ────────────────────────────────

/**
 * Keyword rules used by the AI service fallback logic to infer conditions and
 * recommend specialties when the Groq API is unavailable.
 */
export const KEYWORDS = [
  // Kidney & Urinary
  { match: ["urine", "urinate", "kidney", "flank", "side pain", "pee", "urinary", "bladder", "nephro", "dysuria", "hematuria", "back pain"], condition: "Kidney / Urinary Condition", specialty: "General Medicine" },
  // Gastrointestinal
  { match: ["stomach", "gut", "acid", "reflux", "vomit", "nausea", "diarrhea", "diarrhoea", "constipation", "bloating", "abdomen", "abdominal", "gerd", "gastritis"], condition: "Gastrointestinal Condition", specialty: "General Medicine" },
  // Oral
  { match: ["ulcer", "mouth", "oral", "tongue", "gum", "sore throat", "swallowing", "jaw"], condition: "Oral Condition", specialty: "Dentistry & Oral Medicine" },
  // Skin
  { match: ["rash", "skin", "mole", "itch", "patch", "acne", "lesion", "pigment", "spot", "blister", "burn", "eczema", "psoriasis"], condition: "Skin Condition", specialty: "Dermatology" },
  // Breast
  { match: ["breast", "lump", "nipple", "mammogram"], condition: "Breast Condition", specialty: "Gynaecology" },
  // Diabetes
  { match: ["fatigue", "thirst", "pee", "urinate", "blood sugar", "glucose", "insulin", "tired all the time", "blurred vision", "slow healing"], condition: "Diabetes", specialty: "General Medicine" },
  // Asthma / Respiratory
  { match: ["breath", "wheeze", "chest", "cough", "inhaler", "shortness of breath", "chest tightness", "asthma", "bronchitis", "phlegm", "mucus"], condition: "Asthma", specialty: "General Medicine" },
  // Hypertension / Cardiovascular
  { match: ["blood pressure", "headache", "dizzy", "dizziness", "palpitation", "heart racing", "high bp", "hypertension", "migraine", "fainting", "nosebleed"], condition: "Hypertension", specialty: "Cardiology" },
  // Arthritis / Musculoskeletal
  { match: ["stiff joint", "arthritis", "rheumatism", "osteoarthritis", "rheumatoid", "joint pain"], condition: "Arthritis", specialty: "General Medicine" },
  // Obesity / Metabolic
  { match: ["weight", "fat", "heavy", "diet", "bmi", "overweight", "obese", "belly fat", "appetite"], condition: "Obesity", specialty: "General Medicine" },
  // Eye
  { match: ["eye", "blurry", "red eye", "dry eye", "watery eye", "double vision", "floaters", "eye pain", "eye strain"], condition: "Eye Condition", specialty: "Ophthalmology" },
  // Women's health
  { match: ["period", "menstrual", "pregnancy", "pregnant", "ovary", "pcos", "menopause", "cramps", "irregular period"], condition: "Gynaecological Condition", specialty: "Gynaecology" },
  // General pain / fever
  { match: ["fever", "temperature", "chills", "nausea", "vomiting", "stomach", "abdominal pain"], condition: "General Illness", specialty: "General Medicine" },
  // Numbness / Neurological
  { match: ["numb", "tingling", "numbness", "pins and needles", "weakness", "tremor", "seizure", "memory loss", "confusion"], condition: "Neurological Condition", specialty: "General Medicine" },
];

// ─── Specialty Name Keyword Map ───────────────────────────────────────────────

/**
 * Maps natural-language specialty requests to canonical specialty names.
 * Used when user asks "I need a heart doctor" etc.
 */
export const SPECIALTY_KEYWORDS = [
  { match: ["dermatolog", "skin doctor", "dermatology", "skin check"], specialty: "Dermatology" },
  { match: ["oncolog", "cancer doctor", "oncology", "cancer specialist", "doctor for cancer", "doctor for a cancer"], specialty: "Oncology" },
  { match: ["ophthalmolog", "eye doctor", "ophthalmology", "eye specialist"], specialty: "Ophthalmology" },
  { match: ["dentist", "dental", "tooth", "teeth", "oral medicine"], specialty: "Dentistry & Oral Medicine" },
  { match: ["general physician", "general doctor", "gp", "general medicine", "family doctor"], specialty: "General Medicine" },
  { match: ["radiolog", "radiology", "scan doctor"], specialty: "Radiology" },
  { match: ["cardiolog", "heart doctor", "cardiology", "heart specialist"], specialty: "Cardiology" },
  { match: ["gynaecolog", "gynecolog", "women doctor", "gynaecology", "gynecology"], specialty: "Gynaecology" },
];

// ─── Condition → Specialty Map ────────────────────────────────────────────────

/** Maps detected condition names to the canonical specialty for doctor recommendations. */
export const CONDITION_SPECIALTY_MAP: Record<string, string> = {
  Cancer: "Oncology",
  Diabetes: "General Medicine",
  Asthma: "General Medicine",
  Hypertension: "Cardiology",
  Arthritis: "General Medicine",
  Obesity: "General Medicine",
  "Eye Condition": "Ophthalmology",
  "Gynaecological Condition": "Gynaecology",
  "General Illness": "General Medicine",
  "Neurological Condition": "General Medicine",
  "Kidney / Urinary Condition": "General Medicine",
  "Gastrointestinal Condition": "General Medicine",
  "Oral Condition": "Dentistry & Oral Medicine",
  "Skin Condition": "Dermatology",
  "Breast Condition": "Gynaecology",
};
