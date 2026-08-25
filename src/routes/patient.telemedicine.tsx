import { createFileRoute } from "@tanstack/react-router";
import {
  MessageSquare,
  Phone,
  Video,
  Search,
  UserCheck,
  Calendar,
  Clock,
  Heart,
  FileText,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Image as ImageIcon,
  Download,
  File,
  Mic,
  MicOff,
  XCircle,
  VideoOff,
  CreditCard,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctors, SPECIALTIES, type Doctor } from "@/data/mock";
import { doctorService } from "@/services/doctor.service";
import { patientService, type DbAppointment } from "@/services/patient.service";
import { supabase } from "@/lib/supabase";
import { useWebRTC } from "@/hooks/use-webrtc";

export const Route = createFileRoute("/patient/telemedicine")({
  head: () => ({
    meta: [
      { title: "Telemedicine — MedDoc" },
      {
        name: "description",
        content: "Consult online doctors by video, voice or chat, with digital prescriptions and follow-ups.",
      },
      { property: "og:title", content: "Telemedicine — MedDoc" },
      { property: "og:description", content: "Video, voice and chat consultations with online doctors." },
    ],
  }),
  component: TelemedicinePage,
});

const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "01:30 PM",
  "03:00 PM",
  "05:00 PM",
  "07:30 PM",
];

export type ChatAttachment = {
  type: "image" | "pdf";
  url: string;
  name: string;
};

export type ChatMessage = {
  id: string;
  sender: "patient" | "doctor";
  text?: string;
  attachment?: ChatAttachment;
  timestamp: string;
};

function TelemedicinePage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [hospital, setHospital] = useState("");
  const [viewFilter, setViewFilter] = useState<"all" | "favorites">("all");
  const [rosterDoctors, setRosterDoctors] = useState<Doctor[]>([]);

  // Favorite Doctors State
  const [favDoctorIds, setFavDoctorIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("meddoc_favorite_doctors") || "[]");
      } catch (e) {}
    }
    return [];
  });

  // Telemedicine Sessions State
  const [myAppointments, setMyAppointments] = useState<DbAppointment[]>([]);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [consultationMode, setConsultationMode] = useState<"Video Call" | "Voice Call" | "Chat">("Video Call");
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split("T")[0] || "");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("09:30 AM");
  const [patientNotes, setPatientNotes] = useState<string>("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Patient - Doctor Live Chat Modal State
  const [activeChatAppt, setActiveChatAppt] = useState<DbAppointment | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessageInput, setNewMessageInput] = useState("");
  const [isProcessingRebook, setIsProcessingRebook] = useState(false);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const todayStr = new Date().toISOString().split("T")[0] || "";


  useEffect(() => {
    async function load() {
      const [docs, appts] = await Promise.all([
        doctorService.getAllDoctors(),
        patientService.getAppointments(),
      ]);
      if (docs && docs.length > 0) {
        setRosterDoctors(docs);
      }
      setMyAppointments(appts);
    }
    void load();
    
    // Real-time updates for appointments
    const channel = supabase.channel("patient_telemedicine_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => { void load(); }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleFavoriteDoctor = (docId: string, docName: string) => {
    let updated: string[];
    if (favDoctorIds.includes(docId)) {
      updated = favDoctorIds.filter((id) => id !== docId);
      toast.info(`Removed ${docName} from your Favorite Doctors`);
    } else {
      updated = [...favDoctorIds, docId];
      toast.success(`Saved ${docName} to your Favorite Doctors!`);
    }
    setFavDoctorIds(updated);
    localStorage.setItem("meddoc_favorite_doctors", JSON.stringify(updated));
  };

  const allAvailableDoctors = useMemo(() => {
    const list = rosterDoctors.length > 0 ? rosterDoctors : doctors;
    return list.filter((d) => d.online !== false);
  }, [rosterDoctors]);

  const filteredDoctors = useMemo(() => {
    return allAvailableDoctors.filter((d) => {
      const q = query.trim().toLowerCase();
      const h = hospital.trim().toLowerCase();
      const matchesQuery = !q || (d.name || "").toLowerCase().includes(q);
      const matchesSpecialty = specialty === "all" || d.specialty === specialty;
      const matchesHospital = !h || (d.hospital || "").toLowerCase().includes(h);
      const matchesFav = viewFilter === "all" || favDoctorIds.includes(d.id);
      return matchesQuery && matchesSpecialty && matchesHospital && matchesFav;
    });
  }, [allAvailableDoctors, query, specialty, hospital, viewFilter, favDoctorIds]);

  const openScheduleModal = (doc: Doctor, mode: "Video Call" | "Voice Call" | "Chat") => {
    setBookingDoctor(doc);
    setConsultationMode(mode);
    setSelectedDate(new Date().toISOString().split("T")[0] || "");
    setSelectedTimeSlot("09:30 AM");
    setPatientNotes("");
  };

  const handleConfirmSchedule = async () => {
    if (!bookingDoctor) return;
    setIsSubmittingBooking(true);

    try {
      const profile = await patientService.getPatientProfile();
      const created = await patientService.bookAppointment({
        doctor_id: bookingDoctor.id,
        hospital_id: bookingDoctor.hospital || "h1",
        date: selectedDate,
        time: selectedTimeSlot,
        patient_name: profile?.name || "Mahinda Rajapaksha",
        patient_mobile: profile?.phone || "+94 77 123 4567",
        patient_email: profile?.email || "mahinda@meddoc.lk",
        status: "Approved", // Approved by default for instant telemedicine access
        fee: bookingDoctor.fee || 2500,
      });

      // Reload appointments list
      const updatedAppts = await patientService.getAppointments();
      setMyAppointments(updatedAppts);

      setIsSubmittingBooking(false);
      setBookingDoctor(null);

      toast.success(`Telemedicine ${consultationMode} Scheduled!`, {
        description: `Your consultation with ${bookingDoctor.name} on ${selectedDate} at ${selectedTimeSlot} is approved.`,
      });
    } catch (e) {
      setIsSubmittingBooking(false);
      setBookingDoctor(null);
    }
  };

  // Open Live Chat Modal with Doctor
  const openChatWithDoctor = (appt: DbAppointment) => {
    setActiveChatAppt(appt);
    const chatKey = `meddoc_chat_${appt.id}`;
    const stored = localStorage.getItem(chatKey);
    if (stored) {
      try {
        setChatMessages(JSON.parse(stored));
      } catch (e) {
        setChatMessages(getInitialChatMessages(appt));
      }
    } else {
      const initial = getInitialChatMessages(appt);
      setChatMessages(initial);
      localStorage.setItem(chatKey, JSON.stringify(initial));
    }
  };

  // Sync chat messages across tabs/windows and devices via Supabase
  useEffect(() => {
    if (!activeChatAppt) return;
    
    // Listen for cross-tab local storage events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `meddoc_chat_${activeChatAppt.id}` && e.newValue) {
        try {
          setChatMessages(JSON.parse(e.newValue));
        } catch (error) {}
      }
    };
    window.addEventListener("storage", handleStorage);
    
    // Listen for remote messages via Supabase
    const channel = supabase.channel(`chat_${activeChatAppt.id}`);
    channel
      .on("broadcast", { event: "new_message" }, ({ payload }) => {
        setChatMessages((prev) => {
          if (prev.some(m => m.id === payload.id)) return prev;
          const newArray = [...prev, payload];
          localStorage.setItem(`meddoc_chat_${activeChatAppt.id}`, JSON.stringify(newArray));
          return newArray;
        });
      })
      .on("broadcast", { event: "session_ended" }, () => {
        setActiveChatAppt((prev) => prev ? { ...prev, status: "Completed" } : null);
        toast.info("The doctor has ended the consultation session.");
      })
      .subscribe();

    return () => {
      window.removeEventListener("storage", handleStorage);
      supabase.removeChannel(channel);
    };
  }, [activeChatAppt]);

  const getInitialChatMessages = (appt: DbAppointment): ChatMessage[] => [
    {
      id: "m1",
      sender: "doctor",
      text: `Hello ${appt.patient_name || "Patient"}, your telemedicine appointment has been approved. I have reviewed your health background. How are you feeling today?`,
      timestamp: "09:31 AM",
    },
  ];

  const handleSendPatientMessage = () => {
    if (!newMessageInput.trim() || !activeChatAppt) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "patient",
      text: newMessageInput.trim(),
      timestamp: nowTime,
    };

    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setNewMessageInput("");

    const chatKey = `meddoc_chat_${activeChatAppt.id}`;
    localStorage.setItem(chatKey, JSON.stringify(updated));

    // Broadcast over Supabase for real-time remote sync
    supabase.channel(`chat_${activeChatAppt.id}`).send({
      type: "broadcast",
      event: "new_message",
      payload: userMsg,
    });
  };

  const handleRebookSession = async () => {
    if (!activeChatAppt?.id) return;
    
    setIsProcessingRebook(true);
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "Scheduled" })
        .eq("id", activeChatAppt.id);
        
      if (error) throw error;
      
      toast.success("Payment successful! Session reactivated.");
      setActiveChatAppt({ ...activeChatAppt, status: "Scheduled" });
      
      // Refresh local list silently
      patientService.getAppointments().then(setMyAppointments).catch(() => {});
    } catch (e) {
      toast.error("Failed to rebook session.");
    } finally {
      setIsProcessingRebook(false);
    }
  };

  // Handle Photo & PDF File Upload from Patient
  const handlePatientFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatAppt) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileUrl = event.target?.result as string;
      const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
      const isImg = file.type.startsWith("image/");

      if (!isPdf && !isImg) {
        toast.error("Please upload an image (JPG, PNG) or PDF document");
        return;
      }

      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const fileMsg: ChatMessage = {
        id: "file-" + Date.now(),
        sender: "patient",
        attachment: {
          type: isPdf ? "pdf" : "image",
          url: fileUrl,
          name: file.name,
        },
        timestamp: nowTime,
      };

      const updated = [...chatMessages, fileMsg];
      setChatMessages(updated);

      const chatKey = `meddoc_chat_${activeChatAppt.id}`;
      localStorage.setItem(chatKey, JSON.stringify(updated));

      // Broadcast over Supabase for real-time remote sync
      supabase.channel(`chat_${activeChatAppt.id}`).send({
        type: "broadcast",
        event: "new_message",
        payload: fileMsg,
      });

      toast.success(`Shared ${isPdf ? "PDF document" : "photo"} with doctor!`);

      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Live Video Meeting Modal State
  const [activeVideoDoctor, setActiveVideoDoctor] = useState<Doctor | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (activeVideoDoctor) {
      timer = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSeconds(0);
    }
    return () => clearInterval(timer);
  }, [activeVideoDoctor]);

  const activeVideoAppt = useMemo(() => {
    if (!activeVideoDoctor) return null;
    return myAppointments.find(a => a.doctor_id === activeVideoDoctor.id) || null;
  }, [activeVideoDoctor, myAppointments]);

  const { localStream, remoteStream, startCall } = useWebRTC(activeVideoAppt?.id || null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);


  const formatCallTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isCallDateAvailable = (apptDate?: string) => {
    if (!apptDate) return true;
    const today = new Date().toISOString().split("T")[0] || "";
    return apptDate <= today;
  };

  const groupedConsultations = useMemo(() => {
    const map = new Map<string, { doctor: Doctor; appts: DbAppointment[] }>();

    for (const appt of myAppointments) {
      const docId = appt.doctor_id || "d1";
      const docObj = (rosterDoctors.length > 0 ? rosterDoctors : doctors).find(
        (d) => d.id === docId
      ) || {
        id: docId,
        name: appt.doctor_id || "Dr. Menaka De Alwis",
        specialty: "Gynaecology",
        hospital: "Metro Cancer Institute",
        fee: appt.fee || 5500,
      };

      if (!map.has(docId)) {
        map.set(docId, { doctor: docObj as Doctor, appts: [] });
      }
      map.get(docId)!.appts.push(appt);
    }
    return Array.from(map.values());
  }, [myAppointments, rosterDoctors]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="Telemedicine Doctors"
        description="Find verified specialists, save favorite doctors, review health background approvals, and launch live HD video consultations."
      />

      {/* Active Telemedicine Consultations Section */}
      {groupedConsultations.length > 0 && (
        <Card className="shadow-soft border border-blue-100 dark:border-blue-900/40 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:to-slate-950 rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Video className="size-4 text-emerald-600 dark:text-emerald-400" />
                My Scheduled Video Consultations & Follow-ups ({groupedConsultations.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              {groupedConsultations.map(({ doctor, appts }) => {
                const latestAppt = appts[0];
                if (!latestAppt) return null;

                const isCompleted = latestAppt.status === "Completed";
                const canJoinVideo = !isCompleted && isCallDateAvailable(latestAppt.date);

                return (
                  <div
                    key={doctor.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {doctor.name}
                        </span>
                        <Badge
                          className={`text-[10px] font-bold px-1.5 py-0.2 ${
                            isCompleted
                              ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                          }`}
                        >
                          {isCompleted ? "Session Completed" : "Approved"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {appts.length > 1
                          ? `${appts.length} Appointments (Latest: ${latestAppt.date} at ${latestAppt.time})`
                          : `${latestAppt.date} at ${latestAppt.time} • Fee: LKR ${(latestAppt.fee || 5500).toLocaleString()}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Prominent Video Call Icon Button */}
                      {isCompleted ? (
                        <Button
                          size="sm"
                          disabled
                          className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 text-xs h-8.5 rounded-xl font-medium gap-1 cursor-not-allowed opacity-75"
                        >
                          <CheckCircle2 className="size-3.5 text-slate-400" />
                          <span>Session Ended</span>
                        </Button>
                      ) : canJoinVideo ? (
                        <Button
                          size="sm"
                          onClick={() => setActiveVideoDoctor(doctor)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8.5 rounded-xl font-semibold gap-1.5 shadow-sm"
                        >
                          <Video className="size-4 animate-pulse" />
                          <span>Join Video Call</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled
                          title={`Video call unlocks on ${latestAppt.date}`}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 text-xs h-8.5 rounded-xl font-medium gap-1.5 cursor-not-allowed opacity-80"
                        >
                          <Clock className="size-3.5" />
                          <span>Available {latestAppt.date}</span>
                        </Button>
                      )}

                      {/* Chat Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openChatWithDoctor(latestAppt)}
                        className="text-xs h-8.5 rounded-xl font-medium gap-1 border-slate-200 dark:border-slate-700"
                      >
                        <MessageSquare className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter Section */}
      <Card className="shadow-soft border border-border bg-card rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={viewFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewFilter("all")}
                className="text-xs h-8.5 rounded-full font-medium"
              >
                All Telemedicine Doctors ({allAvailableDoctors.length})
              </Button>
              <Button
                type="button"
                variant={viewFilter === "favorites" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewFilter("favorites")}
                className={`text-xs h-8.5 rounded-full font-medium gap-1.5 ${
                  viewFilter === "favorites" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""
                }`}
              >
                <Heart className={`size-3.5 ${favDoctorIds.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
                My Favorites ({favDoctorIds.length})
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
            {/* Doctor Name Search */}
            <div className="space-y-2">
              <Label htmlFor="doc-search" className="text-xs font-bold text-foreground">
                Doctor Name
              </Label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="doc-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search doctor name"
                  className="pl-9.5 h-10 rounded-full text-xs"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="space-y-2">
              <Label htmlFor="specialty-filter" className="text-xs font-bold text-foreground">
                Specialization
              </Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger id="specialty-filter" className="h-10 rounded-full text-xs">
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All specialties</SelectItem>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hospital Search Filter */}
            <div className="space-y-2">
              <Label htmlFor="hospital-search" className="text-xs font-bold text-foreground">
                Hospital / Clinic
              </Label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="hospital-search"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="Search hospital name"
                  className="pl-9.5 h-10 rounded-full text-xs"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Doctors List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Available Telemedicine Specialists ({filteredDoctors.length})
          </p>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-muted/20 border border-border">
            <p className="text-sm font-semibold text-foreground">
              {viewFilter === "favorites"
                ? "No favorite doctors added yet."
                : "No telemedicine doctors matched your search criteria."}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {viewFilter === "favorites"
                ? "Click the heart icon on any doctor card to save them as a favorite!"
                : "Try resetting the specialty or doctor name filter."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setSpecialty("all");
                setHospital("");
                setViewFilter("all");
              }}
              className="mt-4 rounded-xl text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredDoctors.map((d) => {
              const isFav = favDoctorIds.includes(d.id);
              return (
                <Card key={d.id} className="shadow-soft hover:shadow-md transition-all rounded-2xl border border-border relative">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-13 border border-border">
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-sm">
                            {d.photoInitials || d.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-base text-foreground leading-tight">{d.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {d.specialty} · {d.hospital || "Metro Cancer Institute"}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                            Languages: {d.languages?.join(", ") || "English, Sinhala"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Favorite Button Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleFavoriteDoctor(d.id, d.name)}
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                          className={`p-2 rounded-full border transition-all ${
                            isFav
                              ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 shadow-xs"
                              : "bg-muted/30 border-border text-slate-400 hover:text-rose-500 hover:bg-rose-50/50"
                          }`}
                        >
                          <Heart className={`size-4 ${isFav ? "fill-rose-600" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { label: "Video Call" as const, icon: Video },
                        { label: "Voice Call" as const, icon: Phone },
                        { label: "Chat" as const, icon: MessageSquare },
                      ].map((mode) => (
                        <Button
                          key={mode.label}
                          variant="outline"
                          size="sm"
                          onClick={() => openScheduleModal(d, mode.label)}
                          className="rounded-xl text-xs h-9 font-medium gap-1.5 hover:border-blue-500 hover:text-blue-600"
                        >
                          <mode.icon className="size-3.5 text-blue-600 dark:text-blue-400" />
                          <span className="truncate">{mode.label}</span>
                        </Button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        LKR {d.fee?.toLocaleString() || "5,500"} / Visit
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        <UserCheck className="size-3 text-emerald-500" />
                        Digital Prescription Included
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule Telemedicine Session Modal */}
      <Dialog open={!!bookingDoctor} onOpenChange={() => setBookingDoctor(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Calendar className="size-5 text-blue-600 dark:text-blue-400" />
              Schedule {consultationMode}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select your preferred date and time slot for your online consultation.
            </DialogDescription>
          </DialogHeader>

          {bookingDoctor && (
            <div className="space-y-4 py-2">
              {/* Doctor Summary Header */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center gap-3">
                <Avatar className="size-11 border border-blue-200 shrink-0">
                  <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                    {bookingDoctor.photoInitials || bookingDoctor.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{bookingDoctor.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {bookingDoctor.specialty} • {consultationMode}
                  </p>
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    Fee: LKR {bookingDoctor.fee?.toLocaleString() || "5,500"}
                  </p>
                </div>
              </div>

              {/* Patient Health Background Sync Notification */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-emerald-900 dark:text-emerald-200">
                  <p className="font-bold">Health Background Shared with Doctor</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Your MedDoc health profile (past conditions, active medications & ePass tier) will be automatically sent to {bookingDoctor.name} upon booking.
                  </p>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="booking-date" className="text-xs font-bold flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-blue-600" />
                  Select Date
                </Label>
                <Input
                  id="booking-date"
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-bold flex items-center gap-1.5">
                  <Clock className="size-3.5 text-blue-600" />
                  Available Time Slot
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={selectedTimeSlot === t ? "default" : "outline"}
                      onClick={() => setSelectedTimeSlot(t)}
                      className={`text-xs h-9 font-medium rounded-xl ${
                        selectedTimeSlot === t ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                      }`}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Symptoms / Medical Reason */}
              <div className="space-y-2">
                <Label htmlFor="patient-notes" className="text-xs font-bold">
                  Chief Complaint / Symptoms (Optional)
                </Label>
                <Textarea
                  id="patient-notes"
                  placeholder="e.g. High fever, headache for 2 days, or prescription renewal"
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="text-xs rounded-xl min-h-[70px] resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setBookingDoctor(null)} disabled={isSubmittingBooking} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button onClick={handleConfirmSchedule} disabled={isSubmittingBooking} className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs">
              {isSubmittingBooking ? "Scheduling..." : "Confirm & Send to Doctor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient - Doctor 2-Way Live Chat Modal */}
      <Dialog open={!!activeChatAppt} onOpenChange={() => setActiveChatAppt(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl flex flex-col h-[560px] p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
          {/* Enhanced Premium Header */}
          <div className="px-5 py-3.5 border-b border-border bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3 pr-12">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-10 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs">
                  MD
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                  {(() => {
                    const docObj = (rosterDoctors.length > 0 ? rosterDoctors : doctors).find(
                      (d) => d.id === activeChatAppt?.doctor_id
                    );
                    return docObj?.name || "Dr. Menaka De Alwis";
                  })()}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Photos & PDF Enabled
                </p>
              </div>
            </div>

            {/* Premium Video Call Button (Enabled on Scheduled Date Only) */}
            {activeChatAppt?.status === "Completed" ? (
              <Button
                size="sm"
                disabled
                className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 text-[11px] h-8.5 rounded-full font-medium gap-1 px-3 shrink-0 cursor-not-allowed opacity-80"
              >
                <CheckCircle2 className="size-3" />
                <span>Session Ended</span>
              </Button>
            ) : isCallDateAvailable(activeChatAppt?.date) ? (
              <Button
                size="sm"
                onClick={() => {
                  const docObj = (rosterDoctors.length > 0 ? rosterDoctors : doctors).find(
                    (d) => d.id === activeChatAppt?.doctor_id
                  ) || {
                    id: activeChatAppt?.doctor_id || "d1",
                    name: "Dr. Menaka De Alwis",
                    specialty: "Gynaecology",
                    hospital: "Metro Cancer Institute",
                    fee: 5500,
                  };
                  setActiveChatAppt(null);
                  setActiveVideoDoctor(docObj as Doctor);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8.5 rounded-md font-medium gap-1.5 px-3.5 shadow-sm shrink-0 transition-transform active:scale-95"
              >
                <Video className="size-3.5" />
                <span>Video Call</span>
              </Button>
            ) : (
              <Button
                size="sm"
                disabled
                title={`Video call unlocks on ${activeChatAppt?.date}`}
                className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 text-[11px] h-8.5 rounded-full font-medium gap-1 px-3 shrink-0 cursor-not-allowed opacity-80"
              >
                <Clock className="size-3" />
                <span>Available {activeChatAppt?.date}</span>
              </Button>
            )}
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "patient" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === "patient"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {msg.text && <p>{msg.text}</p>}

                  {/* Render Photo Attachment */}
                  {msg.attachment?.type === "image" && (
                    <div className="space-y-1 mt-1">
                      <img
                        src={msg.attachment.url}
                        alt={msg.attachment.name}
                        className="max-h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <span className="text-[10px] opacity-80 block truncate font-mono">{msg.attachment.name}</span>
                    </div>
                  )}

                  {/* Render PDF Attachment */}
                  {msg.attachment?.type === "pdf" && (
                    <a
                      href={msg.attachment.url}
                      download={msg.attachment.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border mt-1 font-medium transition-all ${
                        msg.sender === "patient"
                          ? "bg-blue-700 border-blue-600 text-white hover:bg-blue-800"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100"
                      }`}
                    >
                      <FileText className="size-5 text-rose-500 shrink-0" />
                      <div className="overflow-hidden text-left">
                        <p className="text-xs font-bold truncate">{msg.attachment.name}</p>
                        <p className="text-[10px] opacity-75">PDF Medical Document</p>
                      </div>
                      <Download className="size-4 shrink-0 ml-auto opacity-80" />
                    </a>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Hidden File Input for Image & PDF */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,application/pdf"
            onChange={handlePatientFileUpload}
            className="hidden"
          />

          {/* Input & Send Bar or Rebook UI */}
          {activeChatAppt?.status === "Completed" ? (
            <div className="p-4 border-t border-border bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Session Ended</p>
                <p className="text-xs text-slate-500">Book another consultation to continue chatting.</p>
              </div>
              <Button 
                onClick={handleRebookSession}
                disabled={isProcessingRebook}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs w-full sm:w-auto shrink-0 shadow-sm transition-all active:scale-95 flex items-center gap-2"
              >
                {isProcessingRebook ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="size-3.5" />
                    Pay LKR {activeChatAppt.fee || 5500} & Continue
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="pt-2 border-t border-border flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Attach Photo or PDF document"
                className="rounded-full size-10 text-slate-500 hover:text-blue-600 hover:bg-blue-50 shrink-0 border-slate-200"
              >
                <Paperclip className="size-4" />
              </Button>

              <Input
                placeholder="Type message or attach photo / PDF..."
                value={newMessageInput}
                onChange={(e) => setNewMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendPatientMessage()}
                className="text-xs h-10 rounded-md flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />

              <Button
                size="sm"
                onClick={handleSendPatientMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md size-10 p-0 shrink-0 flex items-center justify-center shadow-sm"
              >
                <Send className="size-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Interactive HD Telemedicine Live Video Meeting Room */}
      <Dialog open={!!activeVideoDoctor} onOpenChange={() => setActiveVideoDoctor(null)}>
        <DialogContent className="sm:max-w-2xl rounded-2xl p-0 overflow-hidden bg-zinc-950 text-zinc-100 border-zinc-800 shadow-xl">
          {activeVideoDoctor && (
            <div className="relative h-[480px] flex flex-col justify-between p-5 bg-zinc-950">
              {/* Doctor Main Video Stream Area (Remote WebRTC) */}
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 overflow-hidden">
                {!isVideoOff ? (
                  <>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {!remoteStream && (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
                        <div className="text-center space-y-3 z-10">
                          <Avatar className="size-24 border border-zinc-700/50 shadow-md mx-auto">
                            <AvatarFallback className="bg-zinc-800 text-zinc-300 font-medium text-xl">
                              {activeVideoDoctor.photoInitials || activeVideoDoctor.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-base font-medium text-zinc-100">{activeVideoDoctor.name}</h4>
                            <p className="text-xs text-zinc-400 flex items-center justify-center mt-1">
                              <span className="animate-pulse">Connecting to doctor...</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-zinc-500 text-xs font-medium">Camera Turned Off</div>
                )}

                {/* Self Patient Camera Thumbnail (Picture in Picture) */}
                <div className="absolute bottom-20 right-4 w-36 h-24 rounded-lg bg-zinc-800 border border-zinc-700/50 shadow-lg overflow-hidden flex items-center justify-center">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transform -scale-x-100" 
                  />
                  {!localStream && <span className="text-[10px] font-medium text-zinc-500">Camera off</span>}
                </div>
              </div>

              {/* Top Header Controls & Live Timer */}
              <div className="relative z-20 flex items-center justify-between bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Badge className="bg-zinc-800 text-zinc-100 border border-zinc-700 font-medium text-[10px] px-2 py-0.5">
                    Live Session
                  </Badge>
                  <div>
                    <p className="text-xs font-medium text-zinc-100">{activeVideoDoctor.name}</p>
                    <p className="text-[10px] text-zinc-500">{activeVideoDoctor.specialty}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-xs font-mono px-3 py-1 bg-zinc-900">
                    {formatCallTime(callDurationSeconds)}
                  </Badge>
                </div>
              </div>

              {/* Bottom Meeting Action Bar */}
              <div className="relative z-20 flex items-center justify-center gap-3 p-3 max-w-md mx-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-full border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                >
                  {isMicMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setActiveVideoDoctor(null);
                    setCallDurationSeconds(0);
                    toast.info("Video call ended.");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white size-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                >
                  <XCircle className="size-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-full border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff className="size-4" /> : <Video className="size-4" />}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
