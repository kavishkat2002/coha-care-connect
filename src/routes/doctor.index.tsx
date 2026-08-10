import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  CalendarCheck,
  Stethoscope,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  Activity,
  Pill,
  AlertTriangle,
  UserCheck,
  Send,
  Award,
  Paperclip,
  Download,
  Video,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { patientService, type DbAppointment, type PatientProfile } from "@/services/patient.service";

export const Route = createFileRoute("/doctor/")({
  head: () => ({
    meta: [
      { title: "Doctor dashboard — MedDoc" },
      { name: "description", content: "Today's appointments, patient queue and AI assessments awaiting review." },
      { property: "og:title", content: "Doctor dashboard — MedDoc" },
      { property: "og:description", content: "Clinic queue, AI assessments and follow-ups." },
    ],
  }),
  component: DoctorDashboard,
});

export type DoctorChatAttachment = {
  type: "image" | "pdf";
  url: string;
  name: string;
};

export type DoctorChatMessage = {
  id: string;
  sender: "patient" | "doctor";
  text?: string;
  attachment?: DoctorChatAttachment;
  timestamp: string;
};

function DoctorDashboard() {
  const [appointments, setAppointments] = useState<DbAppointment[]>([]);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState<PatientProfile | null>(null);
  const [viewingAppt, setViewingAppt] = useState<DbAppointment | null>(null);

  // Doctor Chat Follow-back Modal State
  const [chatAppt, setChatAppt] = useState<DbAppointment | null>(null);
  const [chatMessages, setChatMessages] = useState<DoctorChatMessage[]>([]);
  const [replyInput, setReplyInput] = useState("");

  // Doctor Video Call State
  const [activeDoctorVideoAppt, setActiveDoctorVideoAppt] = useState<DbAppointment | null>(null);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);

  const doctorFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchAppts() {
      const allAppts = await patientService.getAppointments();
      setAppointments(allAppts.sort((a, b) => a.time.localeCompare(b.time)));
      const p = await patientService.getPatientProfile();
      setSelectedPatientProfile(p);
    }
    void fetchAppts();
  }, []);

  useEffect(() => {
    let timer: any;
    if (activeDoctorVideoAppt) {
      timer = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSeconds(0);
    }
    return () => clearInterval(timer);
  }, [activeDoctorVideoAppt]);

  const formatCallTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleApproveAppointment = (apptId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, status: "Approved" } : a))
    );
    toast.success("Telemedicine Consultation Request Approved!", {
      description: "Patient profile health background verified. 2-way chat follow-up unlocked.",
    });
  };

  const handleEndSession = (apptId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, status: "Completed" } : a))
    );
    // Persist completed status in localStorage
    const savedAppts = localStorage.getItem("meddoc_appointments");
    if (savedAppts) {
      try {
        const parsed = JSON.parse(savedAppts);
        const updated = parsed.map((a: DbAppointment) =>
          a.id === apptId ? { ...a, status: "Completed" } : a
        );
        localStorage.setItem("meddoc_appointments", JSON.stringify(updated));
      } catch (e) {}
    }
    toast.info("Telemedicine consultation session ended.", {
      description: "Appointment marked as completed and archived.",
    });
  };

  const handleDeclineAppointment = (apptId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, status: "Declined" } : a))
    );
    toast.info("Appointment declined.");
  };

  const openDoctorChat = (appt: DbAppointment) => {
    setChatAppt(appt);
    const chatKey = `meddoc_chat_${appt.id}`;
    const stored = localStorage.getItem(chatKey);
    if (stored) {
      try {
        setChatMessages(JSON.parse(stored));
      } catch (e) {
        setChatMessages(getDefaultChat(appt));
      }
    } else {
      const init = getDefaultChat(appt);
      setChatMessages(init);
      localStorage.setItem(chatKey, JSON.stringify(init));
    }
  };

  const getDefaultChat = (appt: DbAppointment): DoctorChatMessage[] => [
    {
      id: "m1",
      sender: "doctor",
      text: `Hello ${appt.patient_name || "Patient"}, I have reviewed your health background & ePass profile. Your consultation request is approved.`,
      timestamp: "09:30 AM",
    },
  ];

  const handleSendDoctorReply = () => {
    if (!replyInput.trim() || !chatAppt) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const doctorMsg: DoctorChatMessage = {
      id: "doc-reply-" + Date.now(),
      sender: "doctor",
      text: replyInput.trim(),
      timestamp: nowTime,
    };

    const updated = [...chatMessages, doctorMsg];
    setChatMessages(updated);
    setReplyInput("");

    const chatKey = `meddoc_chat_${chatAppt.id}`;
    localStorage.setItem(chatKey, JSON.stringify(updated));
    toast.success("Follow-up message sent to patient!");
  };

  const handleDoctorFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatAppt) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileUrl = event.target?.result as string;
      const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
      const isImg = file.type.startsWith("image/");

      if (!isPdf && !isImg) {
        toast.error("Please upload an image (JPG, PNG) or PDF prescription document");
        return;
      }

      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const fileMsg: DoctorChatMessage = {
        id: "doc-file-" + Date.now(),
        sender: "doctor",
        attachment: {
          type: isPdf ? "pdf" : "image",
          url: fileUrl,
          name: file.name,
        },
        timestamp: nowTime,
      };

      const updated = [...chatMessages, fileMsg];
      setChatMessages(updated);

      const chatKey = `meddoc_chat_${chatAppt.id}`;
      localStorage.setItem(chatKey, JSON.stringify(updated));

      toast.success(`Sent ${isPdf ? "PDF prescription" : "photo"} to patient!`);

      if (doctorFileInputRef.current) doctorFileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <PageHeader title="Doctor Clinical Dashboard" description="Review patient health backgrounds, approve telemedicine requests, and launch instant video calls." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Appointments today" value={appointments.length.toString()} hint="Live from booking system" />
        <StatCard icon={Users} label="Waiting now" value="3" hint="Average wait 12 min" />
        <StatCard icon={Bot} label="AI assessments to review" value="6" hint="2 flagged moderate" />
        <StatCard icon={Stethoscope} label="Follow-ups due" value="5" hint="This week" />
      </div>

      <Card className="shadow-soft border border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>Telemedicine Consultation Requests & Queue</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
              Live Patient Requests
            </Badge>
          </CardTitle>
          <CardDescription>
            Inspect requested patient health history, medical conditions, and approve telemedicine consultations.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Details</TableHead>
                <TableHead>Schedule Time</TableHead>
                <TableHead>Health Profile & ePass</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {a.patient_name || a.patient_id || "Mahinda Rajapaksha"}
                      </div>
                      <div className="text-xs text-muted-foreground">{a.patient_mobile || "+94 77 123 4567"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold">{a.date}</div>
                      <div className="text-xs text-muted-foreground">{a.time}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingAppt(a)}
                        className="text-xs h-8 gap-1.5 rounded-lg border-blue-200 text-blue-700 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="size-3.5" />
                        View Health Background
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          a.status === "Completed"
                            ? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 font-semibold"
                            : a.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 font-semibold"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 font-semibold"
                        }
                      >
                        {a.status || "Pending Approval"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {a.status === "Approved" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Doctor Always Enabled Start Video Call Button */}
                          <Button
                            size="sm"
                            onClick={() => setActiveDoctorVideoAppt(a)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 rounded-lg font-bold gap-1 shadow-xs"
                          >
                            <Video className="size-3.5 animate-pulse" />
                            <span>Start Video Call</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDoctorChat(a)}
                            className="text-xs h-8 rounded-lg gap-1 border-slate-200 dark:border-slate-700"
                          >
                            <MessageSquare className="size-3.5" />
                            <span>Chat</span>
                          </Button>

                          {/* End Consultation Session Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEndSession(a.id || "")}
                            title="Complete and end consultation session"
                            className="text-xs h-8 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40 rounded-lg gap-1 font-medium"
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>End Session</span>
                          </Button>
                        </div>
                      ) : a.status === "Completed" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold text-xs py-1 px-2.5">
                            Session Ended
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDoctorChat(a)}
                            className="text-xs h-8 rounded-lg gap-1 border-slate-200 dark:border-slate-700"
                          >
                            <MessageSquare className="size-3.5" />
                            <span>View Log</span>
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveAppointment(a.id || "")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1 rounded-lg"
                          >
                            <CheckCircle2 className="size-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclineAppointment(a.id || "")}
                            className="text-xs h-8 text-rose-600 border-rose-200 hover:bg-rose-50 rounded-lg"
                          >
                            <XCircle className="size-3.5" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No telemedicine appointment requests today.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Health Background Inspection Dialog */}
      <Dialog open={!!viewingAppt} onOpenChange={() => setViewingAppt(null)}>
        <DialogContent className="sm:max-w-lg rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <UserCheck className="size-5 text-blue-600 dark:text-blue-400" />
              Patient Health Background & Medical Record
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review verified patient conditions, medications, allergies & MedDoc ePass tier prior to consultation.
            </DialogDescription>
          </DialogHeader>

          {viewingAppt && selectedPatientProfile && (
            <div className="space-y-4 py-2 text-xs">
              {/* Patient Basic Profile Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Patient Name</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{viewingAppt.patient_name || selectedPatientProfile.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Age & Gender</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedPatientProfile.age} Yrs • {selectedPatientProfile.gender}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Phone Number</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewingAppt.patient_mobile || selectedPatientProfile.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">NIC / Passport</p>
                  <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPatientProfile.nic || "781293849V"}</p>
                </div>
              </div>

              {/* MedDoc ePass Status */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-950 dark:text-amber-200">Gold Care ePass Digital Member</p>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">Verified Priority Healthcare Access • 10K AI Credits</p>
                  </div>
                </div>
                <Badge className="bg-amber-600 text-white text-[10px] font-bold">Active ePass</Badge>
              </div>

              {/* Past Medical Conditions */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Activity className="size-4 text-blue-600" />
                  Past Medical Conditions & Chronic Illnesses
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedPatientProfile.pastDiseases?.map((d, i) => (
                    <Badge key={i} variant="secondary" className="text-[11px] font-medium">
                      {d}
                    </Badge>
                  )) || <span className="text-muted-foreground">None documented</span>}
                </div>
              </div>

              {/* Active Medications */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Pill className="size-4 text-purple-600" />
                  Current Active Medications
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedPatientProfile.medications?.map((m, i) => (
                    <Badge key={i} className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 text-[11px]">
                      {m}
                    </Badge>
                  )) || <span className="text-muted-foreground">None</span>}
                </div>
              </div>

              {/* Allergies & Family History */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1">
                  <p className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1">
                    <AlertTriangle className="size-3.5 text-rose-600" />
                    Known Allergies
                  </p>
                  <p className="text-[11px] text-rose-800 dark:text-rose-300 font-medium">
                    {selectedPatientProfile.allergies?.join(", ") || "No known allergies"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Family History</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {selectedPatientProfile.familyHistory?.join(", ") || "None"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                if (viewingAppt) handleApproveAppointment(viewingAppt.id || "");
                setViewingAppt(null);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl w-full"
            >
              Approve Patient Consultation & Unlock Telemedicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doctor - Patient Live Follow-back Messaging Dialog */}
      <Dialog open={!!chatAppt} onOpenChange={() => setChatAppt(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl flex flex-col h-[540px]">
          <DialogHeader className="pb-2 border-b border-border">
            <DialogTitle className="flex items-center justify-between text-sm font-bold">
              <div>
                <p className="leading-none text-slate-900 dark:text-white">Patient Consultation: {chatAppt?.patient_name || "Patient"}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-normal mt-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Photos & PDF Sharing Enabled
                </p>
              </div>

              {/* Doctor Always Enabled Video Call Launcher */}
              <Button
                size="sm"
                onClick={() => {
                  const targetAppt = chatAppt;
                  setChatAppt(null);
                  setActiveDoctorVideoAppt(targetAppt);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 rounded-xl font-bold gap-1 px-3 shrink-0"
              >
                <Video className="size-3.5 animate-pulse" />
                <span>Video Call</span>
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "doctor" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === "doctor"
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
                        msg.sender === "doctor"
                          ? "bg-blue-700 border-blue-500 text-white hover:bg-blue-800"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50"
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
            ref={doctorFileInputRef}
            accept="image/*,application/pdf"
            onChange={handleDoctorFileUpload}
            className="hidden"
          />

          {/* Input & Send Bar */}
          <div className="pt-2 border-t border-border flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => doctorFileInputRef.current?.click()}
              title="Attach Photo or PDF document"
              className="rounded-full size-10 text-slate-500 hover:text-blue-600 hover:bg-blue-50 shrink-0"
            >
              <Paperclip className="size-4" />
            </Button>

            <Input
              placeholder="Send doctor follow-up or attach photo / PDF..."
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendDoctorReply()}
              className="text-xs h-10 rounded-full flex-1"
            />

            <Button
              size="sm"
              onClick={handleSendDoctorReply}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full size-10 p-0 shrink-0 flex items-center justify-center"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interactive HD Telemedicine Live Video Meeting Room for Doctor */}
      <Dialog open={!!activeDoctorVideoAppt} onOpenChange={() => setActiveDoctorVideoAppt(null)}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden bg-slate-950 text-white border-slate-800 shadow-2xl">
          {activeDoctorVideoAppt && (
            <div className="relative h-[480px] flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
              {/* Patient Video Stream Area */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 overflow-hidden">
                <div className="relative size-full flex items-center justify-center bg-radial from-slate-800 to-slate-950">
                  <div className="text-center space-y-3 z-10">
                    <Avatar className="size-28 border-4 border-emerald-500/80 shadow-2xl mx-auto ring-4 ring-emerald-500/20 animate-pulse">
                      <AvatarFallback className="bg-blue-700 text-white font-bold text-2xl">
                        {activeDoctorVideoAppt.patient_name?.substring(0, 2).toUpperCase() || "MR"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-bold text-white">{activeDoctorVideoAppt.patient_name || "Mahinda Rajapaksha"}</h4>
                      <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 mt-1">
                        <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                        Patient Telemedicine Live Video Stream Connected
                      </p>
                    </div>
                  </div>
                </div>

                {/* Self Doctor Camera Thumbnail */}
                <div className="absolute bottom-20 right-4 w-36 h-24 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-xl overflow-hidden flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-300">You (Doctor Feed)</span>
                </div>
              </div>

              {/* Top Header Controls & Live Timer */}
              <div className="relative z-20 flex items-center justify-between bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5">
                    LIVE CONSULTATION
                  </Badge>
                  <div>
                    <p className="text-xs font-bold text-white">{activeDoctorVideoAppt.patient_name || "Mahinda Rajapaksha"}</p>
                    <p className="text-[10px] text-slate-400">Scheduled: {activeDoctorVideoAppt.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs font-mono font-bold px-3 py-1">
                    {formatCallTime(callDurationSeconds)}
                  </Badge>
                </div>
              </div>

              {/* Bottom Doctor Meeting Action Bar */}
              <div className="relative z-20 flex items-center justify-center gap-4 bg-slate-900/80 backdrop-blur-lg p-3 rounded-2xl border border-slate-800 max-w-md mx-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11 rounded-full border bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                >
                  <Video className="size-5" />
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setActiveDoctorVideoAppt(null);
                    toast.info("Doctor video call session ended.");
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white size-11 rounded-full font-bold shadow-lg p-0 flex items-center justify-center shrink-0"
                >
                  <Video className="size-5" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AiDisclaimer className="max-w-2xl" />
    </div>
  );
}
