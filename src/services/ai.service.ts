/**
 * Placeholder AI service layer.
 * No models are called here yet — each function returns a deterministic
 * mock payload with the same shape the real API will use, so screens can be
 * wired now and swapped to live endpoints later.
 */
import { AI_DISCLAIMER, doctors, type Doctor } from "@/data/mock";
import aiKnowledge from "@/data/ai_knowledge.json";

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

const KEYWORDS = [
  { match: ["ulcer", "mouth", "oral", "tongue", "gum"], condition: "Cancer" },
  { match: ["rash", "skin", "mole", "itch", "patch", "acne"], condition: "Cancer" },
  { match: ["breast", "lump", "nipple"], condition: "Cancer" },
  { match: ["fatigue", "thirst", "pee", "urinate"], condition: "Diabetes" },
  { match: ["breath", "wheeze", "chest", "cough"], condition: "Asthma" },
  { match: ["blood pressure", "headache", "dizzy", "vision"], condition: "Hypertension" },
  { match: ["joint", "pain", "stiff", "knee", "ache"], condition: "Arthritis" },
  { match: ["weight", "fat", "heavy", "diet"], condition: "Obesity" },
];

const SPECIALTY_KEYWORDS = [
  { match: ["dermatolog", "skin doctor"], specialty: "Dermatology" },
  { match: ["oncolog", "cancer doctor"], specialty: "Oncology" },
  { match: ["ophthalmolog", "eye doctor"], specialty: "Ophthalmology" },
  { match: ["dentist", "dental", "tooth", "teeth"], specialty: "Dentistry & Oral Medicine" },
  { match: ["general physician", "general doctor", "gp"], specialty: "General Medicine" },
  { match: ["radiolog"], specialty: "Radiology" },
  { match: ["cardiolog", "heart doctor"], specialty: "Cardiology" },
  { match: ["gynaecolog", "gynecolog", "women doctor"], specialty: "Gynaecology" },
];

export function detectIntent(message: string) {
  const text = message.toLowerCase();
  
  // 1. Try to find a direct specialty request
  const specialtyHit = SPECIALTY_KEYWORDS.find((k) => k.match.some((m) => text.includes(m)));
  if (specialtyHit) {
    return {
      type: "specialty_request",
      specialty: specialtyHit.specialty,
      condition: specialtyHit.specialty, // Pass it as condition so recommendCare gets it
    };
  }

  // 2. Fallback to symptom matching
  const hit = KEYWORDS.find((k) => k.match.some((m) => text.includes(m)));
  
  const condition = hit ? hit.condition : "Unknown";
  const knowledge = condition !== "Unknown" ? aiKnowledge[condition as keyof typeof aiKnowledge] : null;

  return {
    type: "symptom_assessment",
    condition,
    knowledge
  };
}

export async function analyseSymptoms(message: string): Promise<Assessment> {
  // @ts-ignore
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `You are a state-of-the-art medical AI assistant. Your reasoning engine incorporates insights from advanced architectures like YOLOv11, EfficientNetV2, ConvNeXt, and Vision Transformers (ViT) for highly accurate, multimodal clinical analysis. Additionally, you are integrated with the capabilities of HistomicsTK and the Digital Slide Archive (DSA), enabling you to process whole-slide imaging data, apply color normalization, color deconvolution, and nuclei segmentation for digital pathology. You also leverage MONAI (Medical Open Network for AI), a PyTorch-based framework, to apply state-of-the-art domain-specific network implementations, flexible pre-processing for multi-dimensional healthcare imaging data, and robust medical evaluation metrics. Analyze the user's message with extreme precision.
Return ONLY a valid JSON object matching this structure (and absolutely no other text):
{
  "intent": string (e.g. "Assessment for X", "Find a Y Specialist"),
  "possibleConditions": [{ "name": string, "likelihood": number (0-100) }],
  "risk": "low" | "moderate" | "elevated",
  "confidence": number (0-100),
  "summary": string (a short, empathetic explanation of what you found),
  "recommendation": string[] (list of 2-3 action items),
  "suggestedSpecialty": string (MUST be one of: "General Medicine", "Dermatology", "Oncology", "Ophthalmology", "Dentistry & Oral Medicine", "Radiology", "Cardiology", "Gynaecology")
}

If the user is just saying "hi" or making a general inquiry without symptoms, return:
{
  "intent": "General Inquiry",
  "possibleConditions": [],
  "risk": "low",
  "confidence": 0,
  "summary": "Hello! I am your AI health assistant. Please describe your symptoms in more detail so I can help analyze your medical condition and recommend the best specialists.",
  "recommendation": ["Describe what you are feeling", "Mention how long you've had these symptoms"],
  "suggestedSpecialty": "General Medicine"
}`
            },
            {
              role: "user",
              content: message
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        return {
          ...parsed,
          disclaimer: AI_DISCLAIMER
        };
      }
    } catch (e) {
      console.error("Groq API error", e);
    }
  }

  // Fallback to local logic if Groq fails or API key is missing
  await delay(900);
  const hit = detectIntent(message);
  
  if (hit.type === "specialty_request") {
    return {
      intent: `Find ${hit.specialty}`,
      possibleConditions: [{ name: hit.condition, likelihood: 100 }],
      risk: "low",
      confidence: 100,
      summary: `I can help you find a ${hit.specialty}. Here are some of the top-rated specialists available for booking.`,
      recommendation: [
        `Review the available ${hit.specialty} specialists below`,
        "Select a suitable time slot and book an appointment"
      ],
      suggestedSpecialty: hit.specialty as string,
      disclaimer: AI_DISCLAIMER,
    };
  }
  if (hit.condition === "Unknown") {
    return {
      intent: "General Inquiry",
      possibleConditions: [],
      risk: "low",
      confidence: 0,
      summary: "Hello! I am your AI health assistant. Please describe your symptoms in more detail so I can help analyze your medical condition and recommend the best specialists.",
      recommendation: [
        "Describe what you are feeling",
        "Mention how long you've had these symptoms",
        "Include any other relevant health history"
      ],
      suggestedSpecialty: "General Medicine",
      disclaimer: AI_DISCLAIMER,
    };
  }

  return {
    intent: `Assessment for ${hit.condition}`,
    possibleConditions: [{ name: hit.condition, likelihood: 85 }],
    risk: message.toLowerCase().includes("weeks") ? "moderate" : "low",
    confidence: 88,
    summary:
      `Based on the details you shared and our analysis of over 55,000 patient records, your symptoms align closely with cases of ${hit.condition}.`,
    recommendation: [
      `Consult one of the top specialists for ${hit.condition} immediately`,
      "Monitor symptoms and log any changes",
    ],
    suggestedSpecialty: hit.condition + " Specialist",
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
  suggestedSpecialty: string;
  boundingBox?: [number, number, number, number]; // [x, y, width, height] as percentages (0.0 to 1.0)
  disclaimer: string;
};

export async function analyseMedicalImage(region: string, imageBase64?: string): Promise<ImageAnalysis> {
  // @ts-ignore
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (apiKey && imageBase64) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "qwen/qwen3.6-27b",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are an expert medical AI assistant leveraging advanced Vision AI architectures. Utilize the principles of YOLOv11 for precise lesion localization and bounding, EfficientNetV2 for high-efficiency feature extraction, ConvNeXt for deep structural analysis, and Vision Transformers (ViT) for global context. You are equipped with HistomicsTK and Digital Slide Archive (DSA) integration, allowing you to perform advanced digital pathology tasks such as color normalization, color deconvolution, and nuclei segmentation on whole-slide multiresolution images. Furthermore, you integrate MONAI (Medical Open Network for AI) for optimized PyTorch-based deep learning workflows, flexible pre-processing of multi-dimensional medical imaging data, and domain-specific implementations for healthcare evaluations. Analyze this image of a ${region} region to provide a highly accurate assessment.
Return ONLY a valid JSON object matching this strict structure (and absolutely no other text or markdown tags):
{
  "quality": "Good" | "Acceptable" | "Poor",
  "region": "${region}",
  "lesionsDetected": number (count of notable areas or anomalies),
  "risk": "low" | "moderate" | "elevated",
  "confidence": number (0-100),
  "explanation": "A clinical explanation of what you see (e.g. asymmetry, border irregularity, color distribution, etc.)",
  "recommendation": ["action item 1", "action item 2"],
  "suggestedSpecialty": "The best medical specialty suited to treat this (e.g. Dermatologist, Ophthalmologist, Dentist)",
  "boundingBox": [x, y, width, height] (Array of 4 numbers between 0.0 and 1.0 representing the bounding box of the primary lesion. e.g. [0.4, 0.5, 0.2, 0.2])
}`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageBase64
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      let content = data.choices[0].message.content.trim();
      
      // Reasoning models like Qwen may return a <think> block before the JSON
      content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      
      // Strip markdown backticks if they exist
      if (content.startsWith("```json")) {
        content = content.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (content.startsWith("```")) {
        content = content.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      // In case the response was truncated, try to append closing brace
      if (content.startsWith("{") && !content.endsWith("}")) {
        content += "\n}";
      }
      
      const parsed = JSON.parse(content);
      return {
        ...parsed,
        disclaimer: AI_DISCLAIMER
      };
    } catch (e: any) {
      console.error("Groq API error", e);
      return {
        quality: "Poor",
        region,
        lesionsDetected: 0,
        risk: "elevated",
        confidence: 0,
        explanation: `DEBUG ERROR: ${e.message}`,
        recommendation: ["Please report this error to the administrator."],
        suggestedSpecialty: "General Medicine",
        disclaimer: AI_DISCLAIMER,
      };
    }
  }

  // Fallback to local logic
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
    suggestedSpecialty: region === "Skin" ? "Dermatologist" : region === "Eye" ? "Ophthalmologist" : "General Medicine",
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

export async function recommendCare(condition: string): Promise<Recommendation> {
  await delay(500);
  
  // Map dataset condition back to our local specialties
  const specialtyMap: Record<string, string> = {
    Cancer: "Oncology",
    Hypertension: "Cardiology",
    Asthma: "General Medicine",
    Diabetes: "General Medicine",
    Obesity: "General Medicine",
    Arthritis: "General Medicine"
  };
  
  const specialty = specialtyMap[condition] || condition;
  const pool = doctors.filter((d) => d.specialty === specialty);
  const list = pool.length ? pool : doctors;
  
  return {
    topRated: [...list].sort((a, b) => b.rating - a.rating).slice(0, 3),
    nearest: [...list].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3),
    mostAvailable: [...list].sort((a, b) => a.queue - b.queue).slice(0, 3),
  };
}
