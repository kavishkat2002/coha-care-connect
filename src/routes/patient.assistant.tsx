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
import { analyseSymptoms, recommendCare, type Assessment, type Recommendation, type ChatMessage } from "@/services/ai.service";
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

type Message = { id: string; role: "user" | "assistant"; text: string; attachment?: string; imageBase64?: string };

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
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [care, setCare] = useState<Recommendation | null>(null);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const max_size = 800; // smaller for chat attachments
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
          
          setImageBase64(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Build conversation history from messages for the AI
  const buildConversationHistory = (msgs: Message[]): ChatMessage[] => {
    return msgs
      .filter((m) => m.role === "user" || (m.role === "assistant" && m.id !== "m0"))
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.text,
        ...(m.imageBase64 ? { imageBase64: m.imageBase64 } : {})
      }));
  };

  const send = async (text: string) => {
    if (!text.trim() && !imageBase64) return;
    if (busy) return;
    
    const userMsg: Message = {
      id: `u${Date.now()}`,
      role: "user",
      text,
      ...(attachment ? { attachment } : {}),
      ...(imageBase64 ? { imageBase64 } : {}),
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setAttachment(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setBusy(true);

    // Pass full conversation history for context-aware analysis
    const conversationHistory = buildConversationHistory(updatedMessages);
    const result = await analyseSymptoms(conversationHistory);
    setAssessment(result);
    
    // Set follow-up questions as dynamic suggestions
    if (result.followUpQuestions && result.followUpQuestions.length > 0) {
      setDynamicSuggestions(result.followUpQuestions);
    } else {
      setDynamicSuggestions([]);
    }

    if (result.possibleConditions.length > 0) {
      setCare(await recommendCare(result.suggestedSpecialty || ""));
      setMessages((m) => [
        ...m,
        {
          id: `a${Date.now()}`,
          role: "assistant",
          text: `${result.summary} I have prepared an assessment on the right, including possible conditions and the specialist I would suggest (${result.suggestedSpecialty}).`,
        },
      ]);
    } else {
      setCare(null);
      setMessages((m) => [
        ...m,
        {
          id: `a${Date.now()}`,
          role: "assistant",
          text: result.summary,
        },
      ]);
    }
    setBusy(false);
  };

  // Combine static suggestions with dynamic follow-up questions
  const activeSuggestions = dynamicSuggestions.length > 0 ? dynamicSuggestions : suggestions;

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
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm flex flex-col gap-2",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.imageBase64 && (
                    <img src={m.imageBase64} alt="User upload" className="rounded-xl w-48 h-auto object-cover border border-black/10 dark:border-white/10" />
                  )}
                  {m.text && <span>{m.text}</span>}
                  {(m.attachment && !m.imageBase64) ? (
                    <span className="mt-1 block text-xs opacity-80">Attached: {m.attachment}</span>
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
              {activeSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors",
                    dynamicSuggestions.length > 0
                      ? "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 font-medium"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {dynamicSuggestions.length > 0 ? "→ " : ""}{s}
                </button>
              ))}
            </div>
            
            {/* Attachment Preview Area */}
            {(attachment || imageBase64) && (
              <div className="mb-3 flex items-center gap-2 p-2 rounded-xl bg-muted/50 w-fit relative group">
                {imageBase64 ? (
                  <img src={imageBase64} alt="Preview" className="h-10 w-10 rounded-lg object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Paperclip className="size-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col max-w-[200px]">
                  <span className="text-xs font-medium truncate">{attachment || "Image"}</span>
                  <span className="text-[10px] text-muted-foreground">Ready to send</span>
                </div>
                <button 
                  type="button" 
                  onClick={removeAttachment}
                  className="absolute -top-1.5 -right-1.5 bg-background border border-border rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                  aria-label="Remove attachment"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            )}

            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <input 
                type="file" 
                accept="image/*,application/pdf"
                className="sr-only" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Attach a file"
                onClick={() => fileInputRef.current?.click()}
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

                  {/* Plain-language summary for non-medical users */}
                  {assessment.plainLanguageSummary && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30 p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base" role="img" aria-label="lightbulb">💡</span>
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">What this means</p>
                      </div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">{assessment.plainLanguageSummary}</p>
                    </div>
                  )}

                  {/* Clinical summary */}
                  {assessment.summary && (
                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Clinical Summary</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{assessment.summary}</p>
                    </div>
                  )}

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

