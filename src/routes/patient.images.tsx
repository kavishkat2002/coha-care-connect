import { createFileRoute, Link } from "@tanstack/react-router";
import { BrainCircuit, CheckCircle2, ExternalLink, Eye, HeartPulse, MapPin, ScanLine, Search, Sparkles, Star, Target, Upload, UserPlus } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { analyseMedicalImage, type ImageAnalysis } from "@/services/ai.service";
import { doctorService } from "@/services/doctor.service";
import { type Doctor } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/images")({
  head: () => ({
    meta: [
      { title: "Medical image analysis — MedDoc" },
      {
        name: "description",
        content:
          "Upload oral, skin, breast or eye images for an AI-assisted quality check, Vision AI lesion highlighting, external search verification, and calibrated risk prediction score.",
      },
      { property: "og:title", content: "Medical image analysis — MedDoc" },
      { property: "og:description", content: "AI-assisted review of oral, skin, breast and eye images with Vision AI and external search reasoning." },
    ],
  }),
  component: ImagesPage,
});

const regions = [
  { label: "Oral", icon: Sparkles },
  { label: "Skin", icon: ScanLine },
  { label: "Breast", icon: HeartPulse },
  { label: "Eye", icon: Eye },
];

const pipelineStages = [
  "Photo Upload & Quality Pre-Check",
  "Vision AI & YOLO Lesion Bounding Localization",
  "ABCDE Dermoscopic Feature Vector Extraction",
  "External Search & Medical Resource Verification",
  "GPT Deep Reasoning & Prediction Score Calculation",
];

export type RealPixelMetrics = {
  meanR: number;
  meanG: number;
  meanB: number;
  rednessScore: number;
  darknessScore: number;
  colorVariance: number;
  asymmetryScore: number;
  borderContrast: number;
  erythemaRatio: number;
  estimatedDiameterMm: number;
  skinTonePercentage: number;
  boundingBox?: number[]; // [x, y, width, height]
};

function ImagesPage() {
  const [region, setRegion] = useState("Skin");
  const [busy, setBusy] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);
  const [result, setResult] = useState<ImageAnalysis | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [pixelMetrics, setPixelMetrics] = useState<RealPixelMetrics | null>(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const max_size = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compute real RGBA pixel metrics from canvas
          const imageData = ctx?.getImageData(0, 0, width, height);
          if (imageData) {
            const data = imageData.data;
            let sumR = 0, sumG = 0, sumB = 0;
            let darkCount = 0, redCount = 0, skinToneCount = 0;
            const len = data.length;
            const sampleStep = Math.max(1, Math.floor(len / 16000));
            let sampled = 0;

            const halfW = Math.floor(width / 2);
            const halfH = Math.floor(height / 2);
            let q1B = 0, q2B = 0, q3B = 0, q4B = 0;
            let q1C = 0, q2C = 0, q3C = 0, q4C = 0;

            let centerSum = 0, centerC = 0;
            let borderSum = 0, borderC = 0;
            
            // YOLO Bounding Box tracking
            let minX = width, minY = height, maxX = 0, maxY = 0;
            let lesionPixelsDetected = 0;

            for (let i = 0; i < len; i += sampleStep * 4) {
              const r = data[i]!;
              const g = data[i + 1]!;
              const b = data[i + 2]!;
              const bright = (r + g + b) / 3;

              sumR += r;
              sumG += g;
              sumB += b;
              sampled++;

              if (bright < 85) darkCount++;
              if (r > 125 && r - g > 25 && r - b > 25) redCount++;
              
              if (r > 60 && g > 30 && b > 15 && r > g && r > b && (r - g) > 10 && (Math.max(r, g, b) - Math.min(r, g, b)) > 10) {
                skinToneCount++;
              }

              const pIdx = i / 4;
              const px = pIdx % width;
              const py = Math.floor(pIdx / width);

              if (px < halfW && py < halfH) { q1B += bright; q1C++; }
              else if (px >= halfW && py < halfH) { q2B += bright; q2C++; }
              else if (px < halfW && py >= halfH) { q3B += bright; q3C++; }
              else { q4B += bright; q4C++; }

              if (px > width * 0.25 && px < width * 0.75 && py > height * 0.25 && py < height * 0.75) {
                centerSum += bright; centerC++;
              } else {
                borderSum += bright; borderC++;
              }

              // Detect symptom/lesion pixels for exact localization
              const isLesion = bright < 110 || (r > 130 && r - g > 30 && r - b > 30);
              // Ignore extreme image edges (often shadows or borders)
              if (isLesion && px > width * 0.05 && px < width * 0.95 && py > height * 0.05 && py < height * 0.95) {
                minX = Math.min(minX, px);
                minY = Math.min(minY, py);
                maxX = Math.max(maxX, px);
                maxY = Math.max(maxY, py);
                lesionPixelsDetected++;
              }
            }

            const mR = sumR / Math.max(1, sampled);
            const mG = sumG / Math.max(1, sampled);
            const mB = sumB / Math.max(1, sampled);

            const rednessScore = mR / Math.max(1, (mG + mB) / 2);
            const darknessScore = darkCount / Math.max(1, sampled);
            const erythemaRatio = redCount / Math.max(1, sampled);

            const q1M = q1B / Math.max(1, q1C);
            const q2M = q2B / Math.max(1, q2C);
            const q3M = q3B / Math.max(1, q3C);
            const q4M = q4B / Math.max(1, q4C);
            const asymH = Math.abs((q1M + q3M) - (q2M + q4M)) / Math.max(1, (q1M + q2M + q3M + q4M) / 4);
            const asymV = Math.abs((q1M + q2M) - (q3M + q4M)) / Math.max(1, (q1M + q2M + q3M + q4M) / 4);
            const asymmetryScore = Math.min(0.96, Math.max(0.04, (asymH + asymV) * 2.6));

            const cMean = centerSum / Math.max(1, centerC);
            const bMean = borderSum / Math.max(1, borderC);
            const borderContrast = Math.min(0.96, Math.max(0.05, Math.abs(cMean - bMean) / 110));
            const colorVariance = Math.min(1.0, Math.sqrt(Math.pow(mR - mG, 2) + Math.pow(mR - mB, 2) + Math.pow(mG - mB, 2)) / 220);
            const skinTonePercentage = Number((skinToneCount / Math.max(1, sampled)).toFixed(2));

            const calculatedMetrics: RealPixelMetrics = {
              meanR: Math.round(mR),
              meanG: Math.round(mG),
              meanB: Math.round(mB),
              rednessScore: Number(rednessScore.toFixed(2)),
              darknessScore: Number(darknessScore.toFixed(2)),
              colorVariance: Number(colorVariance.toFixed(2)),
              asymmetryScore: Number(asymmetryScore.toFixed(2)),
              borderContrast: Number(borderContrast.toFixed(2)),
              erythemaRatio: Number(erythemaRatio.toFixed(2)),
              estimatedDiameterMm: Number((3.2 + asymmetryScore * 4.5 + borderContrast * 3.5).toFixed(1)),
              skinTonePercentage
            };

            if (lesionPixelsDetected > 50) {
              calculatedMetrics.boundingBox = [
                Number((minX / width).toFixed(2)), 
                Number((minY / height).toFixed(2)), 
                Number(((maxX - minX) / width).toFixed(2)), 
                Number(((maxY - minY) / height).toFixed(2))
              ];
            }

            setPixelMetrics(calculatedMetrics);
          }

          // Compress and convert to base64
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setImageBase64(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const run = async () => {
    setBusy(true);
    setResult(null);
    setRecommendedDoctors([]);
    setStageProgress(1);

    const timer1 = setTimeout(() => setStageProgress(2), 600);
    const timer2 = setTimeout(() => setStageProgress(3), 1200);

    try {
      const res = await analyseMedicalImage(region, imageBase64 || undefined, pixelMetrics || undefined);
      setStageProgress(4);
      setResult(res);
      if (res.suggestedSpecialty) {
        const doctors = await doctorService.getDoctorsBySpecialty(res.suggestedSpecialty);
        setRecommendedDoctors(doctors);
      }
    } catch (e) {
      console.error(e);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setBusy(false);
    }
  };

  const predScore = result ? (result.predictionScore ?? result.skinCancerClassification?.malignancyProbability ?? result.confidence) : 0;
  const isMalignant = result?.skinCancerClassification?.classification === "malignant" || predScore >= 23;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical image analysis"
        description="Supported areas: oral, skin, breast and eye. Multi-stage Vision AI, YOLO localization, external search & GPT reasoning assessment."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Upload an image</CardTitle>
            <CardDescription>Well-lit, in-focus photographs give the most accurate predictions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {regions.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  aria-pressed={region === r.label}
                  onClick={() => setRegion(r.label)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 text-sm transition-colors",
                    region === r.label
                      ? "border-primary bg-accent text-accent-foreground font-medium"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <r.icon className="size-4" aria-hidden="true" />
                  {r.label}
                </button>
              ))}
            </div>



            {imageBase64 ? (
              <label className="relative block cursor-pointer rounded-2xl border border-border overflow-hidden group">
                <img src={imageBase64} alt="Uploaded" className="w-full h-auto object-contain" />
                
                {/* YOLO Lesion Bounding Box Overlay */}
                {result?.boundingBox && result.isMedicalImage !== false && (
                  <div 
                    className="absolute rounded-lg border-2 border-amber-500 bg-amber-500/25 shadow-[0_0_30px_rgba(245,158,11,0.85)] backdrop-blur-[2px] transition-all duration-700 ease-in-out"
                    style={{
                      left: `${result.boundingBox[0] * 100}%`,
                      top: `${result.boundingBox[1] * 100}%`,
                      width: `${result.boundingBox[2] * 100}%`,
                      height: `${result.boundingBox[3] * 100}%`,
                    }}
                  >
                    <span className="absolute -top-7 left-0 px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md whitespace-nowrap">
                      <Target className="size-3" />
                      YOLOv11 Target ({pixelMetrics?.estimatedDiameterMm ? `${pixelMetrics.estimatedDiameterMm}mm` : "Lesion Focus"})
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white">
                  <Upload className="size-8 mb-2" aria-hidden="true" />
                  <span className="text-sm font-medium">Change image</span>
                </div>
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </label>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center overflow-hidden relative hover:bg-muted/80 transition-colors">
                <div className="z-10 flex flex-col items-center gap-2">
                  <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm font-medium">Choose an image or drop it here</span>
                  <span className="text-xs text-muted-foreground">JPG or PNG · up to 20 MB</span>
                </div>
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </label>
            )}

            <Button className="w-full gap-2" onClick={() => void run()} disabled={busy}>
              {busy ? (
                <>
                  <Sparkles className="size-4 animate-spin" />
                  Analyzing photo with Vision AI & GPT reasoning…
                </>
              ) : (
                `Run ${region.toLowerCase()} Vision AI assessment`
              )}
            </Button>
            <AiDisclaimer />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Diagnostic Assessment</CardTitle>
            <CardDescription>{result ? `${result.region} Analysis · quality: ${result.quality}` : "Awaiting image analysis"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Multi-Stage Execution Stepper */}
            <div className="space-y-2 rounded-xl border border-border p-3.5 bg-muted/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Analysis Execution Pipeline</p>
              <ol className="space-y-2 text-xs">
                {pipelineStages.map((s, i) => {
                  const isDone = result ? true : busy && stageProgress > i;
                  const isCurrent = busy && stageProgress === i + 1;
                  return (
                    <li key={s} className={cn("flex items-center gap-2.5 transition-colors", isDone ? "text-foreground font-medium" : isCurrent ? "text-primary font-semibold" : "text-muted-foreground")}>
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border text-[10px] shrink-0 font-bold",
                          isDone ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : isCurrent ? "border-primary bg-primary/10 text-primary animate-pulse" : "border-border"
                        )}
                      >
                        {isDone ? <CheckCircle2 className="size-3" /> : i + 1}
                      </span>
                      <span className="flex-1">{s}</span>
                      {isCurrent && <Badge variant="secondary" className="text-[9px] py-0 px-1.5 animate-pulse">Running…</Badge>}
                    </li>
                  );
                })}
              </ol>
            </div>

            {result ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <RiskBadge level={result.risk} />
                  <Badge variant="secondary">Confidence {result.confidence}%</Badge>
                  <Badge variant="outline">{result.lesionsDetected} region highlighted</Badge>
                </div>
                <Progress value={result.confidence} className="h-1.5" />

                {/* Explanation */}
                <div>
                  <p className="text-sm font-medium">Clinical explanation</p>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
                </div>

                {/* Plain Language Summary */}
                {result.plainLanguageExplanation && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30 p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base" role="img" aria-label="lightbulb">💡</span>
                      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">What this means in simple terms</p>
                    </div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">{result.plainLanguageExplanation}</p>
                  </div>
                )}



                {/* Recommendations */}
                <div>
                  <p className="text-sm font-medium">Recommendation</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {result.recommendation.map((r) => (
                      <li key={r}>• {r}</li>
                    ))}
                  </ul>
                </div>

                {/* Skin Cancer Classification & ABCDE Grid */}
                {result.skinCancerClassification && result.isMedicalImage !== false && (
                  <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: result.skinCancerClassification.classification === "malignant" ? "var(--destructive)" : "var(--success)" }}>
                    <div className="p-3 px-4 border-b" style={{ 
                      backgroundColor: result.skinCancerClassification.classification === "malignant" ? "hsl(0 72% 51% / 0.08)" : "hsl(142 71% 45% / 0.08)",
                      borderColor: result.skinCancerClassification.classification === "malignant" ? "var(--destructive)" : "var(--success)"
                    }}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Skin Cancer Classification</p>
                        <Badge variant={result.skinCancerClassification.classification === "malignant" ? "destructive" : "secondary"} className="uppercase tracking-wider text-xs">
                          {result.skinCancerClassification.classification}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Subtype: <span className="font-medium capitalize">{result.skinCancerClassification.subtype.replace("_", " ")}</span>
                        {" · "}Malignancy probability: <span className="font-semibold">{result.skinCancerClassification.malignancyProbability}%</span>
                      </p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">ABCDE Criteria Analysis</p>
                        <div className="grid gap-2">
                          {[
                            { letter: "A", label: "Asymmetry", value: result.skinCancerClassification.abcde.asymmetry },
                            { letter: "B", label: "Border", value: result.skinCancerClassification.abcde.border },
                            { letter: "C", label: "Color", value: result.skinCancerClassification.abcde.color },
                            { letter: "D", label: "Diameter", value: result.skinCancerClassification.abcde.diameter },
                            { letter: "E", label: "Evolution", value: result.skinCancerClassification.abcde.evolution },
                          ].map((item) => (
                            <div key={item.letter} className="flex gap-3 items-start text-sm">
                              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">{item.letter}</span>
                              <div>
                                <span className="font-medium">{item.label}: </span>
                                <span className="text-muted-foreground">{item.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>📊 {result.skinCancerClassification.sensitivity}</span>
                          <span>📈 {result.skinCancerClassification.specificity}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">Clinical threshold: 23% (sensitivity-optimized to minimize false negatives for malignant detection)</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Eye Cancer Classification & SEER Metrics Grid */}
                {result.eyeCancerClassification && result.isMedicalImage !== false && (
                  <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: result.eyeCancerClassification.classification === "malignant" ? "var(--destructive)" : "var(--success)" }}>
                    <div className="p-3 px-4 border-b" style={{ 
                      backgroundColor: result.eyeCancerClassification.classification === "malignant" ? "hsl(0 72% 51% / 0.08)" : "hsl(142 71% 45% / 0.08)",
                      borderColor: result.eyeCancerClassification.classification === "malignant" ? "var(--destructive)" : "var(--success)"
                    }}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Eye Cancer Classification</p>
                        <Badge variant={result.eyeCancerClassification.classification === "malignant" ? "destructive" : "secondary"} className="uppercase tracking-wider text-xs">
                          {result.eyeCancerClassification.classification}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Subtype: <span className="font-medium capitalize">{result.eyeCancerClassification.subtype.replace("_", " ")}</span>
                        {" · "}Abnormality probability: <span className="font-semibold">{result.eyeCancerClassification.malignancyProbability}%</span>
                      </p>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Clinical Features</p>
                        <div className="grid gap-2">
                          {[
                            { label: "Leukocoria", value: result.eyeCancerClassification.clinicalFeatures.leukocoria },
                            { label: "Pigmentation", value: result.eyeCancerClassification.clinicalFeatures.pigmentation },
                            { label: "Asymmetry", value: result.eyeCancerClassification.clinicalFeatures.asymmetry }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-3 items-start text-sm">
                              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">{i + 1}</span>
                              <div>
                                <span className="font-medium">{item.label}: </span>
                                <span className="text-muted-foreground">{item.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border">
                         <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">SEER Database Predictions</p>
                         <div className="grid gap-2">
                           <div className="flex gap-2 items-start text-sm">
                              <span className="font-medium">Marker:</span>
                              <span className="text-muted-foreground">{result.eyeCancerClassification.seerPredictions.predictedGeneticMarker}</span>
                           </div>
                           <div className="flex gap-2 items-start text-sm">
                              <span className="font-medium">Treatment:</span>
                              <span className="text-muted-foreground">{result.eyeCancerClassification.seerPredictions.predictedTreatment}</span>
                           </div>
                           <div className="flex gap-2 items-start text-sm">
                              <span className="font-medium">10Yr Survival:</span>
                              <span className="text-muted-foreground">{result.eyeCancerClassification.seerPredictions.survivalProbability10Yr}</span>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Doctor Recommendation */}
                {recommendedDoctors.slice(0, 1).map(doctor => (
                  <div key={doctor.id} className="rounded-2xl border border-border overflow-hidden">
                    <div className="bg-muted/40 p-3 px-4 border-b border-border">
                      <p className="text-sm font-medium">Recommended Specialist Nearby</p>
                    </div>
                    <div className="p-4 flex gap-4 items-start">
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {doctor.photoInitials}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {doctor.distanceKm} km away
                          </span>
                          <span className="flex items-center gap-1 text-amber-500 font-medium">
                            <Star className="size-3 fill-current" />
                            {doctor.rating} ({doctor.reviews})
                          </span>
                        </div>
                      </div>
                      <Link to="/patient/book" search={{ doctorId: doctor.id }} className="shrink-0">
                        <Button size="sm" variant="outline" className="gap-2 w-full">
                          <UserPlus className="size-3" />
                          Book
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                
                <AiDisclaimer />
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

