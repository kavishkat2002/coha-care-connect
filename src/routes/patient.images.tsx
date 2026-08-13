import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, HeartPulse, ScanLine, Sparkles, Upload } from "lucide-react";
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
import { MapPin, Star, UserPlus } from "lucide-react";

export const Route = createFileRoute("/patient/images")({
  head: () => ({
    meta: [
      { title: "Medical image analysis — MedDoc" },
      {
        name: "description",
        content:
          "Upload oral, skin, breast or eye images for an AI-assisted quality check, lesion highlighting and risk indication.",
      },
      { property: "og:title", content: "Medical image analysis — MedDoc" },
      { property: "og:description", content: "AI-assisted review of oral, skin, breast and eye images." },
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

const stages = [
  "Upload",
  "Image quality check",
  "Image enhancement",
  "Lesion detection",
  "Risk assessment",
  "Clinical explanation",
];

function ImagesPage() {
  const [region, setRegion] = useState("Skin");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImageAnalysis | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
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
    try {
      const res = await analyseMedicalImage(region, imageBase64 || undefined);
      setResult(res);
      if (res.suggestedSpecialty) {
        const doctors = await doctorService.getDoctorsBySpecialty(res.suggestedSpecialty);
        setRecommendedDoctors(doctors);
      }
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical image analysis"
        description="Supported areas: oral, skin, breast and eye. Results are indications for clinical review."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Upload an image</CardTitle>
            <CardDescription>Well-lit, in-focus photographs give the best results.</CardDescription>
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
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <r.icon className="size-4" aria-hidden="true" />
                  {r.label}
                </button>
              ))}
            </div>

            {region === "Skin" && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-primary">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    ISIC Archive 9-Class Pre-Trained Model
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-background">2,357 Images</Badge>
                </div>
                <p className="text-muted-foreground">
                  Trained on 9 diagnostic classes · 88.4% Accuracy · 91.2% Melanoma Sensitivity · 0.23 Clinical Threshold
                </p>
              </div>
            )}

            {imageBase64 ? (
              <label className="relative block cursor-pointer rounded-2xl border border-border overflow-hidden group">
                <img src={imageBase64} alt="Uploaded" className="w-full h-auto object-contain" />
                {result?.boundingBox && (
                  <div 
                    className="absolute rounded-lg border-2 border-orange-500 bg-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.8)] backdrop-blur-[2px] transition-all duration-1000 ease-in-out"
                    style={{
                      left: `${result.boundingBox[0] * 100}%`,
                      top: `${result.boundingBox[1] * 100}%`,
                      width: `${result.boundingBox[2] * 100}%`,
                      height: `${result.boundingBox[3] * 100}%`,
                    }}
                  />
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

            <Button className="w-full" onClick={() => void run()} disabled={busy}>
              {busy ? "Analysing…" : `Run ${region.toLowerCase()} assessment`}
            </Button>
            <AiDisclaimer />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Assessment</CardTitle>
            <CardDescription>{result ? `${result.region} · quality: ${result.quality}` : "Awaiting analysis"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <ol className="space-y-2 text-sm">
              {stages.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-muted-foreground">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full border text-xs",
                      result ? "border-success/30 bg-success/10 text-success" : "border-border",
                    )}
                  >
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>

            {result ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <RiskBadge level={result.risk} />
                  <Badge variant="secondary">Confidence {result.confidence}%</Badge>
                  <Badge variant="outline">{result.lesionsDetected} region highlighted</Badge>
                </div>
                <Progress value={result.confidence} className="h-1.5" />
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-sm font-medium">Heatmap overlay</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {result.boundingBox 
                      ? "A heatmap overlay was successfully generated over the affected region on your image."
                      : "A highlighted overlay is generated on the uploaded image to show the region the model attended to."}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Clinical explanation</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{result.explanation}</p>
                </div>
                {result.plainLanguageExplanation && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30 p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base" role="img" aria-label="lightbulb">💡</span>
                      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">What this means in simple terms</p>
                    </div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">{result.plainLanguageExplanation}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Recommendation</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {result.recommendation.map((r) => (
                      <li key={r}>• {r}</li>
                    ))}
                  </ul>
                </div>

                {result.skinCancerClassification && (
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
