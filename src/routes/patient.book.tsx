import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CalendarCheck, CheckCircle2, CreditCard, QrCode, Search,
  Car, FileText, Leaf, Award, Building2, Home, Pill, Activity, Plane, Smile, Flower2, Info, Brain,
  Phone, Star, MapPin
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { DoctorCard } from "@/components/shared/DoctorCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { HospitalReviewsDialog } from "@/components/patient/HospitalReviewsDialog";
import { DoctorProfileDialog } from "@/components/shared/DoctorProfileDialog";
import { doctors, hospitals, SPECIALTIES, type Doctor, type Hospital } from "@/data/mock";
import { doctorService } from "@/services/doctor.service";
import { hospitalService } from "@/services/hospital.service";
import { patientService } from "@/services/patient.service";
import { getSession } from "@/services/auth.service";

type BookSearch = {
  doctorId?: string;
  date?: string;
  timeslot?: string;
};

export const Route = createFileRoute("/patient/book")({
  validateSearch: (search: Record<string, unknown>): BookSearch => {
    const doctorId = search["doctorId"];
    const date = search["date"];
    const timeslot = search["timeslot"];
    const res: BookSearch = {};
    if (typeof doctorId === "string" && doctorId) res.doctorId = doctorId;
    if (typeof date === "string" && date) res.date = date;
    if (typeof timeslot === "string" && timeslot) res.timeslot = timeslot;
    return res;
  },
  head: () => ({
    meta: [
      { title: "Book an appointment — MedDoc" },
      {
        name: "description",
        content:
          "Search doctors, hospitals, branches and specialties, compare ratings and availability, then confirm your appointment.",
      },
      { property: "og:title", content: "Book an appointment — MedDoc" },
      { property: "og:description", content: "Find a specialist and confirm a slot in minutes." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const { doctorId, date: paramDate, timeslot: paramTimeslot } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [date, setDate] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [hospital, setHospital] = useState("");
  const [showHospitalSuggestions, setShowHospitalSuggestions] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showReviewsDialog, setShowReviewsDialog] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);

  // Helper to parse param date string (e.g. "20th August") into YYYY-MM-DD format
  const parseParamDate = (dStr?: string): string => {
    const today = new Date();
    if (!dStr) return (today.toISOString().split("T")[0] || "") as string;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) return dStr;

    const lower = dStr.toLowerCase();
    if (lower === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return (tomorrow.toISOString().split("T")[0] || "") as string;
    }
    if (lower === "today") {
      return (today.toISOString().split("T")[0] || "") as string;
    }

    const monthMap: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      january: 0, february: 1, march: 2, april: 3, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };

    const dayMatch = dStr.match(/\d+/);
    const monthMatch = dStr.match(/[a-zA-Z]+/);
    if (dayMatch && monthMatch) {
      const day = parseInt(dayMatch[0], 10);
      const monthWord = monthMatch[0].toLowerCase();
      const month = monthMap[monthWord] !== undefined ? monthMap[monthWord] : today.getMonth();
      const targetDate = new Date(today.getFullYear(), month, day);
      return (targetDate.toISOString().split("T")[0] || "") as string;
    }
    return (today.toISOString().split("T")[0] || "") as string;
  };
  
  // Dynamic slot and queue state
  const [selectedDate, setSelectedDate] = useState<string>(() => parseParamDate(paramDate));
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotQueues, setSlotQueues] = useState<Record<string, number>>({});
  const [assignedQueue, setAssignedQueue] = useState<number | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    nic: "",
    city: ""
  });

  // Load custom hospital roster from Supabase
  const [rosterDoctors, setRosterDoctors] = useState<Doctor[]>([]);
  const [dbHospitals, setDbHospitals] = useState<Hospital[]>([]);
  
  useEffect(() => {
    async function loadData() {
      const [docs, hosps] = await Promise.all([
        doctorService.getAllDoctors(),
        hospitalService.getAllHospitals()
      ]);
      if (docs && docs.length > 0) {
        setRosterDoctors(docs);
      }
      if (hosps && hosps.length > 0) {
        setDbHospitals(hosps);
      }
      
      // Auto-select doctor if doctorId is provided
      if (doctorId) {
        const allDocs = docs && docs.length > 0 ? docs : doctors;
        const autoSelectedDoctor = allDocs.find(d => d.id === doctorId);
        if (autoSelectedDoctor) {
          setSelected(autoSelectedDoctor);
          setQuery(autoSelectedDoctor.name);
          setSpecialty(autoSelectedDoctor.specialty);
        }
      }
    }
    loadData();
  }, [doctorId]);

  // Fetch dynamic slots and queues when date or doctor changes
  useEffect(() => {
    async function fetchSlots() {
      if (!selected || !selectedDate) {
        setAvailableSlots([]);
        setSlotQueues({});
        return;
      }
      
      const slots = await patientService.getDoctorAvailability(selected.id, selectedDate);
      setAvailableSlots(slots);
      
      // Auto-select slot if timeslot is specified
      if (paramTimeslot && slots.length > 0) {
        const slotLower = paramTimeslot.toLowerCase();
        let autoSlot = slots[0] || null;
        if (slotLower.includes("morning")) {
          autoSlot = slots.find((s) => {
            const hr = parseInt(s.split(":")[0] || "0", 10);
            return hr < 12;
          }) || slots[0] || null;
        } else if (slotLower.includes("afternoon")) {
          autoSlot = slots.find((s) => {
            const hr = parseInt(s.split(":")[0] || "0", 10);
            return hr >= 12 && hr < 17;
          }) || slots[0] || null;
        } else if (slotLower.includes("evening")) {
          autoSlot = slots.find((s) => {
            const hr = parseInt(s.split(":")[0] || "0", 10);
            return hr >= 17;
          }) || slots[0] || null;
        }
        setSlot(autoSlot);
      }
      
      const queues: Record<string, number> = {};
      for (const s of slots) {
        const count = await patientService.getSlotQueueCount(selected.id, selectedDate, s);
        queues[s] = count;
      }
      setSlotQueues(queues);
    }
    fetchSlots();
  }, [selected, selectedDate, paramTimeslot]);

  const selectedHospitalInfo = useMemo(() => {
    const hQ = hospital.trim().toLowerCase();
    if (!hQ) return null;
    const dbMatch = dbHospitals.find((x) => x.name.toLowerCase() === hQ);
    if (dbMatch) return dbMatch;
    return hospitals.find((x) => x.name.toLowerCase() === hQ);
  }, [hospital, dbHospitals]);

  const branches = useMemo(() => {
    const hQ = hospital.trim().toLowerCase();
    const h = dbHospitals.find((x) => x.name.toLowerCase() === hQ);
    if (h && h.branches && h.branches.length > 0) return h.branches;

    // Fallback: get branches from doctors data if not in dbHospitals
    const allDocs = rosterDoctors.length > 0 ? rosterDoctors : doctors;
    const docBranches = allDocs
      .filter((d) => (d.hospital || "").toLowerCase() === hQ)
      .map((d) => d.branch)
      .filter(Boolean);
    return Array.from(new Set(docBranches));
  }, [hospital, dbHospitals, rosterDoctors, doctors]);

  const hospitalSuggestions = useMemo(() => {
    if (!hospital.trim()) return [];
    const q = hospital.trim().toLowerCase();
    const dbHospitalNames = dbHospitals.map(h => h.name);
    const docHospitalNames = (rosterDoctors.length > 0 ? rosterDoctors : doctors).map(d => d.hospital || "");
    const uniqueNames = Array.from(new Set([...dbHospitalNames, ...docHospitalNames])).filter(Boolean);
    return uniqueNames.filter(name => name.toLowerCase().includes(q));
  }, [hospital, dbHospitals, rosterDoctors, doctors]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const allDoctors = rosterDoctors.length > 0 ? rosterDoctors : doctors;
    const uniqueNames = Array.from(new Set(allDoctors.map(d => d.name || "")));
    return uniqueNames.filter(name => name && name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [query, rosterDoctors, doctors]);

  const results = useMemo(() => {
    // If no search is performed, return empty array to hide the default list
    if (!query.trim() && !hospital.trim()) {
      return [];
    }

    // Use the live hospital roster if available, otherwise fallback to static mock doctors
    const allDoctors = rosterDoctors.length > 0 ? rosterDoctors : doctors;

    return allDoctors.filter((d) => {
      const q = query.trim().toLowerCase();
      const hQ = hospital.trim().toLowerCase();
      const matchesQuery =
        !q ||
        (d.name || "").toLowerCase().includes(q) ||
        (d.hospital || "").toLowerCase().includes(q) ||
        (d.specialty || "").toLowerCase().includes(q) ||
        (d.city || "").toLowerCase().includes(q);
      return (
        matchesQuery &&
        (specialty === "all" || d.specialty === specialty) &&
        (!hQ || (d.hospital || "").toLowerCase().includes(hQ)) &&
        (selectedBranch === "all" || d.branch === selectedBranch)
      );
    });
  }, [query, specialty, hospital, selectedBranch, rosterDoctors, doctors]);

  if (confirmed && selected) {
    return (
      <div className="space-y-6">
        <PageHeader title="Booking confirmed" description="Show the QR ticket at reception." />
        <Card className="max-w-xl shadow-soft">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-success" aria-hidden="true" />
              <div>
                <p className="font-semibold">{selected.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selected.specialty} · {selected.hospital} · {selected.branch}
                </p>
              </div>
            </div>
            <Separator />
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Date</dt>
                <dd className="font-medium">{selectedDate}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Time</dt>
                <dd className="font-medium">{slot}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Reference</dt>
                <dd className="font-medium">COHA-{selected.id.toUpperCase()}-4821</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Paid</dt>
                <dd className="font-medium">LKR {selected.fee.toLocaleString()}</dd>
              </div>
              <div className="sm:col-span-2">
                <Separator className="my-2" />
                <dt className="text-sm font-semibold mb-2">Patient Details</dt>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name: </span>
                    <span className="font-medium">{patientDetails.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">NIC: </span>
                    <span className="font-medium">{patientDetails.nic}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mobile: </span>
                    <span className="font-medium">{patientDetails.mobile}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">City: </span>
                    <span className="font-medium">{patientDetails.city}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Email: </span>
                    <span className="font-medium">{patientDetails.email}</span>
                  </div>
                </div>
              </div>
              {assignedQueue && (
                <div className="sm:col-span-2 mt-2 bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <dt className="text-primary font-semibold">Your Queue Number</dt>
                  <dd className="font-bold text-2xl text-primary">Patient #{assignedQueue}</dd>
                </div>
              )}
            </dl>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/40 p-5">
              <QrCode className="size-16 text-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                Your QR ticket. Arrive 10 minutes early for registration.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                navigate({ to: "/patient" });
              }}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book an appointment"
        description="Search by doctor, hospital, specialty or branch, then pick an available slot."
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0E3860] dark:text-blue-100">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {( [
            { id: "dl", label: "MedMind eCare", image: "/brain-care-icon-white-background-brain-care-icon-361728746.webp", isNew: false, color: "text-purple-500" },
            { id: "mfa", label: "MedDoc ePass", image: "/eSubscription.svg", isNew: false, color: "text-blue-500" },
            { id: "ayur", label: "eAyurveda", image: "/ayurvedic-medicine-illustration_1480904-73.avif", isNew: true, color: "text-green-500" },
            { id: "prem", label: "MedDoc ePremium", image: "/Screenshot 2026-08-08 at 01.56.15.png", isNew: false, color: "text-yellow-500" },
            { id: "hosp", label: "eHospital", image: "/images.png", isNew: true, color: "text-emerald-600" },
            { id: "homec", label: "eHomeCare", image: "/images.jpg", isNew: true, color: "text-blue-400" },
            { id: "pharm", label: "ePharmacy", image: "/images-1.png", isNew: false, color: "text-purple-500" },
            { id: "diag", label: "eDiagnostics", image: "/eDiagnosis.svg", isNew: false, color: "text-red-600" },
            { id: "visa", label: "eNutritionist", image: "/eNutritionist.svg", isNew: true, color: "text-sky-500" },
            { id: "dental", label: "eDental", image: "/images-1.jpg", isNew: true, color: "text-indigo-500" },
            { id: "skin", label: "eLAB", image: "/laboratory.png", isNew: true, color: "text-amber-500" },
            { id: "homeo", label: "MediFit", image: "/healthcare-trackers-wearables-sensors-abstract-concept-illustration_335657-2181.avif", isNew: true, color: "text-green-600" },
          ] as any[] ).map((item) => {
            const isClickable = item.id === "hosp" || item.id === "mfa" || item.id === "skin" || item.id === "homeo";
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (item.id === "hosp") {
                    navigate({ to: "/patient/telemedicine" });
                  } else if (item.id === "mfa") {
                    navigate({ to: "/patient/epass" });
                  } else if (item.id === "skin") {
                    navigate({ to: "/patient/elab" });
                  } else if (item.id === "homeo") {
                    navigate({ to: "/patient/medifit" });
                  }
                }}
                className={`relative p-5 bg-card border border-border shadow-soft rounded-2xl flex flex-col items-center justify-center gap-4 transition-shadow ${
                  isClickable ? "hover:shadow-md cursor-pointer" : "cursor-default"
                }`}
              >
                {item.isNew && (
                  <span className="absolute top-0 left-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-tl-2xl rounded-br-lg">
                    New
                  </span>
                )}
                <Info className="absolute top-3 right-3 size-4 text-muted-foreground/50 hover:text-muted-foreground" />
                {(item as any).image ? (
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img src={(item as any).image} alt={item.label} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className={`p-4 rounded-full bg-muted/30 ${item.color}`}>
                    {item.icon && <item.icon className="size-8" strokeWidth={1.5} />}
                  </div>
                )}
                <span className="text-sm font-medium text-foreground text-center">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="shadow-soft mt-8">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Doctor Name</Label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="search"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search doctor name"
                className="pl-9"
              />
              {showSuggestions && query.trim().length > 0 && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-popover text-popover-foreground border border-border shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
                  {suggestions.map((name) => (
                    <div
                      key={name}
                      className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => {
                        setQuery(name);
                        setShowSuggestions(false);
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialization</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger id="specialty">
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
          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital</Label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="hospital"
                autoComplete="off"
                value={hospital}
                onChange={(e) => {
                  setHospital(e.target.value);
                  setSelectedBranch("all");
                  setShowHospitalSuggestions(true);
                }}
                onFocus={() => setShowHospitalSuggestions(true)}
                onBlur={() => setTimeout(() => setShowHospitalSuggestions(false), 200)}
                placeholder="Search hospital"
                className="pl-9"
              />
              {showHospitalSuggestions && hospital.trim().length > 0 && hospitalSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-popover text-popover-foreground border border-border shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
                  {hospitalSuggestions.map((name) => (
                    <div
                      key={name}
                      className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => {
                        setHospital(name);
                        setSelectedBranch("all");
                        setShowHospitalSuggestions(false);
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Branch selector — only shows when a hospital with branches is selected */}
          {branches.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="branch">Branch / Location</Label>
              <Select value={selectedBranch} onValueChange={(v) => { setSelectedBranch(v); setSelected(null); setSlot(null); }}>
                <SelectTrigger id="branch">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b as string} value={b as string}>
                      {b as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {selectedHospitalInfo ? (
            <div className="space-y-6">
              <Card className="shadow-soft border-primary/20 bg-primary/5">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0 hidden sm:block">
                      <Building2 className="size-6" />
                    </div>
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedHospitalInfo.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1.5">
                          <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {selectedHospitalInfo.city}</span>
                          <button 
                            onClick={() => setShowReviewsDialog(true)}
                            className="flex items-center gap-1.5 hover:underline decoration-muted-foreground/50 transition-colors"
                          >
                            <Star className="size-3.5 fill-yellow-400 text-yellow-500" /> 
                            {selectedHospitalInfo.rating} ({selectedHospitalInfo.reviews} reviews)
                          </button>
                          <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> {selectedHospitalInfo.phone}</span>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4 text-sm pt-2 border-t border-border/50">
                        <div>
                          <span className="font-medium flex items-center gap-1.5 mb-2 text-foreground"><Activity className="size-4" /> Departments</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedHospitalInfo.departments.map(d => (
                              <Badge key={d} variant="secondary" className="font-normal bg-background/50">{d}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium flex items-center gap-1.5 mb-2 text-foreground"><Building2 className="size-4" /> Facilities</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedHospitalInfo.facilities.map(f => (
                              <Badge key={f} variant="outline" className="font-normal bg-background/50 border-border/50">{f}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6 mt-2">
                <h3 className="font-semibold text-lg px-1">Available Branches</h3>
                {branches.map(b => {
                  const branchDoctors = results.filter(d => d.branch === b);
                  return (
                    <Card key={b} className="shadow-soft overflow-hidden border-border/50">
                      <div className="bg-muted/50 px-5 py-3 border-b border-border/50 font-medium flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-primary" /> {b} Branch
                        </div>
                        <Badge variant="secondary" className="bg-background">{branchDoctors.length} Specialists</Badge>
                      </div>
                      <div className="p-4 space-y-3">
                        {branchDoctors.length > 0 ? (
                          branchDoctors.map((d) => {
                            const isAvailable = d.availability && d.availability[date] !== undefined 
                              ? d.availability[date] 
                              : d.online;
                            return (
                              <button
                                key={d.id}
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => {
                                  if (isAvailable) {
                                    setSelected(d);
                                    setSlot(null);
                                  }
                                }}
                                aria-pressed={selected?.id === d.id}
                                className={
                                  "block w-full rounded-2xl text-left transition-all relative overflow-hidden " +
                                  (selected?.id === d.id ? "ring-2 ring-primary ring-offset-2" : "") +
                                  (!isAvailable ? " opacity-60 cursor-not-allowed grayscale-[0.5]" : " hover:shadow-md")
                                }
                              >
                                {!isAvailable && (
                                  <div className="absolute inset-0 z-10 bg-background/20 backdrop-blur-[1px] flex items-center justify-center">
                                    <Badge variant="destructive" className="shadow-sm border border-destructive-foreground/20">
                                      Unavailable on {date}
                                    </Badge>
                                  </div>
                                )}
                                <DoctorCard doctor={d} onProfileClick={setViewingDoctor} />
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No specialists match your filters at this branch.
                          </p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : !query.trim() && !hospital.trim() && specialty === "all" ? (
            <Card className="shadow-soft border-dashed">
              <CardContent className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-4">
                <img
                  src="/illustrater doctor.jpg"
                  alt="Search doctors"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-2xl opacity-95 dark:opacity-80 mix-blend-multiply dark:mix-blend-normal"
                />
                <p className="max-w-md">Please enter a doctor name, select a specialization, or search for a hospital to see available specialists.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{results.length} specialists available</p>
              <div className="space-y-3">
                {results.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelected(d);
                      setSlot(null);
                    }}
                    aria-pressed={selected?.id === d.id}
                    className={
                      "block w-full rounded-2xl text-left transition-shadow " +
                      (selected?.id === d.id ? "ring-2 ring-primary ring-offset-2" : "")
                    }
                  >
                    <DoctorCard doctor={d} onProfileClick={setViewingDoctor} />
                  </button>
                ))}
              </div>
              {!results.length ? (
                <Card className="shadow-soft">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No specialists match these filters.
                  </CardContent>
                </Card>
              ) : null}
            </>
          )}
        </div>

        <Card className="h-fit shadow-soft lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-base">Availability & payment</CardTitle>
            <CardDescription>
              {selected ? `${selected.name} · ${selected.branch}` : "Select a specialist to continue"}
            </CardDescription>
          </CardHeader>
          {selected ? (
            <>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">Select Date & Time</p>
                    <Input 
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSlot(null);
                      }} 
                      min={new Date().toISOString().split('T')[0]} 
                      className="h-8 w-[140px] text-xs"
                    />
                  </div>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((s) => {
                        const queue = slotQueues[s] || 0;
                        return (
                          <Button
                            key={s}
                            type="button"
                            size="sm"
                            variant={slot === s ? "default" : "outline"}
                            onClick={() => setSlot(s)}
                            className="flex flex-col gap-0.5 h-auto py-2"
                          >
                            <span>{s}</span>
                            <span className="text-[10px] font-normal opacity-70">
                              {queue} in queue
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-4 text-center bg-muted/20 rounded-md">
                      Loading slots...
                    </div>
                  )}
                </div>

                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium">Patient Details</p>
                  <Input placeholder="Patient Name" value={patientDetails.name} onChange={e => setPatientDetails({...patientDetails, name: e.target.value})} className="h-9 text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Mobile Number" value={patientDetails.mobile} onChange={e => setPatientDetails({...patientDetails, mobile: e.target.value})} className="h-9 text-sm" />
                    <Input placeholder="NIC Number" value={patientDetails.nic} onChange={e => setPatientDetails({...patientDetails, nic: e.target.value})} className="h-9 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Email Address" type="email" value={patientDetails.email} onChange={e => setPatientDetails({...patientDetails, email: e.target.value})} className="h-9 text-sm" />
                    <Input placeholder="Area / City" value={patientDetails.city} onChange={e => setPatientDetails({...patientDetails, city: e.target.value})} className="h-9 text-sm" />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4 bg-muted/20 border-t p-5">
                <div className="w-full space-y-1.5 text-sm rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consultation fee</span>
                    <span>LKR {selected.fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee</span>
                    <span>LKR 250</span>
                  </div>
                  <Separator className="my-1.5 border-border/50" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>LKR {(selected.fee + 250).toLocaleString()}</span>
                  </div>
                </div>

                <Badge variant="secondary" className="gap-1.5 w-full justify-center">
                  <CreditCard className="size-3.5" /> Card payment on confirmation
                </Badge>
                
                <Button 
                  className="w-full" 
                  size="lg" 
                  disabled={!slot || !patientDetails.name || !patientDetails.mobile || !patientDetails.nic || isBooking}
                  onClick={async () => {
                    setIsBooking(true);
                    
                    const session = await getSession();

                    const newAppointment = await patientService.bookAppointment({
                      patient_id: session ? session.id : null,
                      patient_name: patientDetails.name,
                      patient_mobile: patientDetails.mobile,
                      patient_nic: patientDetails.nic,
                      patient_email: patientDetails.email,
                      patient_city: patientDetails.city,
                      doctor_id: selected.id,
                      hospital_id: selectedHospitalInfo?.id || selected.hospital || "",
                      date: selectedDate,
                      time: slot!,
                      status: "Confirmed",
                      fee: selected.fee,
                    });
                    
                    if (newAppointment) {
                      setAssignedQueue(newAppointment.queue_number);
                      toast.success(`Digital receipt sent to ${patientDetails.email || 'your email'}`);
                      setConfirmed(true);
                    } else {
                      toast.error("Failed to book appointment");
                    }
                    setIsBooking(false);
                  }}
                >
                  {isBooking ? "Booking..." : "Pay & confirm"}
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Choose a specialist from the list to see their available times.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
      
      {selectedHospitalInfo && (
        <HospitalReviewsDialog 
          hospital={selectedHospitalInfo}
          isOpen={showReviewsDialog}
          onOpenChange={setShowReviewsDialog}
        />
      )}

      <DoctorProfileDialog 
        doctor={viewingDoctor}
        open={!!viewingDoctor}
        onOpenChange={(open) => !open && setViewingDoctor(null)}
      />
    </div>
  );
}
