import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, ArrowLeft, Volume2, VolumeX, PhoneCall, PhoneOff, Sparkles, MessageSquare, Stethoscope, Star, Calendar, UserCheck, Lock, ShieldCheck, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { consultPsychologist, transcribeAudio, type ChatMessage } from "@/services/ai.service";
import { doctorService } from "@/services/doctor.service";
import { type Doctor } from "@/data/mock";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/patient/medmind-ecare")({
  head: () => ({
    meta: [
      { title: "MedMind eCare — Gemini Live Doctor Voice Call" },
      { name: "description", content: "Experience real-time hands-free voice calls with Dr. Nuwan & Dr. Ishani." },
    ],
  }),
  component: MedMindECare,
});

type DoctorName = "Nuwan" | "Ishani" | "Kavi";
type SessionMode = "live-call" | "chat";

function MedMindECare() {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorName | null>(null);
  const [mode, setMode] = useState<SessionMode>("live-call");
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [recommendedPsychiatrists, setRecommendedPsychiatrists] = useState<Doctor[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const isLiveActiveRef = useRef<boolean>(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const speechDetectedRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    async function checkMemberAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          setIsAuthenticated(true);
          return;
        }
      } catch (e) {
        console.warn("Supabase auth check error:", e);
      }

      // Check local storage member session fallback
      const localUser = localStorage.getItem("sb-access-token") || 
                        localStorage.getItem("coha_user") || 
                        localStorage.getItem("user") || 
                        localStorage.getItem("lifora_patient");
      if (localUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Automatically redirect unauthenticated / non-registered users directly to Sign in / Register!
        window.location.href = "/auth";
      }
    }
    void checkMemberAuth();

    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = () => {};
      }
    }

    // Fetch Recommended Psychiatrists from system database
    void doctorService.getDoctorsBySpecialty("Psychiatry").then((docs) => {
      setRecommendedPsychiatrists(docs);
    });

    return () => {
      isLiveActiveRef.current = false;
      stopAllAudio();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBusy]);

  // Synchronously prime Web Audio Context & SpeechSynthesis on user gesture
  const primeAudioContext = () => {
    if (typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") ctx.resume();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.resume();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.load();
      }
    }
  };

  const stopAllAudio = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = "";
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsSpeaking(false);
    setIsListening(false);
  };

  const fallbackBrowserTTS = (cleanText: string, doctorName: DoctorName, onEnded?: () => void) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      if (onEnded) onEnded();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-LK";
    utterance.volume = 1.0;
    
    // Natural Doctor / Best Friend Vocal Tuning
    const isMale = doctorName === "Nuwan";
    const isBestFriend = doctorName === "Kavi";
    utterance.rate = isMale ? 0.90 : isBestFriend ? 0.96 : 0.94; 
    utterance.pitch = isMale ? 0.88 : isBestFriend ? 1.04 : 1.05;

    const voices = synth.getVoices();
    if (voices.length > 0) {
      // Prioritize High-Quality Neural / Natural voices
      const sortedVoices = [...voices].sort((a, b) => {
        const aScore = (a.name.includes("Natural") || a.name.includes("Neural") || a.name.includes("Online")) ? 2 : 1;
        const bScore = (b.name.includes("Natural") || b.name.includes("Neural") || b.name.includes("Online")) ? 2 : 1;
        return bScore - aScore;
      });

      // 1. Try explicit Sri Lankan English voices
      let slVoice = sortedVoices.find(v => 
        (v.lang.includes("en-LK") || v.lang.includes("si-LK") || v.name.toLowerCase().includes("sri lanka") || v.name.toLowerCase().includes("sinhala")) &&
        (isMale ? !v.name.toLowerCase().includes("female") : true)
      );

      // 2. Fallback to British English (en-GB) Neural voices
      if (!slVoice) {
        slVoice = sortedVoices.find(v => 
          v.lang.includes("en-GB") && 
          (isMale 
            ? (v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("george") || v.name.toLowerCase().includes("oliver") || v.name.toLowerCase().includes("daniel") || v.name.toLowerCase().includes("uk english male")) 
            : (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("serena") || v.name.toLowerCase().includes("kate") || v.name.toLowerCase().includes("victoria") || v.name.toLowerCase().includes("uk english female")))
        );
      }

      // 3. Fallback to any natural English voice matching gender
      if (!slVoice) {
        slVoice = sortedVoices.find(v => 
          v.lang.startsWith("en") && 
          (isMale ? !v.name.toLowerCase().includes("female") : true)
        );
      }

      if (slVoice) utterance.voice = slVoice;
    }

    let keepAliveInterval: any = null;

    utterance.onstart = () => {
      setIsSpeaking(true);
      keepAliveInterval = setInterval(() => {
        if (!synth.speaking) {
          clearInterval(keepAliveInterval);
        } else {
          synth.resume();
        }
      }, 2000);
    };

    utterance.onend = () => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      setIsSpeaking(false);
      if (onEnded) onEnded();
    };

    utterance.onerror = (err) => {
      console.warn("Speech synthesis error:", err);
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      setIsSpeaking(false);
      if (onEnded) onEnded();
    };

    if (synth.paused) synth.resume();
    synth.cancel();

    setTimeout(() => {
      synth.resume();
      synth.speak(utterance);
    }, 50);
  };

  const speakText = (text: string, doctorName: DoctorName, onEnded?: () => void) => {
    if (!soundEnabled) {
      if (onEnded) onEnded();
      return;
    }

    // Format text with natural human breath pauses & clear pronunciation
    let cleanText = text
      .replace(/[*#_`]/g, "")
      .replace(/\bDr\./gi, "Doctor")
      .replace(/\bvs\./gi, "versus")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      if (onEnded) onEnded();
      return;
    }

    stopAllAudio();

    // 1. Play soft activation chime via Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch (e) {
      console.warn("AudioContext chime error:", e);
    }

    // 2. High Quality Natural Voice Stream
    const isMale = doctorName === "Nuwan";
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText.slice(0, 240))}&tl=en-GB&client=tw-ob`;
    const audio = new Audio(ttsUrl);
    audioPlayerRef.current = audio;
    audio.playbackRate = isMale ? 0.90 : 0.94;

    let fallbackTriggered = false;
    const triggerFallback = () => {
      if (fallbackTriggered) return;
      fallbackTriggered = true;
      console.log("Fallback to browser Sri Lankan SpeechSynthesis voice...");
      fallbackBrowserTTS(cleanText, doctorName, onEnded);
    };

    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => {
      setIsSpeaking(false);
      if (onEnded) onEnded();
    };
    audio.onerror = triggerFallback;

    audio.play().catch(triggerFallback);
  };

  // Hands-free continuous listening loop with Voice Activity Detection (VAD) & Silence Detection
  const startListeningLoop = async () => {
    setSpeechError(null);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    speechDetectedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Web Audio API Analyser for Voice Activity & Silence Detection (RMS Time Domain)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let hasUserSpoken = false;
      let lastSpeechTime = 0;
      const recordingStart = Date.now();

      const checkVAD = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
          audioCtx.close();
          return;
        }

        // Time domain RMS calculation for voice energy
        analyser.getByteTimeDomainData(dataArray);
        let sumSquare = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (dataArray[i] || 128) - 128;
          sumSquare += val * val;
        }
        const rms = Math.sqrt(sumSquare / bufferLength);

        // Human speech energy threshold (RMS > 4.5)
        if (rms > 4.5) {
          hasUserSpoken = true;
          lastSpeechTime = Date.now();
        }

        // Only stop recording when the user HAS spoken and then pauses quietly for 1.5s (1500ms)
        if (hasUserSpoken && lastSpeechTime > 0 && Date.now() - lastSpeechTime > 1500) {
          console.log("VAD: User finished speaking (1.5s silence). Processing doctor response...");
          audioCtx.close();
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
          }
          return;
        }

        // Upper safety cap (30s) so mic doesn't stay open forever if unattended
        if (Date.now() - recordingStart > 30000) {
          console.log("VAD: 30s safety cap reached. Processing response...");
          audioCtx.close();
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
          }
          return;
        }

        animFrameRef.current = requestAnimationFrame(checkVAD);
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());

        // If no audio chunks were recorded, restart listening
        if (audioChunksRef.current.length === 0 || audioBlob.size === 0) {
          if (isLiveActiveRef.current && mode === "live-call") {
            setTimeout(() => {
              if (isLiveActiveRef.current && !isSpeaking && !isBusy) {
                void startListeningLoop();
              }
            }, 600);
          }
          return;
        }

        setIsTranscribing(true);
        const transcript = await transcribeAudio(audioBlob);
        setIsTranscribing(false);

        if (transcript && transcript.trim()) {
          void processUserMessage(transcript.trim());
        } else if (isLiveActiveRef.current) {
          setTimeout(() => {
            if (isLiveActiveRef.current && !isSpeaking && !isBusy) {
              void startListeningLoop();
            }
          }, 600);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      animFrameRef.current = requestAnimationFrame(checkVAD);
    } catch (err) {
      console.error("Mic VAD error:", err);
      setSpeechError("Microphone permission denied. Please allow microphone access.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const processUserMessage = async (userText: string) => {
    if (!userText.trim() || !selectedDoctor) return;

    const userMsg: ChatMessage = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsBusy(true);

    const history = [...messagesRef.current, userMsg];
    const replyText = await consultPsychologist(history, selectedDoctor);
    
    const aiMsg: ChatMessage = { role: "assistant", content: replyText };
    setMessages((prev) => [...prev, aiMsg]);
    setIsBusy(false);

    // Speak response out loud & auto-resume microphone listening in Live Call Mode!
    speakText(replyText, selectedDoctor, () => {
      if (isLiveActiveRef.current && mode === "live-call") {
        setTimeout(() => {
          if (isLiveActiveRef.current) {
            void startListeningLoop();
          }
        }, 500);
      }
    });
  };

  const startDoctorSession = (docName: DoctorName) => {
    primeAudioContext();
    setSelectedDoctor(docName);
    isLiveActiveRef.current = true;

    const greeting = docName === "Nuwan" 
      ? "Hello, I am Dr. Nuwan. I'm here as your psychological doctor. Tell me what's on your mind today."
      : docName === "Ishani"
      ? "Hello, I am Dr. Ishani. I'm listening closely. How are you feeling today?"
      : "Hey bestie! I'm Kavi, your best friend and mood fixer. I'm right here with you—tell me what's going on or how you're feeling today!";
    
    setMessages([{ role: "assistant", content: greeting }]);

    // Speak initial greeting and start hands-free voice loop!
    speakText(greeting, docName, () => {
      if (isLiveActiveRef.current && mode === "live-call") {
        void startListeningLoop();
      }
    });
  };

  const toggleLiveCallMode = () => {
    primeAudioContext();
    if (isLiveActiveRef.current) {
      // End Live Call
      isLiveActiveRef.current = false;
      stopAllAudio();
    } else if (selectedDoctor) {
      // Start Live Call
      isLiveActiveRef.current = true;
      void startListeningLoop();
    }
  };

  if (isAuthenticated === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Redirecting to Sign in / Register...</p>
      </div>
    );
  }

  if (!selectedDoctor) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <div className="text-center space-y-2 mb-10">
          <div className="flex items-center justify-center gap-2.5">
            <h1 className="text-3xl font-bold text-[#0E3860] dark:text-blue-100">MedMind eCare</h1>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold px-2.5 py-0.5 uppercase tracking-wider rounded-md">
              BETA
            </Badge>
          </div>
          <p className="text-muted-foreground">Choose a character to start your live voice session.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Dr. Nuwan Card */}
          <Card 
            className="cursor-pointer hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden border-2"
            onClick={() => startDoctorSession("Nuwan")}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <Button size="sm" className="w-full rounded-full gap-2 text-xs">
                  <PhoneCall className="size-3.5" /> Call Dr. Nuwan
                </Button>
              </div>
            </div>
            <CardHeader className="text-center p-4">
              <CardTitle className="text-lg">Dr. Nuwan</CardTitle>
              <p className="text-xs text-muted-foreground">Senior Psychological Doctor</p>
            </CardHeader>
          </Card>

          {/* Dr. Ishani Card */}
          <Card 
            className="cursor-pointer hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden border-2"
            onClick={() => startDoctorSession("Ishani")}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <Button size="sm" className="w-full rounded-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-xs">
                  <PhoneCall className="size-3.5" /> Call Dr. Ishani
                </Button>
              </div>
            </div>
            <CardHeader className="text-center p-4">
              <CardTitle className="text-lg">Dr. Ishani</CardTitle>
              <p className="text-xs text-muted-foreground">Senior Psychological Doctor</p>
            </CardHeader>
          </Card>

          {/* Kavi (Mood Fixer & Best Friend) Card */}
          <Card 
            className="cursor-pointer hover:border-amber-500/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden border-2 border-amber-500/30"
            onClick={() => startDoctorSession("Kavi")}
          >
            <div className="h-64 bg-amber-50 dark:bg-amber-950/40 relative overflow-hidden flex items-center justify-center">
              <img 
                src="/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/kavi_bestfriend_avatar_1786373760801.png" 
                alt="Kavi (Mood Fixer)" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80";
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <Button size="sm" className="w-full rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs">
                  Talk to Bestie Kavi
                </Button>
              </div>
            </div>
            <CardHeader className="text-center p-4">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <CardTitle className="text-lg">Kavi</CardTitle>
                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] py-0">Mood Fixer</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Your Best Friend & Mood Booster</p>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const avatarSrc = selectedDoctor === "Nuwan" 
    ? "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/nuwan_avatar_1786363440934.png"
    : selectedDoctor === "Ishani"
    ? "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/ishani_avatar_1786363461362.png"
    : "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/kavi_bestfriend_avatar_1786373760801.png";

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto gap-4">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Navigation & Mode Toggle */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => {
          isLiveActiveRef.current = false;
          stopAllAudio();
          setSelectedDoctor(null);
        }} className="text-muted-foreground">
          <ArrowLeft className="mr-2 size-4" /> Change doctor
        </Button>

        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-full border border-border">
          <Button 
            size="sm" 
            variant={mode === "live-call" ? "default" : "ghost"} 
            className="rounded-full gap-1.5"
            onClick={() => {
              setMode("live-call");
              if (!isLiveActiveRef.current) toggleLiveCallMode();
            }}
          >
            <PhoneCall className="size-3.5" /> Gemini Live Voice Mode
          </Button>
          <Button 
            size="sm" 
            variant={mode === "chat" ? "default" : "ghost"} 
            className="rounded-full gap-1.5"
            onClick={() => setMode("chat")}
          >
            <MessageSquare className="size-3.5" /> Text & Voice Chat
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={() => {
          if (soundEnabled) stopAllAudio();
          setSoundEnabled(!soundEnabled);
        }}>
          {soundEnabled ? <Volume2 className="size-4 text-primary" /> : <VolumeX className="size-4 text-muted-foreground" />}
        </Button>
      </div>

      {mode === "live-call" ? (
        /* ── Gemini Live Voice Call Full Screen Mode ── */
        <Card className="flex-1 flex flex-col items-center justify-between p-6 md:p-8 bg-slate-950 text-white rounded-3xl border-slate-800 shadow-2xl relative overflow-y-auto min-h-0">
          {/* Top Status */}
          <div className="flex flex-col items-center gap-1.5 z-10">
            <Badge variant="outline" className="border-slate-700 text-slate-300 gap-1.5 py-1 px-4 text-xs bg-slate-900/80">
              <span className={`size-2 rounded-full ${isLiveActiveRef.current ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
              {isLiveActiveRef.current ? "Live Voice Session Active" : "Call Paused"}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {selectedDoctor === "Kavi" ? "Kavi" : `Dr. ${selectedDoctor}`}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              {selectedDoctor === "Kavi" ? "Your Best Friend & Mood Fixer" : "Senior Psychological Doctor"}
            </p>
          </div>

          {/* 3D Doctor Avatar with Glowing Soundwave Rings */}
          <div className="relative flex items-center justify-center my-4 md:my-6 z-10">
            {isSpeaking && (
              <>
                <div className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-emerald-500/40 animate-ping" />
                <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full border-2 border-emerald-500/20 animate-pulse" />
              </>
            )}
            {isListening && (
              <>
                <div className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-blue-500/40 animate-ping" />
                <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full border-2 border-blue-500/20 animate-pulse" />
              </>
            )}

            <div 
              onClick={() => {
                if (isListening && mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                  mediaRecorderRef.current.stop();
                }
              }}
              className={`relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-full overflow-hidden border-4 transition-all duration-500 cursor-pointer ${
              isSpeaking 
                ? "border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)] scale-105" 
                : isListening 
                ? "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.5)] scale-105 hover:scale-110" 
                : "border-slate-700 shadow-2xl"
            }`}
              title={isListening ? "Tap to finish speaking & get instant reply" : ""}
            >
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
          </div>

          {/* Real-time Voice Call State Banner */}
          <div className="z-10 flex flex-col items-center gap-2 max-w-lg w-full">
            {isSpeaking ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-5 py-1.5 rounded-full text-emerald-400 font-semibold text-xs md:text-sm animate-pulse">
                <Volume2 className="size-4 animate-bounce" /> {selectedDoctor === "Kavi" ? "Kavi" : `Dr. ${selectedDoctor}`} is speaking...
              </div>
            ) : isListening ? (
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-5 py-1.5 rounded-full text-blue-400 font-semibold text-xs md:text-sm animate-pulse">
                <Mic className="size-4 animate-bounce" /> Listening to you... Speak naturally
              </div>
            ) : isBusy || isTranscribing ? (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-5 py-1.5 rounded-full text-amber-400 font-semibold text-xs md:text-sm animate-pulse">
                <Sparkles className="size-4 animate-spin" /> Processing your voice...
              </div>
            ) : (
              <div className="text-slate-400 text-xs md:text-sm">Tap the microphone to speak</div>
            )}

            {speechError && (
              <p className="text-xs text-red-400 max-w-sm text-center font-medium bg-red-950/50 p-2 rounded-lg border border-red-800">{speechError}</p>
            )}

            {/* Latest Transcribed Statement Preview */}
            {messages.length > 0 && (
              <p className="text-xs text-slate-300 italic max-w-md text-center bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 line-clamp-2">
                "{messages[messages.length - 1]?.content}"
              </p>
            )}
          </div>

          {/* Call Control Actions Bar (Always Fully Visible) */}
          <div className="flex items-center gap-6 z-10 my-3">
            <Button
              size="lg"
              className={`rounded-full w-14 h-14 md:w-16 md:h-16 shadow-xl transition-transform hover:scale-110 ${
                isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={() => {
                primeAudioContext();
                if (isListening) {
                  stopListening();
                } else {
                  void startListeningLoop();
                }
              }}
              disabled={isBusy || isTranscribing}
              title={isListening ? "Mute Microphone" : "Unmute Microphone"}
            >
              {isListening ? <MicOff className="size-6 md:size-7" /> : <Mic className="size-6 md:size-7" />}
            </Button>

            <Button
              size="lg"
              variant="destructive"
              className="rounded-full w-14 h-14 md:w-16 md:h-16 shadow-xl bg-red-600 hover:bg-red-700 transition-transform hover:scale-110"
              onClick={() => {
                isLiveActiveRef.current = false;
                stopAllAudio();
                setMode("chat");
              }}
              title="End Live Call"
            >
              <PhoneOff className="size-6 md:size-7" />
            </Button>
          </div>
        </Card>
      ) : (
        /* ── Standard Text & Voice Chat Mode ── */
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
          <div className="lg:w-1/3 flex flex-col items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-border overflow-y-auto">
            <div className="flex flex-col items-center text-center w-full">
              <div className={`relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 ${isSpeaking ? "scale-105 ring-4 ring-primary/40 shadow-primary/20" : ""}`}>
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
              <h2 className="mt-3 text-lg font-bold">{selectedDoctor === "Kavi" ? "Kavi" : `Dr. ${selectedDoctor}`}</h2>
              <p className="text-xs text-muted-foreground mb-4">
                {selectedDoctor === "Kavi" ? "Your Best Friend & Mood Booster" : "Senior Psychological Doctor"}
              </p>

              <Button 
                size="sm"
                className="w-full rounded-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white mb-6"
                onClick={() => {
                  setMode("live-call");
                  toggleLiveCallMode();
                }}
              >
                <PhoneCall className="size-4" /> Switch to Gemini Live Mode
              </Button>
            </div>

            {/* Recommended System Psychiatrists Section */}
            <div className="w-full pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Stethoscope className="size-3.5 text-primary" /> Top Psychiatrists in System
                </span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 py-0">
                  Verified
                </Badge>
              </div>

              {recommendedPsychiatrists.slice(0, 2).map((psych) => (
                <div key={psych.id} className="p-3 bg-background rounded-2xl border border-border shadow-xs hover:border-primary/40 transition-all flex flex-col gap-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs leading-tight text-foreground">{psych.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{psych.hospital}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                      <Star className="size-3 fill-amber-500" /> {psych.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {psych.nextSlot}</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Rs. {psych.fee.toLocaleString()}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full rounded-xl text-[11px] gap-1 h-7 border-primary/30 hover:bg-primary hover:text-white"
                    onClick={() => {
                      window.location.href = `/patient/appointments?doctor=${encodeURIComponent(psych.name)}`;
                    }}
                  >
                    <UserCheck className="size-3" /> Book Channel
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Card className="flex-1 flex flex-col shadow-soft border-border overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-start gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 relative group ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.role === "assistant" && (
                      <button
                        onClick={() => {
                          primeAudioContext();
                          speakText(m.content, selectedDoctor);
                        }}
                        className="mt-1.5 flex items-center gap-1 text-xs text-primary hover:underline focus:outline-none"
                        title="Replay voice audio"
                      >
                        <Volume2 className="size-3.5" /> Replay voice
                      </button>
                    )}
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
                      if (!isBusy) {
                        primeAudioContext();
                        void processUserMessage(input);
                      }
                    }
                  }}
                  placeholder="Type a message or use Gemini Live Call..."
                  className="min-h-[44px] max-h-[150px] resize-none overflow-y-auto py-3 bg-muted/30"
                  rows={1}
                />
                <Button size="icon" onClick={() => {
                  primeAudioContext();
                  void processUserMessage(input);
                }} disabled={isBusy || !input.trim()}>
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
