import { createFileRoute } from "@tanstack/react-router";
import { 
  Upload, TrendingDown, Brain, HeartPulse, CheckCircle2, 
  AlertTriangle, HelpCircle, Activity, ArrowRight, ShieldCheck,
  FileSpreadsheet, ClipboardList, RefreshCw, BarChart2
} from "lucide-react";
import { useState, useEffect } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ReportItem } from "@/data/mock";
import { analyseMedicalReport, type ReportAnalysis } from "@/services/ai.service";
import { patientService } from "@/services/patient.service";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/reports")({
  head: () => ({
    meta: [
      { title: "Medical report analysis — MedDoc" },
      {
        name: "description",
        content:
          "Upload blood, MRI, CT, biopsy or laboratory reports and get abnormal values highlighted and explained in plain language.",
      },
      { property: "og:title", content: "Medical report analysis — MedDoc" },
      { property: "og:description", content: "Understand your medical reports in plain language." },
    ],
  }),
  component: ReportsPage,
});

const PIPELINE_STAGES = [
  { name: "File Validation", desc: "Verifying document structure, image clarity and file boundaries.", agent: "Document Agent" },
  { name: "OCR & Text Extraction", desc: "Extracting raw text characters and numerical tokens from document layout.", agent: "Extraction Agent" },
  { name: "Type Classification", desc: "Determining clinical report category and setting diagnostic rules.", agent: "Document Agent" },
  { name: "Structured Parameter Mapping", desc: "Mapping raw metrics to standardized clinical terms and LOINC codes.", agent: "Normalization Agent" },
  { name: "Reference Normalization", desc: "Preserving laboratory local reference ranges and normalizing units.", agent: "Reference Agent" },
  { name: "Clinical Pattern Recognition", desc: "Aggregating related test fields to check for multi-factor clinical patterns.", agent: "Pattern Agent" },
  { name: "Safety & RAG Verification", desc: "Cross-referencing findings against NICE guidelines and checking for critical alerts.", agent: "Safety & RAG Agent" },
];

const mockTrends = {
  "Hemoglobin": [
    { date: "Jan 12, 2026", value: 12.8, unit: "g/dL", status: "normal" },
    { date: "May 20, 2026", value: 12.1, unit: "g/dL", status: "normal" },
    { date: "Aug 19, 2026", value: 11.2, unit: "g/dL", status: "low" }
  ],
  "MCV (Mean Corpuscular Volume)": [
    { date: "Jan 12, 2026", value: 85, unit: "fL", status: "normal" },
    { date: "May 20, 2026", value: 81, unit: "fL", status: "normal" },
    { date: "Aug 19, 2026", value: 74, unit: "fL", status: "low" }
  ],
  "Serum Ferritin": [
    { date: "Jan 12, 2026", value: 45, unit: "ng/mL", status: "normal" },
    { date: "May 20, 2026", value: 22, unit: "ng/mL", status: "normal" },
    { date: "Aug 19, 2026", value: 9, unit: "ng/mL", status: "low" }
  ]
};

const loadPdfJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      resolve(pdfjsLib);
    };
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
};

function ReportsPage() {
  const [busy, setBusy] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<number>(0);
  const [result, setResult] = useState<ReportAnalysis | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("Uploaded Report");
  const [selectedTrendMetric, setSelectedTrendMetric] = useState<string>("Hemoglobin");

  const [aiCredits, setAiCredits] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meddoc_ai_credits");
      if (saved) return parseInt(saved, 10);
    }
    return 50;
  });
  const [patientId, setPatientId] = useState<string>("p1");

  useEffect(() => {
    async function load() {
      const data = await patientService.getReports();
      setReports(data);
      const p = await patientService.getPatientProfile();
      if (p?.id) {
        setPatientId(p.id);
        const m = await patientService.getEPassMembership(p.id);
        if (m && typeof m.ai_credits === "number") {
          setAiCredits(m.ai_credits);
          localStorage.setItem("meddoc_ai_credits", m.ai_credits.toString());
        }
      }
    }
    load();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const reader = new FileReader();

      if (isPdf) {
        setBusy(true);
        reader.onloadend = async () => {
          try {
            const pdfjsLib = await loadPdfJs();
            const typedarray = new Uint8Array(reader.result as ArrayBuffer);
            const loadingTask = pdfjsLib.getDocument({ data: typedarray });
            const pdf = await loadingTask.promise;
            
            // Render first page onto canvas
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            if (context) {
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              await page.render(renderContext).promise;
              const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
              setImageBase64(dataUrl);
            }
          } catch (error) {
            console.error("PDF parsing error:", error);
            alert("Could not extract image from PDF. Please upload a clear JPG/PNG instead.");
          } finally {
            setBusy(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const max_size = 1200; 
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
            
            const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            setImageBase64(dataUrl);
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      
      setResult(null);
      setPipelineStage(0);
    }
  };

  const run = async () => {
    if (!imageBase64 && !result) return;
    if (aiCredits < 100) {
      toast.error("Insufficient credits. Medical report analysis costs 100 credits. Please purchase or upgrade your MedDoc ePass plan to continue.", {
        description: `Your balance: ${aiCredits} credits. Cost: 100 credits.`
      });
      return;
    }

    setBusy(true);
    setResult(null);
    setPipelineStage(1);

    const nextCredits = Math.max(0, aiCredits - 100);
    setAiCredits(nextCredits);
    localStorage.setItem("meddoc_ai_credits", nextCredits.toString());
    void patientService.updateAICredits(patientId, nextCredits);

    // Simulate multi-stage pipeline stepper
    for (let i = 1; i <= PIPELINE_STAGES.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 900));
      setPipelineStage(i);
    }

    try {
      const res = await analyseMedicalReport(fileName, imageBase64 || undefined);
      setResult(res);
      setPipelineStage(PIPELINE_STAGES.length + 1);
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical reports analysis"
        description="Extract metrics, verify clinical ranges, map patterns and track long-term health trends."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="size-4 text-primary" />
                Upload clinical report
              </CardTitle>
              <CardDescription>Drag and drop or select an image of your clinical report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {imageBase64 ? (
                <label className="relative block cursor-pointer rounded-2xl border border-border overflow-hidden group">
                  <img src={imageBase64} alt="Uploaded report" className="w-full h-auto object-contain max-h-[300px]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white">
                    <Upload className="size-8 mb-2" aria-hidden="true" />
                    <span className="text-sm font-medium">Change report</span>
                  </div>
                  <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleFileChange} />
                </label>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center hover:bg-muted/80 transition-colors">
                  <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm font-medium font-sans">Choose a report scan/photo/PDF</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG or PDF · up to 20 MB</span>
                  <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleFileChange} />
                </label>
              )}

              <Button
                className="w-full"
                disabled={busy || (!imageBase64 && !result)}
                onClick={() => void run()}
              >
                {busy ? `Running Pipeline (Stage ${pipelineStage}/${PIPELINE_STAGES.length})…` : "Analyze report"}
              </Button>
              <AiDisclaimer />
            </CardContent>
          </Card>

          {/* Stepper Pipeline Card */}
          {pipelineStage > 0 && (
            <Card className="shadow-soft overflow-hidden border-sky-500/20">
              <CardHeader className="bg-sky-500/5 dark:bg-sky-950/10 border-b border-sky-500/10">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                    <Brain className="size-4 animate-pulse" />
                    Multi-Stage Medical Agent Pipeline
                  </span>
                  <span className="text-xs font-mono bg-sky-500/20 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-full">
                    {busy ? "Active Processing" : "Pipeline Completed"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ol className="relative border-l border-border ml-3.5 space-y-4">
                  {PIPELINE_STAGES.map((s, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = pipelineStage > stepNum;
                    const isActive = pipelineStage === stepNum;
                    const isPending = pipelineStage < stepNum;

                    return (
                      <li key={idx} className="mb-2 ml-6 text-left">
                        <span className={`absolute -left-3.5 flex size-7 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                          isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                          isActive ? "bg-sky-500 border-sky-500 text-white animate-pulse" :
                          "bg-muted border-border text-muted-foreground"
                        }`}>
                          {isCompleted ? "✓" : stepNum}
                        </span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-xs font-semibold ${isActive ? "text-sky-600 dark:text-sky-400" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                              {s.name}
                            </h4>
                            <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                              {s.agent}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Diagnostic Results Card */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="size-4 text-primary" />
                  Structured Diagnostic Summary
                </CardTitle>
                <CardDescription>
                  {result ? `${result.fileName}` : "Upload and run the extraction engine to display results."}
                </CardDescription>
              </div>
              {result && (
                <div className="text-right">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                    {result.documentType}
                  </Badge>
                  <span className="block text-[10px] text-muted-foreground mt-1">
                    Confidence: {(result.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {result ? (
              <>
                {/* Urgent Safety Alarm Block */}
                {result.criticalFlags && result.criticalFlags.length > 0 && (
                  <div className="rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-950/20 p-3 text-xs flex items-center gap-2.5 animate-pulse text-red-800 dark:text-red-300 font-semibold shadow-sm">
                    <AlertTriangle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                    <span>⚠️ CRITICAL: URGENT CLINICAL ATTENTION MAY BE REQUIRED</span>
                  </div>
                )}

                {/* Overall interpretation */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Interpretation</h4>
                  <p className="text-xs leading-relaxed text-foreground bg-muted/30 border border-border/40 p-3 rounded-xl">
                    {result.overallInterpretation}
                  </p>
                </div>

                {/* Structured results table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Parameters Extracted</h4>
                  <div className="border border-border/40 rounded-xl overflow-hidden bg-background">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="text-xs py-2 h-8">Test Parameter</TableHead>
                          <TableHead className="text-xs py-2 h-8 text-right">Value</TableHead>
                          <TableHead className="text-xs py-2 h-8 text-right">Ref Range</TableHead>
                          <TableHead className="text-xs py-2 h-8 text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.results.map((r, i) => {
                          const isHigh = r.flag === "high";
                          const isLow = r.flag === "low";
                          const isCritical = r.flag === "critical";
                          
                          return (
                            <TableRow key={i} className="hover:bg-muted/10">
                              <TableCell className="py-2.5">
                                <div className="font-semibold text-xs text-foreground">{r.testName}</div>
                                {r.loincCode && (
                                  <div className="text-[9px] text-muted-foreground font-mono">
                                    LOINC: <a href={`https://loinc.org/${r.loincCode}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">{r.loincCode}</a>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right py-2.5">
                                <span className={`text-xs font-bold ${isCritical ? "text-red-700 dark:text-red-400" : isHigh ? "text-red-600" : isLow ? "text-amber-600" : "text-foreground"}`}>
                                  {r.value} {r.unit}
                                </span>
                                {r.normalized && (
                                  <span className="block text-[9px] text-muted-foreground font-mono">
                                    Norm: {r.normalized.value} {r.normalized.unit}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right text-[11px] text-muted-foreground py-2.5 font-mono">
                                {r.referenceRange.rawRange}
                              </TableCell>
                              <TableCell className="text-right py-2.5">
                                <Badge 
                                  variant="outline" 
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                    isCritical ? "bg-red-500/10 text-red-600 border-red-500/20 animate-pulse" :
                                    isHigh ? "bg-red-500/5 text-red-500 border-red-500/10" :
                                    isLow ? "bg-amber-500/5 text-amber-600 border-amber-500/10" :
                                    "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
                                  }`}
                                >
                                  {r.flag.toUpperCase()}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Patterns Detected */}
                {result.patterns && result.patterns.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clinical Patterns Identified</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.patterns.map((pat, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-400">
                          <Activity className="size-3.5 text-amber-500" />
                          {pat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plain language summary */}
                {result.plainLanguage && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30 p-4 space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base" role="img" aria-label="lightbulb">💡</span>
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">What this means in simple terms</p>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-sans">{result.plainLanguage}</p>
                  </div>
                )}

                {/* Suggested specialty & recommendations */}
                <div className="grid gap-3 sm:grid-cols-2 bg-muted/20 border border-border/40 p-3.5 rounded-xl">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Suggested Specialty</span>
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-primary" />
                      {result.suggestedSpecialty}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Evidence Recommendations</span>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <span className="text-emerald-500 font-bold">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <AiDisclaimer />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center space-y-2">
                <ClipboardList className="size-10 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Highlighted abnormal values, normalized clinical parameters, and plain-language summaries appear here once extraction is complete.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Longitudinal Trends Tracker Widget */}
      {result && result.results.some(r => mockTrends[r.testName as keyof typeof mockTrends]) && (
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="size-4 text-primary" />
                  Longitudinal Patient Health Trends
                </CardTitle>
                <CardDescription>Track parameter fluctuations over historical timelines to detect long-term patterns.</CardDescription>
              </div>
              <div className="flex gap-2">
                {result.results
                  .filter(r => mockTrends[r.testName as keyof typeof mockTrends])
                  .map(r => (
                    <Button 
                      key={r.testName} 
                      size="sm" 
                      variant={selectedTrendMetric === r.testName ? "default" : "outline"}
                      onClick={() => setSelectedTrendMetric(r.testName)}
                      className="text-xs h-7 py-1 px-2.5 rounded-full"
                    >
                      {r.testName.split(" ")[0]}
                    </Button>
                  ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Trend Timeline Steps */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Historical Date</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Recorded Value</span>
                </div>
                <div className="space-y-3">
                  {mockTrends[selectedTrendMetric as keyof typeof mockTrends]?.map((t, idx) => {
                    const isLow = t.status === "low";
                    const isHigh = t.status === "high";
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/10">
                        <span className="text-xs font-medium text-foreground">{t.date}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold ${isLow || isHigh ? "text-amber-600" : "text-foreground"}`}>
                            {t.value} {t.unit}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              isLow || isHigh ? "bg-amber-500/5 text-amber-600 border-amber-500/10" : "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
                            }`}
                          >
                            {t.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trend Analysis Box */}
              <div className="rounded-xl border border-border p-4 bg-muted/10 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Trend Interpretation</span>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <TrendingDown className="size-4 text-amber-500" />
                    Gradual Decline Warning
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Values for {selectedTrendMetric} have shown a steady decrease over the last 6 months. This trend may indicate progressive depleted stores or chronic issues, which are clinically more informative than an isolated snapshot reading.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40 mt-3 text-xs text-muted-foreground italic flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-primary shrink-0" />
                  Recommended: Request iron profile or indices panel.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stored report summary timeline */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="size-4 text-primary" />
            Longitudinal Patient Health Timeline
          </CardTitle>
          <CardDescription>Timeline history of archived clinical reports.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Archive Date</TableHead>
                <TableHead className="hidden md:table-cell">Clinical Summary</TableHead>
                <TableHead className="text-right">Roster Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold text-xs">{r.title}</TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{r.type}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm text-xs text-muted-foreground leading-relaxed">
                    {r.summary}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={r.status === "Analysed" ? "secondary" : "outline"} className="text-[10px]">
                      {r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
