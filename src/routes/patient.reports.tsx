import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reports } from "@/data/mock";
import { analyseMedicalReport, type ReportAnalysis } from "@/services/ai.service";

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
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center">
              <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium">Choose a PDF or image</span>
              <span className="text-xs text-muted-foreground">PDF, JPG or PNG · up to 20 MB</span>
              <input type="file" accept="application/pdf,image/*" className="sr-only" />
            </label>
            <Button
              className="w-full"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setResult(await analyseMedicalReport("full-blood-count.pdf"));
                setBusy(false);
              }}
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
                <p className="text-sm text-muted-foreground">{result.plainLanguage}</p>
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
