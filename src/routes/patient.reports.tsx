import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
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

function ReportsPage() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ReportAnalysis | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("Uploaded Report");

  useEffect(() => {
    async function load() {
      const data = await patientService.getReports();
      setReports(data);
    }
    load();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const max_size = 1200; // slightly larger for reports to keep text readable
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
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setImageBase64(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const run = async () => {
    if (!imageBase64 && !result) return;
    setBusy(true);
    try {
      const res = await analyseMedicalReport(fileName, imageBase64 || undefined);
      setResult(res);
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical reports"
        description="Blood, MRI, CT, biopsy and laboratory reports in PDF or image form."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Upload a report</CardTitle>
            <CardDescription>We store it in your record after analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {imageBase64 ? (
              <label className="relative block cursor-pointer rounded-2xl border border-border overflow-hidden group">
                <img src={imageBase64} alt="Uploaded report" className="w-full h-auto object-contain max-h-[300px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white">
                  <Upload className="size-8 mb-2" aria-hidden="true" />
                  <span className="text-sm font-medium">Change report</span>
                </div>
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </label>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center hover:bg-muted/80 transition-colors">
                <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Choose a report image</span>
                <span className="text-xs text-muted-foreground">JPG or PNG · up to 20 MB</span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </label>
            )}

            <Button
              className="w-full"
              disabled={busy || (!imageBase64 && !result)}
              onClick={() => void run()}
            >
              {busy ? "Analysing…" : "Analyse report"}
            </Button>
            <AiDisclaimer />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Analysis</CardTitle>
            <CardDescription>{result ? result.fileName : "Awaiting a report"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <>
                {result.abnormal && result.abnormal.length > 0 ? (
                  <div>
                    <p className="text-sm font-medium">Values outside the reference range</p>
                    <ul className="mt-2 space-y-2">
                      {result.abnormal.map((a) => (
                        <li
                          key={a.label}
                          className="flex items-center justify-between rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm"
                        >
                          <span>{a.label}</span>
                          <span className="text-right">
                            {a.value}
                            <span className="block text-xs text-muted-foreground">Range {a.range}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-xl border border-success/30 bg-success/10 p-3 text-sm flex items-center gap-2">
                    <span className="text-success font-semibold">✓</span>
                    <span>No abnormal values detected outside standard reference ranges.</span>
                  </div>
                )}
                
                {/* Plain-language summary for non-medical users */}
                {result.plainLanguage && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30 p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base" role="img" aria-label="lightbulb">💡</span>
                      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">What this means in simple terms</p>
                    </div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">{result.plainLanguage}</p>
                  </div>
                )}
                
                <Badge variant="secondary">Suggested specialist: {result.suggestedSpecialty}</Badge>
                <AiDisclaimer />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Highlighted abnormal values, a plain-language summary and a suggested specialist
                appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Stored reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden md:table-cell">Summary</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{r.type}</TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm text-muted-foreground">
                    {r.summary}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={r.status === "Analysed" ? "secondary" : "outline"}>{r.status}</Badge>
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
