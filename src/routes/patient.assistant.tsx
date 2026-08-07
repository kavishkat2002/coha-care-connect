import { createFileRoute } from "@tanstack/react-router";
import { Bot, Paperclip, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { DoctorCard } from "@/components/shared/DoctorCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyseSymptoms, recommendCare, type Assessment, type Recommendation } from "@/services/ai.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/assistant")({
  head: () => ({
    meta: [
      { title: "AI health assistant — MedDoc" },
      {
        name: "description",
        content:
          "Describe your symptoms, attach images or reports, and receive an AI-assisted assessment with specialist recommendations.",
      },
      { property: "og:title", content: "AI health assistant — MedDoc" },
      { property: "og:description", content: "AI-assisted symptom assessment and care recommendations." },
    ],
  }),
  component: AssistantPage,
});

type Message = { id: string; role: "user" | "assistant"; text: string; attachment?: string };

const suggestions = [
  "I have a mouth ulcer that has not healed in three weeks.",
  "I have a skin rash on my forearm.",
  "I have breast pain on one side.",
  "I need a dermatologist near Colombo.",
];

function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      role: "assistant",
      text: "Hello. Tell me what you are experiencing in your own words. You can also attach a photo of the affected area, a prescription, or a lab report.",
    },
  ]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [care, setCare] = useState<Recommendation | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const userMsg: Message = {
      id: `u${Date.now()}`,
      role: "user",
      text,
      ...(attachment ? { attachment } : {}),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setAttachment(null);
    setBusy(true);

    const result = await analyseSymptoms(text);
    setAssessment(result);
    setCare(await recommendCare(result.suggestedSpecialty));
    setMessages((m) => [
      ...m,
      {
        id: `a${Date.now()}`,
        role: "assistant",
        text: `${result.summary} I have prepared an assessment on the right, including possible conditions and the specialist I would suggest (${result.suggestedSpecialty}).`,
      },
    ]);
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI health assistant"
        description="Intent detection, symptom analysis, image and report review, then a care recommendation."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="flex h-[38rem] flex-col shadow-soft lg:col-span-3">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="size-4 text-primary" aria-hidden="true" /> Conversation
            </CardTitle>
            <CardDescription>Natural language · attachments supported</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 space-y-4 overflow-y-auto py-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" ? (
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Bot className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                  {m.attachment ? (
                    <span className="mt-2 block text-xs opacity-80">Attached: {m.attachment}</span>
                  ) : null}
                </div>
                {m.role === "user" ? (
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <User className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
              </div>
            ))}
            {busy ? (
              <p className="text-sm text-muted-foreground" role="status">
                Analysing your message…
              </p>
            ) : null}
            <div ref={endRef} />
          </CardContent>

          <div className="border-t border-border p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            {attachment ? (
              <p className="mb-2 text-xs text-muted-foreground">Ready to send: {attachment}</p>
            ) : null}
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Attach a file"
                onClick={() => setAttachment("lab-report.pdf")}
              >
                <Paperclip className="size-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms…"
                aria-label="Message"
              />
              <Button type="submit" size="icon" aria-label="Send message" disabled={busy}>
                <Send className="size-4" />
              </Button>
            </form>
            <AiDisclaimer className="mt-3" />
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-primary" aria-hidden="true" /> Assessment
              </CardTitle>
              <CardDescription>
                {assessment ? assessment.intent : "Send a message to generate an assessment"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessment ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge level={assessment.risk} />
                    <Badge variant="secondary">Confidence {assessment.confidence}%</Badge>
                  </div>
                  <div className="space-y-3">
                    {assessment.possibleConditions.map((c) => (
                      <div key={c.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span>{c.name}</span>
                          <span className="text-muted-foreground">{c.likelihood}%</span>
                        </div>
                        <Progress value={c.likelihood} className="mt-1.5 h-1.5" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Recommended next steps</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      {assessment.recommendation.map((r) => (
                        <li key={r}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                  <AiDisclaimer />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Possible conditions, risk indication, confidence score and recommendations will
                  appear here.
                </p>
              )}
            </CardContent>
          </Card>

          {care ? (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Recommended care</CardTitle>
                <CardDescription>Ranked by rating, distance and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="topRated">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="topRated">Top rated</TabsTrigger>
                    <TabsTrigger value="nearest">Nearest</TabsTrigger>
                    <TabsTrigger value="mostAvailable">Available</TabsTrigger>
                  </TabsList>
                  {(["topRated", "nearest", "mostAvailable"] as const).map((key) => (
                    <TabsContent key={key} value={key} className="mt-4 space-y-3">
                      {care[key].map((d) => (
                        <DoctorCard key={d.id} doctor={d} compact />
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
