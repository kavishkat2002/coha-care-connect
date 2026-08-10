import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { consultPsychologist, transcribeAudio, type ChatMessage } from "@/services/ai.service";

export const Route = createFileRoute("/patient/medmind-ecare")({
  head: () => ({
    meta: [
      { title: "MedMind eCare — Live Psychological Support" },
      { name: "description", content: "Talk live with our AI psychological doctors, Nuwan and Ishani." },
    ],
  }),
  component: MedMindECare,
});

type DoctorName = "Nuwan" | "Ishani";

function MedMindECare() {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorName | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const [speechError, setSpeechError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [selectedDoctor]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBusy]);

  const toggleListen = async () => {
    if (isListening && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      if (synthRef.current) synthRef.current.cancel();

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
          stream.getTracks().forEach((track) => track.stop());

          setIsTranscribing(true);
          const transcript = await transcribeAudio(audioBlob);
          setIsTranscribing(false);

          if (transcript && transcript.trim()) {
            void handleSend(transcript.trim());
          }
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (err: any) {
        console.error("Mic error:", err);
        setSpeechError("Microphone access is blocked or unavailable.");
        setIsListening(false);
      }
    }
  };

  const speak = (text: string, doctorName: DoctorName) => {
    if (!synthRef.current || !soundEnabled) return;
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Pick a voice that matches the gender if possible
    const voices = synthRef.current.getVoices();
    const isMale = doctorName === "Nuwan";
    
    // Try to find a suitable voice
    const voice = voices.find(v => 
      v.lang.startsWith('en') && 
      (isMale ? v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('david') : 
                v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('samantha'))
    );
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = 0.9; // speak slightly slower for empathy
    utterance.pitch = isMale ? 0.9 : 1.1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || !selectedDoctor) return;
    
    // Cancel any ongoing speech
    if (synthRef.current) synthRef.current.cancel();

    const userMsg: ChatMessage = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsBusy(true);

    const history = [...messages, userMsg];
    
    const replyText = await consultPsychologist(history, selectedDoctor);
    
    const aiMsg: ChatMessage = { role: "assistant", content: replyText };
    setMessages(prev => [...prev, aiMsg]);
    setIsBusy(false);
    
    speak(replyText, selectedDoctor);
  };

  if (!selectedDoctor) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-bold text-[#0E3860] dark:text-blue-100">MedMind eCare</h1>
          <p className="text-muted-foreground">Select a psychological doctor to begin your live session.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Nuwan Card */}
          <Card 
            className="cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-300 group overflow-hidden"
            onClick={() => {
              setSelectedDoctor("Nuwan");
              const initMsg = "Hello, I am Nuwan. I'm here to listen. How are you feeling today?";
              setMessages([{ role: "assistant", content: initMsg }]);
              if (soundEnabled) speak(initMsg, "Nuwan");
            }}
          >
            <div className="h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
              <img 
                src="/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/nuwan_avatar_1786363440934.png" 
                alt="Dr. Nuwan" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80";
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Dr. Nuwan</CardTitle>
              <p className="text-sm text-muted-foreground">Senior Psychological Doctor (10+ Years)</p>
            </CardHeader>
          </Card>

          {/* Ishani Card */}
          <Card 
            className="cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-300 group overflow-hidden"
            onClick={() => {
              setSelectedDoctor("Ishani");
              const initMsg = "Hello, I am Ishani. I'm here to listen. How are you feeling today?";
              setMessages([{ role: "assistant", content: initMsg }]);
              if (soundEnabled) speak(initMsg, "Ishani");
            }}
          >
            <div className="h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
              <img 
                src="/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/ishani_avatar_1786363461362.png" 
                alt="Dr. Ishani" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594824813566-78a050f7514a?w=600&auto=format&fit=crop&q=80";
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Dr. Ishani</CardTitle>
              <p className="text-sm text-muted-foreground">Senior Psychological Doctor (10+ Years)</p>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const avatarSrc = selectedDoctor === "Nuwan" 
    ? "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/nuwan_avatar_1786363440934.png"
    : "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/ishani_avatar_1786363461362.png";

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => {
          setSelectedDoctor(null);
          if (synthRef.current) synthRef.current.cancel();
        }} className="text-muted-foreground">
          <ArrowLeft className="mr-2 size-4" /> Back to selection
        </Button>
        <Button variant="ghost" size="sm" onClick={() => {
          if (soundEnabled && synthRef.current) synthRef.current.cancel();
          setSoundEnabled(!soundEnabled);
        }}>
          {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
        {/* Avatar Area */}
        <div className="lg:w-1/3 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-border">
          <div className={`relative w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-700 ${isSpeaking ? 'scale-105 shadow-primary/30 ring-4 ring-primary/20' : 'scale-100'}`}>
            <img 
              src={avatarSrc} 
              alt={selectedDoctor} 
              onError={(e) => {
                const fallback = selectedDoctor === "Nuwan"
                  ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80"
                  : "https://images.unsplash.com/photo-1594824813566-78a050f7514a?w=600&auto=format&fit=crop&q=80";
                (e.target as HTMLImageElement).src = fallback;
              }}
              className="w-full h-full object-cover" 
            />
          </div>
          <h2 className="mt-6 text-2xl font-bold">Dr. {selectedDoctor}</h2>
          <p className="text-muted-foreground mb-8">Listening & ready to help.</p>
          
          <Button 
            size="lg" 
            className={`rounded-full w-20 h-20 shadow-lg transition-all duration-300 ${isListening ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse' : isTranscribing ? 'bg-amber-500 animate-spin' : 'bg-primary hover:scale-105'}`}
            onClick={toggleListen}
            disabled={isTranscribing}
          >
            {isListening ? <MicOff className="size-8" /> : <Mic className="size-8" />}
          </Button>
          <p className="mt-4 text-sm font-medium text-center text-muted-foreground">
            {isTranscribing ? "Processing voice..." : isListening ? "Listening... Tap mic when finished" : "Tap to speak live"}
          </p>
          {speechError && (
            <p className="mt-2 text-xs text-red-500 font-medium text-center max-w-xs">{speechError}</p>
          )}
        </div>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col shadow-soft border-border overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {isBusy && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-muted text-foreground rounded-tl-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isBusy) void handleSend(input);
                  }
                }}
                placeholder="Or type your message here..."
                className="min-h-[44px] max-h-[150px] resize-none overflow-y-auto py-3 bg-muted/30"
                rows={1}
              />
              <Button size="icon" onClick={() => handleSend(input)} disabled={isBusy || !input.trim()}>
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
