import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Paperclip, Send, User, Mic, Calendar, ArrowRight, ShieldAlert, FileText, Camera, X, Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GuestCreditBanner } from "@/components/shared/GuestCreditBanner";

import { PageHeader } from "@/components/shared/PageHeader";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { DoctorCard } from "@/components/shared/DoctorCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { BrainCircuit, RotateCcw, MessageSquarePlus, History, Loader2 } from "lucide-react";
import { analyseSymptoms, recommendCare, transcribeAudio, type Assessment, type Recommendation, type ChatMessage, type AgenticAction } from "@/services/ai.service";
import { doctors, type Doctor } from "@/data/mock";
import { patientService } from "@/services/patient.service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

type Message = { id: string; role: "user" | "assistant"; text: string; attachment?: string; imageBase64?: string; reasoning?: string; reasoningDuration?: number; agenticAction?: AgenticAction; loadedCare?: Recommendation | null };

type ChatSession = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
  assessment: Assessment | null;
  care: Recommendation | null;
  dynamicSuggestions: string[];
};

const suggestions = [
  "I have a mouth ulcer that has not healed in three weeks.",
  "I am having chest pain and need a Cardiologist.",
  "I have frequent headaches, I need a Neuro Physician.",
  "My joints ache continuously. Find an Orthopaedic Surgeon.",
];

const CITY_COORDS: Record<string, { lat: number, lng: number }> = {
  "Colombo": { lat: 6.9271, lng: 79.8612 },
  "Kandy": { lat: 7.2906, lng: 80.6337 },
  "Galle": { lat: 6.0535, lng: 80.2210 },
  "Horana": { lat: 6.7145, lng: 80.0636 },
  "Wattala": { lat: 6.9889, lng: 79.8913 },
  "Panadura": { lat: 6.7130, lng: 79.9073 }
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function AssistantPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>(`sess_${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      role: "assistant",
      text: "Hello, I am MedDoc. Tell me what you are experiencing in your own words. You can also attach a photo of the affected area, a prescription, or a lab report.",
    },
  ]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [care, setCare] = useState<null | {
    topRated: Doctor[];
    nearest: Doctor[];
    mostAvailable: Doctor[];
    originalNearest?: Doctor[]; 
  }>(null);
  
  const [isLocating, setIsLocating] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activePlanId, setActivePlanId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("meddoc_active_epass");
    }
    return null;
  });
  const [aiCredits, setAiCredits] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meddoc_ai_credits");
      if (saved) return parseInt(saved, 10);
      const activePlan = localStorage.getItem("meddoc_active_epass");
      if (activePlan === "platinum") return 100000;
      if (activePlan === "gold") return 10000;
      if (activePlan === "silver") return 1000;
    }
    // Guest user: 450 free credits
    return 450;
  });
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [patientId, setPatientId] = useState<string>("p1");

  useEffect(() => {
    patientService.getPatientProfile().then(p => {
      if (p?.id) {
        setPatientId(p.id);
        setIsGuest(false);
        patientService.getEPassMembership(p.id).then(m => {
          if (m && typeof m.ai_credits === "number") {
            setAiCredits(m.ai_credits);
            localStorage.setItem("meddoc_ai_credits", m.ai_credits.toString());
          }
        });
        patientService.getChatHistory(p.id).then(hist => {
          if (hist && hist.length > 0) {
            setSessions(hist);
            const latest = hist[0];
            setActiveSessionId(latest.id);
            setMessages(latest.messages);
            setAssessment(latest.assessment);
            setCare(latest.care);
            setDynamicSuggestions(latest.dynamicSuggestions || []);
          }
        });
      } else {
        // No profile = guest user
        setIsGuest(true);
        const saved = localStorage.getItem("meddoc_ai_credits");
        if (!saved) {
          setAiCredits(450);
          localStorage.setItem("meddoc_ai_credits", "450");
        }
      }
    });
  }, []);

  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSessions((prev) => {
      if (messages.length <= 1) return prev;
      
      const existingIdx = prev.findIndex(s => s.id === activeSessionId);
      const titleText = messages.find((m) => m.role === "user")?.text || "New Conversation";
      const title = titleText.length > 40 ? titleText.slice(0, 40) + "..." : titleText;
      
      const newSession: ChatSession = {
        id: activeSessionId,
        title,
        updatedAt: Date.now(),
        messages,
        assessment,
        care,
        dynamicSuggestions,
      };

      const existing = prev[existingIdx];
      if (existing && JSON.stringify(existing) === JSON.stringify(newSession)) {
        return prev;
      }

      if (patientId) {
        void patientService.saveChatSession(patientId, newSession);
      }

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = newSession;
        return next;
      } else {
        return [newSession, ...prev];
      }
    });
  }, [messages, assessment, care, dynamicSuggestions, activeSessionId, patientId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const startNewChat = () => {
    setActiveSessionId(`sess_${Date.now()}`);
    setMessages([
      {
        id: "m0",
        role: "assistant",
        text: "Hello, I am MedDoc. Tell me what you are experiencing in your own words. You can also attach a photo of the affected area, a prescription, or a lab report.",
      },
    ]);
    setAssessment(null);
    setCare(null);
    setDynamicSuggestions([]);
  };

  const loadChat = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setAssessment(session.assessment);
    setCare(session.care);
    setDynamicSuggestions(session.dynamicSuggestions);
  };

  const toggleListen = async () => {
    if (isListening && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          
          // Stop all audio tracks to release the microphone
          stream.getTracks().forEach(track => track.stop());
          
          setIsTranscribing(true);
          const transcript = await transcribeAudio(audioBlob);
          setIsTranscribing(false);
          
          if (transcript) {
            setInput((prev) => (prev ? prev + " " : "") + transcript.trim());
          }
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access is required to use voice input.");
      }
    }
  };

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
    
    if (aiCredits < 50) {
      toast.error("Insufficient credits. Each assistant evaluation query costs 50 credits. Please purchase or upgrade your MedDoc ePass plan to continue.", {
        description: `Your balance: ${aiCredits} credits. Cost: 50 credits.`
      });
      return;
    }
    
    setAiCredits((prev) => {
      const next = Math.max(0, prev - 50);
      localStorage.setItem("meddoc_ai_credits", next.toString());
      void patientService.updateAICredits(patientId, next);
      return next;
    });
    
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
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (fileInputRef.current) fileInputRef.current.value = "";
    setBusy(true);

    // Pass full conversation history for context-aware analysis
    const startTime = Date.now();
    const conversationHistory = buildConversationHistory(updatedMessages);
    const result = await analyseSymptoms(conversationHistory);
    const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setAssessment(result);
    
    // Set follow-up questions as dynamic suggestions
    if (result.followUpQuestions && result.followUpQuestions.length > 0) {
      setDynamicSuggestions(result.followUpQuestions);
    } else {
      setDynamicSuggestions([]);
    }
    setShowSuggestions(true);

    // Fetch specialists inline if the agentic action is specialist search/booking
    let inlineCare = null;
    if (result.agenticAction && (result.agenticAction.type === "find_specialist" || result.agenticAction.type === "book_doctor")) {
      inlineCare = await recommendCare(result.agenticAction.specialty || result.suggestedSpecialty || "");
    } else if (result.agenticAction && result.agenticAction.type === "book_specific_doctor") {
      const docId = result.agenticAction.parameters?.["doctorId"];
      const foundDoc = doctors.find((d) => d.id === docId);
      if (foundDoc) {
        inlineCare = {
          topRated: [foundDoc],
          nearest: [foundDoc],
          mostAvailable: [foundDoc]
        };
      }
    }

    if (result.possibleConditions.length > 0 || (result.followUpQuestions && result.followUpQuestions.length === 0)) {
      const newCare = await recommendCare(result.suggestedSpecialty || "");
      setCare({ ...newCare, originalNearest: [...newCare.nearest] });
    } else {
      setCare(null);
    }

    const newMsg: Message = {
      id: `a${Date.now()}`,
      role: "assistant",
      text: result.plainLanguageSummary || result.summary,
      loadedCare: inlineCare,
    };
    if (result.reasoning) {
      newMsg.reasoning = result.reasoning;
      newMsg.reasoningDuration = durationSeconds;
    }
    if (result.agenticAction) {
      newMsg.agenticAction = result.agenticAction;
    }

    setMessages((m) => [...m, newMsg]);
    setBusy(false);
  };

  // Combine static suggestions with dynamic follow-up questions
  const activeSuggestions = dynamicSuggestions.length > 0 ? dynamicSuggestions : suggestions;

  const handleTabChange = (val: string) => {
    if (val === "nearest" && care) {
      if ("geolocation" in navigator) {
        setIsLocating(true);
        toast.info("Requesting live location to find nearest doctors...", { id: "geo-toast" });
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Recalculate distances based on mock city coords
            const updatedNearest = (care.originalNearest || care.nearest).map(doc => {
              const coords = CITY_COORDS[doc.city] || { lat: 6.9271, lng: 79.8612 };
              // Add a bit of random variance based on branch so they aren't all same distance
              const varLat = coords.lat + (doc.branch.length * 0.001);
              const varLng = coords.lng + (doc.branch.length * 0.001);
              
              const actualDist = calculateDistance(userLat, userLng, varLat, varLng);
              return { ...doc, distanceKm: Number(actualDist.toFixed(1)) };
            }).sort((a, b) => a.distanceKm - b.distanceKm);
            
            setCare({ ...care, nearest: updatedNearest });
            setIsLocating(false);
            toast.success("Doctors sorted by your live location!", { id: "geo-toast" });
          },
          (error) => {
            console.warn("Geolocation error:", error);
            setIsLocating(false);
            toast.error("Could not access location. Using default estimates.", { id: "geo-toast" });
          },
          { timeout: 10000, maximumAge: 60000 }
        );
      } else {
        toast.error("Geolocation is not supported by your browser");
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI health assistant"
        description="Intent detection, symptom analysis, image and report review, then a care recommendation."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="flex h-[32rem] sm:h-[38rem] flex-col shadow-soft lg:col-span-3">
          <CardHeader className="border-b border-border flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="size-4 text-primary" aria-hidden="true" /> Conversation
              </CardTitle>
              <CardDescription>Natural language · attachments supported</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hidden sm:flex">
                    <History className="size-4 mr-2" /> History
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Chat History</SheetTitle>
                    <SheetDescription>
                      Access your previous AI assistant sessions.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col gap-3">
                    {sessions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No previous chats found.</p>
                    ) : (
                      sessions.map(s => (
                        <div 
                          key={s.id} 
                          onClick={() => loadChat(s)}
                          className={cn(
                            "p-3 rounded-xl border text-sm cursor-pointer transition-colors",
                            activeSessionId === s.id 
                              ? "border-primary/50 bg-primary/5 shadow-sm" 
                              : "border-border/60 hover:bg-muted"
                          )}
                        >
                          <p className="font-medium line-clamp-1">{s.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(s.updatedAt).toLocaleDateString()} · {s.messages.filter(m => m.role === "user").length} queries
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button variant="outline" size="sm" onClick={startNewChat} className="hidden sm:flex">
                <MessageSquarePlus className="size-4 mr-2" /> New Chat
              </Button>
              <Button variant="outline" size="icon" onClick={startNewChat} className="sm:hidden" aria-label="New Chat">
                <MessageSquarePlus className="size-4" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground hover:text-foreground">
                    <History className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Chat History</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col gap-3">
                    {sessions.map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => loadChat(s)}
                        className={cn(
                          "p-3 rounded-xl border text-sm cursor-pointer transition-colors",
                          activeSessionId === s.id 
                            ? "border-primary/50 bg-primary/5 shadow-sm" 
                            : "border-border/60 hover:bg-muted"
                        )}
                      >
                        <p className="font-medium line-clamp-1">{s.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(s.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
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
                    "max-w-[88%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-3 text-sm flex flex-col gap-2",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.imageBase64 && (
                    <img src={m.imageBase64} alt="User upload" className="rounded-xl w-48 h-auto object-cover border border-black/10 dark:border-white/10" />
                  )}
                  {m.reasoning && (
                    <Accordion type="single" collapsible className="w-full mb-1">
                      <AccordionItem value="reasoning" className="border-none">
                        <AccordionTrigger className="py-1 px-3.5 rounded-full bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/10 dark:hover:bg-sky-500/20 text-xs font-semibold flex items-center justify-start gap-1.5 h-8 w-fit text-sky-600 dark:text-sky-400 [&>svg]:size-3 [&>svg]:text-sky-500 [&>svg]:shrink-0">
                          <BrainCircuit className="size-3.5" />
                          <span>{m.reasoningDuration ? `Thought for ${m.reasoningDuration}s` : "Think"}</span>
                        </AccordionTrigger>
                        <AccordionContent className="p-3 text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed bg-black/5 dark:bg-white/5 border-l-2 border-sky-500/30 rounded-r-lg mt-2 pl-3">
                          <p className="font-semibold text-[10px] text-sky-500 uppercase tracking-wider mb-1">Reasoning Process</p>
                          {m.reasoning}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  {m.text && <span className="leading-relaxed whitespace-pre-wrap">{m.text}</span>}
                  
                  {/* Dynamic Agentic Actions Widgets */}
                  {m.agenticAction && m.agenticAction.type !== "none" && (
                    <div className="mt-2.5 p-3.5 rounded-xl border border-primary/20 bg-background text-foreground space-y-2.5 shadow-sm max-w-full">
                      <p className="text-xs text-muted-foreground font-medium">
                        {m.agenticAction.message || "Performing automated task..."}
                      </p>

                      {/* Case A: Find Specialist Carousel/Grid */}
                      {(m.agenticAction.type === "find_specialist" || m.agenticAction.type === "book_doctor") && m.loadedCare && (
                        <div className="space-y-2 pt-1">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Recommended {m.agenticAction.specialty || "Specialist"} Directory</p>
                          <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
                            {m.loadedCare.topRated.slice(0, 3).map((d) => (
                              <DoctorCard key={d.id} doctor={d} compact />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Case B: Image Scan upload trigger */}
                      {m.agenticAction.type === "analyze_image" && (
                        <div className="flex items-center gap-2 pt-1 justify-between">
                          <div className="flex items-center gap-2">
                            <Camera className="size-4 text-primary shrink-0" />
                            <span className="text-xs font-semibold">Image Analysis Suite</span>
                          </div>
                          <Link to="/patient/images">
                            <Button size="sm" className="h-7 text-xs gap-1.5">
                              Launch Suite <ArrowRight className="size-3" />
                            </Button>
                          </Link>
                        </div>
                      )}

                      {/* Case C: Generic / records redirection link */}
                      {m.agenticAction.type === "redirect" && m.agenticAction.targetRoute && (
                        <div className="flex items-center gap-2 pt-1 justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-primary shrink-0" />
                            <span className="text-xs font-semibold">Prescriptions & Records Portal</span>
                          </div>
                          <Link to={m.agenticAction.targetRoute as any}>
                            <Button size="sm" className="h-7 text-xs gap-1.5" variant="outline">
                              Open Records <ArrowRight className="size-3" />
                            </Button>
                          </Link>
                        </div>
                      )}

                      {/* Case D: Specific Doctor Booking Card */}
                      {m.agenticAction.type === "book_specific_doctor" && m.agenticAction.parameters && (
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs">
                            <Calendar className="size-4 text-emerald-600 shrink-0" />
                            <div>
                              <p className="font-semibold text-emerald-800 dark:text-emerald-300">Requested Schedule</p>
                              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                                {m.agenticAction.parameters["date"]} · {m.agenticAction.parameters["timeslot"]} slot
                              </p>
                            </div>
                          </div>
                          {m.loadedCare && m.loadedCare.topRated.length > 0 && m.loadedCare.topRated[0] && (
                            <div className="border border-border/40 rounded-lg overflow-hidden p-1 bg-muted/20">
                              <DoctorCard doctor={m.loadedCare.topRated[0]!} compact />
                            </div>
                          )}
                          <Link 
                            to="/patient/book" 
                            search={{ 
                              doctorId: m.agenticAction.parameters["doctorId"],
                              date: m.agenticAction.parameters["date"],
                              timeslot: m.agenticAction.parameters["timeslot"] 
                            }} 
                            className="block w-full"
                          >
                            <Button size="sm" className="w-full h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm">
                              Confirm Appointment Slot <ArrowRight className="size-3" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

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
            {isTranscribing && (
              <p className="text-sm text-muted-foreground animate-pulse" role="status">
                Transcribing your voice…
              </p>
            )}
            {!isTranscribing && busy && (
              <div className="flex flex-col gap-2 p-3 bg-muted/40 rounded-2xl max-w-[80%] border border-border/40 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    <BrainCircuit className="size-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground/80 pl-2">
                  MedDoc is evaluating symptoms against the Oxford Clinical Handbook guidelines...
                </p>
              </div>
            )}
            <div ref={endRef} />
          </CardContent>

          <div className="border-t border-border p-4">
            {showSuggestions && activeSuggestions.length > 0 && (
              <div className="mb-3 flex items-start justify-between gap-3 bg-muted/30 border border-border/40 p-2.5 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex flex-wrap gap-2 flex-1">
                  {activeSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs transition-colors text-left",
                        dynamicSuggestions.length > 0
                          ? "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 font-medium"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {dynamicSuggestions.length > 0 ? "→ " : ""}{s}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 transition-colors"
                  title="Hide suggestions"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            
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
              className="flex items-end gap-1.5 sm:gap-2"
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
              <div className="flex gap-1.5 shrink-0 mb-0.5 sm:mb-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Attach a file"
                  onClick={() => fileInputRef.current?.click()}
                  className="size-9 sm:size-10 rounded-full border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm"
                >
                  <Paperclip className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant={isListening ? "default" : "outline"}
                  size="icon"
                  aria-label={isListening ? "Stop recording" : "Start voice input"}
                  onClick={toggleListen}
                  className={`size-9 sm:size-10 rounded-full shadow-sm border-slate-200 dark:border-slate-800 ${
                    isListening ? "bg-red-500 border-red-500 hover:bg-red-600 animate-pulse text-white" : "text-slate-500"
                  }`}
                  disabled={isTranscribing}
                >
                  <Mic className="size-4" />
                </Button>
              </div>
              
              <div className="relative flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all flex items-end">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!busy && input.trim()) void send(input);
                    }
                  }}
                  placeholder="Describe your symptoms…"
                  aria-label="Message"
                  className="w-full resize-none border-0 bg-transparent py-3 sm:py-3.5 pl-4 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none min-h-[46px] max-h-[200px] text-sm"
                  rows={1}
                />
                <div className="absolute right-1.5 bottom-1.5">
                  <Button 
                    type="submit" 
                    size="icon" 
                    aria-label="Send message" 
                    disabled={busy || (isGuest && aiCredits <= 0)} 
                    className="size-8 sm:size-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-transform active:scale-95"
                  >
                    <Send className="size-3.5 sm:size-4" />
                  </Button>
                </div>
              </div>
            </form>
            <AiDisclaimer className="mt-3" />
            {isGuest && aiCredits <= 0 && (
              <div className="mt-3">
                <GuestCreditBanner creditsLeft={aiCredits} feature="AI Health Assistant" variant="exhausted" />
              </div>
            )}
            {isGuest && aiCredits > 0 && aiCredits <= 150 && (
              <div className="mt-3">
                <GuestCreditBanner creditsLeft={aiCredits} feature="AI Health Assistant" variant="warning" />
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="size-4 text-primary" aria-hidden="true" /> Assessment
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
                <Tabs defaultValue="topRated" onValueChange={handleTabChange}>
                  <TabsList className="flex w-full overflow-x-auto gap-1 h-auto p-1">
                    <TabsTrigger value="topRated" className="flex-1 min-w-[80px] text-xs sm:text-sm">Top rated</TabsTrigger>
                    <TabsTrigger value="nearest" className="flex items-center gap-1 flex-1 min-w-[80px] text-xs sm:text-sm">
                      {isLocating && <Loader2 className="size-3 animate-spin" />}
                      Nearest
                    </TabsTrigger>
                    <TabsTrigger value="mostAvailable" className="flex-1 min-w-[80px] text-xs sm:text-sm">Available</TabsTrigger>
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

