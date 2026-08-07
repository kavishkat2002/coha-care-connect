import { createFileRoute } from "@tanstack/react-router";
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
import { cn } from "@/lib/utils";

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

  const run = async () => {
    setBusy(true);
    setResult(null);
    setResult(await analyseMedicalImage(region));
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

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center">
              <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium">Choose an image or drop it here</span>
              <span className="text-xs text-muted-foreground">JPG or PNG · up to 20 MB</span>
              <input type="file" accept="image/*" className="sr-only" />
            </label>

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
                    A highlighted overlay is generated on the uploaded image to show the region the
                    model attended to. Overlay rendering activates with the live model.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Clinical explanation</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{result.explanation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Recommendation</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {result.recommendation.map((r) => (
                      <li key={r}>• {r}</li>
                    ))}
                  </ul>
                </div>
                <AiDisclaimer />
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
