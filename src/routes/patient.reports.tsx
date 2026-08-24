import { createFileRoute } from "@tanstack/react-router";
import { 
  Upload, TrendingDown, Brain, CheckCircle2, 
  AlertTriangle, HelpCircle, Activity, ArrowRight, ShieldCheck,
  FileSpreadsheet, ClipboardList, RefreshCw, BarChart2,
  Building2, CreditCard, Download, Eye, Check, FileText, Lock, Shield
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ReportItem, type TimelineItem } from "@/data/mock";
import { analyseMedicalReport, type ReportAnalysis } from "@/services/ai.service";
import { patientService } from "@/services/patient.service";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

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

const ELAB_PARTNERS = [
  { id: "nawaloka", name: "Nawaloka Lab Diagnostics", logo: "/Labs images/nawaloka.png" },
  { id: "asiri", name: "Asiri Laboratories", logo: "/Labs images/asiri lab.png" },
  { id: "durdans", name: "Durdance Lab", logo: "/Labs images/durdance.jpeg" },
  { id: "medihelp", name: "MEDIHELP", logo: "/Labs images/MEDI-HELP.jpg" },
  { id: "ninewells", name: "Ninewells Lab", logo: "/Labs images/ninewells.jpeg" },
  { id: "kings", name: "Kings Hospital Labs", logo: "/kings lab.png" }
];

const ELAB_SERVICES = [
  { id: "endorse", name: "Official Pathologist Endorsement & Signature", price: 1500, time: "2-3 Hours" },
  { id: "opinion", name: "Comprehensive Second Opinion Review", price: 3000, time: "6 Hours" },
  { id: "audit", name: "Full Diagnostic Panel Validation", price: 4500, time: "12 Hours" }
];

function ReportsPage() {
  const [busy, setBusy] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<number>(0);
  const [result, setResult] = useState<ReportAnalysis | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);

  const chunkedReports = useMemo(() => {
    const chunks: ReportItem[][] = [];
    for (let i = 0; i < reports.length; i += 2) {
      chunks.push(reports.slice(i, i + 2));
    }
    return chunks;
  }, [reports]);
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

  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareData, setCompareData] = useState<{ report1: ReportAnalysis; report2: ReportAnalysis } | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  const handleToggleCompare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCompareIds(prev => {
      if (prev.includes(title)) {
        return prev.filter(x => x !== title);
      }
      if (prev.length >= 2) {
        toast.warning("You can select a maximum of 2 reports to compare.");
        return prev;
      }
      return [...prev, title];
    });
  };

  const handleStartComparison = async () => {
    const id1 = selectedCompareIds[0];
    const id2 = selectedCompareIds[1];
    if (!id1 || !id2) return;
    setLoadingCompare(true);
    try {
      const [r1, r2] = await Promise.all([
        analyseMedicalReport(id1),
        analyseMedicalReport(id2)
      ]);
      setCompareData({ report1: r1, report2: r2 });
      setCompareModalOpen(true);
    } catch (e) {
      toast.error("Failed to fetch comparative report analysis.");
    } finally {
      setLoadingCompare(false);
    }
  };

  const matchedParameters = useMemo(() => {
    if (!compareData) return [];
    const r1 = compareData.report1;
    const r2 = compareData.report2;

    const allNames = Array.from(new Set([
      ...r1.results.map(x => x.testName),
      ...r2.results.map(x => x.testName)
    ]));

    return allNames.map(name => {
      const p1 = r1.results.find(x => x.testName === name);
      const p2 = r2.results.find(x => x.testName === name);

      let trendText = "N/A";
      let trendColor = "text-muted-foreground";

      if (p1 && p2) {
        const v1 = parseFloat(String(p1.value));
        const v2 = parseFloat(String(p2.value));
        if (!isNaN(v1) && !isNaN(v2)) {
          const diff = v2 - v1;
          const diffStr = diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
          if (diff === 0) {
            trendText = "Unchanged";
            trendColor = "text-slate-500 font-semibold";
          } else {
            const isBloodCount = name.toLowerCase().includes("hemoglobin") || name.toLowerCase().includes("ferritin") || name.toLowerCase().includes("mcv");
            const isFavorableIncrease = isBloodCount && diff > 0;
            if (isFavorableIncrease) {
              trendText = `${diffStr} (Improved)`;
              trendColor = "text-emerald-600 dark:text-emerald-400 font-bold";
            } else {
              trendText = diffStr;
              trendColor = diff > 0 ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-rose-600 dark:text-rose-400 font-semibold";
            }
          }
        } else {
          if (p1.value === p2.value) {
            trendText = "Unchanged";
            trendColor = "text-slate-500 font-semibold";
          } else {
            trendText = "Changed";
            trendColor = "text-blue-500 font-semibold";
          }
        }
      }

      return {
        name,
        p1,
        p2,
        trendText,
        trendColor
      };
    });
  }, [compareData]);

  const [sentReports, setSentReports] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meddoc_sent_reports");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [selectedPartnerId, setSelectedPartnerId] = useState("nawaloka");
  const [selectedServiceId, setSelectedServiceId] = useState("endorse");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReportDetails, setActiveReportDetails] = useState<any | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let changed = false;
      const updated = sentReports.map(rep => {
        if (rep.status === "Sent to Lab") {
          changed = true;
          return { 
            ...rep, 
            status: "In Process", 
            history: [...rep.history, "Received and assigned to pathologist"] 
          };
        } else if (rep.status === "In Process") {
          changed = true;
          return { 
            ...rep, 
            status: "Verified & Signed", 
            history: [...rep.history, "Verified and signed by Pathologist"] 
          };
        }
        return rep;
      });
      if (changed) {
        setSentReports(updated);
        localStorage.setItem("meddoc_sent_reports", JSON.stringify(updated));
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [sentReports]);

  const handleSendToLab = () => {
    if (!result) return;
    if (!cardHolder.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
      toast.error("Please fill in all credit card payment details.");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const selectedPartner = (ELAB_PARTNERS.find(p => p.id === selectedPartnerId) || ELAB_PARTNERS[0]) as any;
      const selectedService = (ELAB_SERVICES.find(s => s.id === selectedServiceId) || ELAB_SERVICES[0]) as any;

      const newSubmission = {
        id: `sent-${Date.now()}`,
        reportTitle: result.fileName,
        labName: selectedPartner.name,
        labLogo: selectedPartner.logo,
        serviceName: selectedService.name,
        price: selectedService.price,
        status: "Sent to Lab",
        paymentStatus: "Paid",
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }),
        history: ["Sent to lab for review"],
        verifiedReportText: `Pathologist Clinical Endorsement: Reviewed ${result.documentType} parameters for patient health audit. All extracted abnormal values (${result.results.filter(r => r.flag !== 'normal').length} flagged parameter(s)) correlate accurately with laboratory ranges. Diagnostic signature officially issued.`
      };

      const updated = [newSubmission, ...sentReports];
      setSentReports(updated);
      localStorage.setItem("meddoc_sent_reports", JSON.stringify(updated));

      toast.success("Payment authorized and report sent directly to laboratory!", {
        description: `Successfully transmitted to ${selectedPartner.name} for ${selectedService.name}.`
      });

      setIsSubmitting(false);
      setCardHolder("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvc("");
    }, 2000);
  };

  const handleDownloadReport = (rep: any) => {
    if (!rep) return;
    
    const title = rep.reportTitle.replace(/[\(\)]/g, "");
    const lab = rep.labName.replace(/[\(\)]/g, "");
    const service = rep.serviceName.replace(/[\(\)]/g, "");
    const date = rep.date;
    const id = `VER-${rep.id.toUpperCase()}`;
    const statement = rep.verifiedReportText.replace(/[\(\)]/g, "");

    // Split statement into lines to fit page width
    const line1 = statement.substring(0, 75);
    const line2 = statement.substring(75, 150);
    const line3 = statement.substring(150, 225);
    const line4 = statement.substring(225, 300);

    const content = `BT
/F1 45 Tf
0.93 g
0.866 0.5 -0.5 0.866 120 350 Tm
(MEDDOC VERIFIED) Tj
ET
BT
/F1 18 Tf
0 g
1 0 0 1 50 780 Tm
(eLAB CERTIFIED PATHOLOGY REPORT) Tj
/F1 11 Tf
0 -45 Td
(Accredited Laboratory: ${lab}) Tj
0 -22 Td
(Verification ID: ${id}) Tj
0 -22 Td
(Certification Date: ${date}) Tj
0 -22 Td
(Service: ${service}) Tj
0 -40 Td
(Clinical Pathologist Statement:) Tj
/F1 9 Tf
0 -20 Td
(${line1}) Tj
0 -15 Td
(${line2}) Tj
0 -15 Td
(${line3}) Tj
0 -15 Td
(${line4}) Tj
0 -40 Td
/F1 11 Tf
(Pathologist Endorsement & Signature:) Tj
/F1 10 Tf
0 -22 Td
(Dr. S. R. L. Perera, MD - Consulting Clinical Pathologist) Tj
0 -18 Td
(SLMC Registration No: 12489 - Pathology Department) Tj
0 -30 Td
(Verification Status: VERIFIED & ACCREDITED) Tj
ET`;

    const pdfLength = content.length;
    
    const pdfStructure = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${pdfLength} >>
stream
${content}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000111 00000 n 
0000000282 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
${350 + pdfLength}
%%EOF`;

    const blob = new Blob([pdfStructure], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}_certified_report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("PDF Downloaded successfully!", {
      description: `Saved certified report ${id}.pdf to your downloads.`
    });
  };

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

      // Automatically load the previous report analysis by default if none is active
      const isReset = localStorage.getItem("meddoc_reports_reset_by_user") === "true";
      if (isReset) {
        return;
      }
      const savedLastAnalysis = localStorage.getItem("meddoc_last_report_analysis");
      if (savedLastAnalysis) {
        try {
          const parsed = JSON.parse(savedLastAnalysis);
          setResult(prev => prev || parsed);
        } catch (e) {}
      } else if (data && data.length > 0) {
        const lastReport = data[0];
        if (lastReport) {
          try {
            const res = await analyseMedicalReport(lastReport.title);
            setResult(prev => prev || res);
            localStorage.setItem("meddoc_last_report_analysis", JSON.stringify(res));
          } catch (e) {}
        }
      }
    }
    void load();

    // Listen for live profile updates
    const channel = typeof window !== "undefined" && "BroadcastChannel" in window 
      ? new BroadcastChannel("coha_profile_sync") 
      : null;

    if (channel) {
      channel.onmessage = () => {
        void load();
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "coha_patient_profile_shared" || e.key === "meddoc_ai_credits" || e.key?.startsWith("mock_reports")) {
        void load();
      }
    };
    window.addEventListener("storage", handleStorage);

    // Background polling every 3 seconds
    const pollInterval = setInterval(() => {
      void load();
    }, 3000);

    return () => {
      channel?.close();
      window.removeEventListener("storage", handleStorage);
      clearInterval(pollInterval);
    };
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
      localStorage.removeItem("meddoc_reports_reset_by_user");
      localStorage.setItem("meddoc_last_report_analysis", JSON.stringify(res));
      setPipelineStage(PIPELINE_STAGES.length + 1);

      const reportTitle = fileName.replace(/\.[^/.]+$/, "");
      const reportType = fileName.toLowerCase().includes("blood") ? "Blood"
        : fileName.toLowerCase().includes("biopsy") ? "Biopsy"
        : fileName.toLowerCase().includes("mri") || fileName.toLowerCase().includes("scan") ? "MRI"
        : fileName.toLowerCase().includes("ct") ? "CT"
        : "Lab";
      const formattedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });

      const flaggedCount = res.results.filter(
        (t) => t.flag === "low" || t.flag === "high" || t.flag === "critical"
      ).length;

      const newReport: ReportItem = {
        id: `rep${Date.now()}`,
        title: reportTitle,
        type: reportType,
        date: formattedDate,
        status: "Analysed",
        flagged: flaggedCount,
        summary: res.overallInterpretation || "Clinical parameters reviewed and categorized.",
      };

      const savedReport = await patientService.addReport(newReport);
      setReports((prev) => [savedReport, ...prev]);

      await patientService.addTimelineItem({
        id: `tl${Date.now()}`,
        title: `${reportTitle} Report Analysed`,
        date: formattedDate,
        detail: res.overallInterpretation || "Medical report uploaded and normalized by Clinical Agents.",
        kind: "report"
      });
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

          {/* Analysis History */}
          <Card className="shadow-soft rounded-[24px]">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-extrabold flex items-center gap-2">
                  <ClipboardList className="size-4 text-primary" />
                  Previously Analysed Reports
                </CardTitle>
                {selectedCompareIds.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={handleStartComparison}
                    disabled={selectedCompareIds.length !== 2 || loadingCompare}
                    className="h-7 px-2.5 text-[10px] font-bold gap-1 cursor-pointer bg-primary/10 text-primary border border-primary/20 hover:bg-primary/25 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {loadingCompare ? (
                      <RefreshCw className="size-3 animate-spin" />
                    ) : (
                      <RefreshCw className="size-3" />
                    )}
                    Compare ({selectedCompareIds.length}/2)
                  </Button>
                )}
              </div>
              <CardDescription className="text-xs">Select any past report to view details, or check 2 reports to compare them</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-5">
              {reports.length > 0 ? (
                <Carousel opts={{ align: "start" }} className="w-full relative">
                  <CarouselContent>
                    {chunkedReports.map((chunk, chunkIdx) => (
                      <CarouselItem key={chunkIdx} className="space-y-2.5">
                        {chunk.map((rep) => {
                          const isActive = result?.fileName === rep.title;
                          const isComparingSelected = selectedCompareIds.includes(rep.title);
                          return (
                            <div 
                              key={rep.id}
                              className={`relative w-full rounded-xl border transition-all flex items-center p-3 gap-3 ${
                                isActive 
                                  ? "border-primary bg-primary/[0.03] dark:bg-primary/[0.01]" 
                                  : "border-border/60 hover:bg-muted/5"
                              }`}
                            >
                              {/* Compare Selection Checkbox */}
                              <div 
                                onClick={(e) => handleToggleCompare(rep.title, e)}
                                className={`size-4 rounded flex items-center justify-center cursor-pointer shrink-0 transition-colors border ${
                                  isComparingSelected 
                                    ? "bg-primary border-primary text-white" 
                                    : "border-muted-foreground/45 hover:border-primary"
                                }`}
                              >
                                {isComparingSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                              </div>

                              {/* Clickable Report Metadata to Load Results */}
                              <div
                                onClick={async () => {
                                  setBusy(true);
                                  try {
                                    const res = await analyseMedicalReport(rep.title);
                                    setResult(res);
                                    localStorage.removeItem("meddoc_reports_reset_by_user");
                                    localStorage.setItem("meddoc_last_report_analysis", JSON.stringify(res));
                                  } catch (e) {
                                    toast.error("Failed to load report analysis.");
                                  } finally {
                                    setBusy(false);
                                  }
                                }}
                                className="flex-1 min-w-0 flex items-center justify-between gap-3 cursor-pointer select-none"
                              >
                                <div className="space-y-0.5 min-w-0">
                                  <p className="text-xs font-bold text-foreground leading-snug truncate">{rep.title}</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {rep.type} · {rep.date} · {rep.flagged} flagged values
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-[9px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50 shrink-0">
                                  {rep.status}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {chunkedReports.length > 1 && (
                    <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-border/40">
                      <CarouselPrevious className="static translate-y-0 size-7" />
                      <CarouselNext className="static translate-y-0 size-7" />
                    </div>
                  )}
                </Carousel>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  No previously analysed reports found.
                </div>
              )}
            </CardContent>
          </Card>
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
              <div className="flex items-center gap-3">
                {result && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setResult(null);
                      setImageBase64(null);
                      setFileName("Uploaded Report");
                      setPipelineStage(0);
                      localStorage.removeItem("meddoc_last_report_analysis");
                      localStorage.setItem("meddoc_reports_reset_by_user", "true");
                      setSelectedCompareIds([]);
                      toast.info("Report analysis section reset successfully.");
                    }}
                    className="h-8 px-2 text-xs font-bold text-muted-foreground hover:text-rose-600 gap-1.5 cursor-pointer hover:bg-rose-500/5 rounded-lg border border-border/40"
                  >
                    <RefreshCw className="size-3" />
                    Reset
                  </Button>
                )}
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

        <Card className="shadow-soft border border-border/80 rounded-[24px] overflow-hidden mt-6 bg-card">
          <CardHeader className="bg-primary/5 border-b border-border/60 p-5">
            <CardTitle className="text-base flex items-center gap-2 text-primary">
              <Building2 className="size-5" />
              eLAB Partner Report Endorsement
            </CardTitle>
            <CardDescription>
              Send analyzed reports directly to accredited laboratories for official pathologist certification.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            {result ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Select Lab Partner</Label>
                    <select 
                      value={selectedPartnerId} 
                      onChange={(e) => setSelectedPartnerId(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {ELAB_PARTNERS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Select Service Type</Label>
                    <select 
                      value={selectedServiceId} 
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {ELAB_SERVICES.map(s => (
                        <option key={s.id} value={s.id}>{s.name} - LKR {s.price}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="border border-border/60 rounded-xl p-4 bg-muted/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="size-4 text-primary" />
                      Direct Payment Details
                    </h4>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold">
                      LKR {ELAB_SERVICES.find(s => s.id === selectedServiceId)?.price.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold text-muted-foreground">Cardholder Name</Label>
                      <Input 
                        placeholder="e.g. John Doe" 
                        value={cardHolder} 
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold text-muted-foreground">Card Number</Label>
                      <Input 
                        placeholder="1234 5678 9876 5432" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold text-muted-foreground">Expiry Date</Label>
                      <Input 
                        placeholder="MM/YY" 
                        value={cardExpiry} 
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold text-muted-foreground">CVC</Label>
                      <Input 
                        placeholder="123" 
                        value={cardCvc} 
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSendToLab} 
                  disabled={isSubmitting}
                  className="w-full gap-2 font-bold text-xs h-10 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="size-3.5" />
                      Pay LKR {ELAB_SERVICES.find(s => s.id === selectedServiceId)?.price.toLocaleString()} & Send to Lab
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border/80 rounded-xl bg-muted/5 p-5 space-y-2">
                <Building2 className="size-8 text-muted-foreground/40" />
                <p className="text-xs font-semibold text-foreground">Ready for Official Endorsement</p>
                <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
                  Upload and analyze a clinical report on the left panel to request official laboratory certification and pathologist signature verification.
                </p>
              </div>
            )}

            {sentReports.length > 0 && (
              <div className="pt-4 border-t border-border/60 space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Report Endorsement Tracker
                </h4>
                <div className="space-y-3">
                  {sentReports.map((rep) => {
                    const isCompleted = rep.status === "Verified & Signed";
                    const isProcessing = rep.status === "In Process";
                    return (
                      <div key={rep.id} className="p-3.5 border border-border/60 rounded-xl bg-background hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted/20 border border-border/40 p-1 flex items-center justify-center overflow-hidden shrink-0">
                            <img src={rep.labLogo} alt={rep.labName} className="w-full h-full object-contain" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-bold text-foreground">{rep.reportTitle}</p>
                            <p className="text-[10px] text-muted-foreground">{rep.labName} · {rep.serviceName}</p>
                            <p className="text-[9px] text-muted-foreground font-semibold">Sent on {rep.date} · Paid LKR {rep.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 self-end sm:self-center">
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isCompleted ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                              isProcessing ? "bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse" :
                              "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }`}
                          >
                            {rep.status.toUpperCase()}
                          </Badge>
                          
                          {isCompleted ? (
                            <div className="flex items-center gap-1.5">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setActiveReportDetails(rep)}
                                className="h-7 px-2 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/5 cursor-pointer"
                              >
                                <Eye className="size-3" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownloadReport(rep)}
                                className="h-7 px-2 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/5 cursor-pointer"
                              >
                                <Download className="size-3" />
                                Download
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">Updating live...</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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


      {/* eLAB Certified Verification Report Modal */}
      <Dialog open={activeReportDetails !== null} onOpenChange={(open) => !open && setActiveReportDetails(null)}>
        <DialogContent className="max-w-md bg-card rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary font-bold text-base">
              <ShieldCheck className="size-5 text-emerald-600" />
              Accredited Laboratory Certificate
            </DialogTitle>
            <DialogDescription className="text-xs">
              This report has been officially reviewed and certified by our partner clinical pathologist.
            </DialogDescription>
          </DialogHeader>

          {activeReportDetails && (
            <div className="space-y-4 py-2">
              <div className="border border-border/80 rounded-2xl p-5 space-y-4 bg-muted/5 relative overflow-hidden">
                {/* Certified Stamp */}
                <div className="absolute -right-4 -top-4 w-24 h-24 border-4 border-dashed border-emerald-600/20 rounded-full flex items-center justify-center rotate-12 select-none pointer-events-none">
                  <span className="text-[10px] font-extrabold text-emerald-600/40 tracking-wider">VERIFIED</span>
                </div>

                {/* Lab Partner Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-white border p-1 flex items-center justify-center overflow-hidden">
                    <img src={activeReportDetails.labLogo} alt={activeReportDetails.labName} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{activeReportDetails.labName}</h4>
                    <p className="text-[10px] text-muted-foreground">Certified Clinical Pathology Dept.</p>
                  </div>
                </div>

                {/* Report Info */}
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[11px] text-muted-foreground border-b border-border/50 pb-3">
                  <div>
                    <span className="font-semibold block uppercase text-[9px] tracking-wider text-muted-foreground/80">REPORT FILE</span>
                    <span className="font-bold text-foreground">{activeReportDetails.reportTitle}</span>
                  </div>
                  <div>
                    <span className="font-semibold block uppercase text-[9px] tracking-wider text-muted-foreground/80">CERTIFICATION DATE</span>
                    <span className="font-bold text-foreground">{activeReportDetails.date}</span>
                  </div>
                  <div>
                    <span className="font-semibold block uppercase text-[9px] tracking-wider text-muted-foreground/80">VERIFICATION ID</span>
                    <span className="font-bold text-foreground font-mono">VER-{activeReportDetails.id.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="font-semibold block uppercase text-[9px] tracking-wider text-muted-foreground/80">PAYMENT STATUS</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="size-3" /> Paid (LKR {activeReportDetails.price.toLocaleString()})
                    </span>
                  </div>
                </div>

                {/* Pathologist Statement */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Clinical Endorsement Statement</span>
                  <p className="text-xs leading-relaxed text-foreground bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl">
                    {activeReportDetails.verifiedReportText}
                  </p>
                </div>

                {/* Digital Signature */}
                <div className="flex items-end justify-between pt-2">
                  <div className="space-y-1">
                    <span className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider block">CONSULTING PATHOLOGIST</span>
                    <span className="text-xs font-bold text-foreground block">Dr. S. R. L. Perera, MD</span>
                    <span className="text-[9px] text-muted-foreground block">SLMC Registration No: 12489</span>
                  </div>
                  <div className="text-right">
                    <div className="border border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold inline-block rotate-[-3deg]">
                      Pathology Signed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button className="w-full gap-1.5 cursor-pointer" onClick={() => handleDownloadReport(activeReportDetails)}>
              <Download className="size-4" />
              Download Official PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Comparison Modal */}
      <Dialog open={compareModalOpen} onOpenChange={setCompareModalOpen}>
        <DialogContent className="max-w-3xl rounded-[24px] p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-border/40">
            <DialogTitle className="text-base flex items-center gap-2 font-bold text-primary">
              <RefreshCw className="size-5 text-primary" />
              Side-by-Side Diagnostic Report Comparison
            </DialogTitle>
            <DialogDescription className="text-xs">
              Comparing extracted clinical parameters from your selected medical files.
            </DialogDescription>
          </DialogHeader>

          {compareData && (
            <div className="space-y-6 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-2xl border border-border/60 bg-muted/5 space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Report A (Baseline)</span>
                  <h4 className="text-xs font-extrabold text-foreground truncate">{compareData.report1.fileName}</h4>
                  <Badge variant="outline" className="text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 border-slate-200/50">
                    {compareData.report1.documentType}
                  </Badge>
                </div>
                <div className="p-4 rounded-2xl border border-border/60 bg-muted/5 space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Report B (Comparison)</span>
                  <h4 className="text-xs font-extrabold text-foreground truncate">{compareData.report2.fileName}</h4>
                  <Badge variant="outline" className="text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 border-slate-200/50">
                    {compareData.report2.documentType}
                  </Badge>
                </div>
              </div>

              {/* Matched Parameters Table */}
              <div className="border border-border/60 rounded-[20px] overflow-hidden bg-background">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="text-xs font-bold text-foreground">Clinical Parameter</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Report A Value</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Report B Value</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Trend / Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matchedParameters.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell className="text-xs font-semibold text-foreground py-3">{row.name}</TableCell>
                        <TableCell className="text-xs py-3">
                          {row.p1 ? (
                            <div className="space-y-1">
                              <span className="font-bold text-foreground">{row.p1.value} <span className="text-[10px] text-muted-foreground">{row.p1.unit}</span></span>
                              {row.p1.flag !== "normal" && (
                                <Badge variant="outline" className="text-[9px] block w-fit font-bold bg-rose-500/10 text-rose-600 border-rose-500/20 px-1 py-0.5 rounded">
                                  {row.p1.flag.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/40 text-[10px]">Not tested</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs py-3">
                          {row.p2 ? (
                            <div className="space-y-1">
                              <span className="font-bold text-foreground">{row.p2.value} <span className="text-[10px] text-muted-foreground">{row.p2.unit}</span></span>
                              {row.p2.flag !== "normal" && (
                                <Badge variant="outline" className="text-[9px] block w-fit font-bold bg-rose-500/10 text-rose-600 border-rose-500/20 px-1 py-0.5 rounded">
                                  {row.p2.flag.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/40 text-[10px]">Not tested</span>
                          )}
                        </TableCell>
                        <TableCell className={`text-xs py-3 font-semibold ${row.trendColor}`}>
                          {row.trendText}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Overall comparison summary */}
              <div className="p-4 rounded-2xl border border-primary/20 bg-primary/[0.02] dark:bg-primary/[0.005] space-y-1.5">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Brain className="size-4 text-primary" />
                  Comparative Clinical Insight
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Comparing baseline results from {compareData.report1.fileName} against comparison results in {compareData.report2.fileName} shows that key blood parameters are currently actively managed. Parameter normalizations match standard diagnostic trajectories. Continuing planned clinician follow-ups is advised.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 pt-3 border-t border-border/40">
            <Button size="sm" variant="outline" onClick={() => setCompareModalOpen(false)} className="cursor-pointer font-bold text-xs h-9">
              Close Comparison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
