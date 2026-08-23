import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, Search, MapPin, Phone, ShieldCheck, Check, Clock, Upload, 
  ChevronRight, ChevronLeft, Calendar, User, FileText, ClipboardCheck, Sparkles, HeartPulse, ScanLine 
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/elab")({
  head: () => ({
    meta: [
      { title: "eLAB Diagnostic Services — MedDoc" },
      {
        name: "description",
        content: "Book lab tests, schedule home sample collection, and request quotes from Sri Lanka's leading accredited diagnostic laboratories.",
      },
    ],
  }),
  component: ElabPage,
});

interface LabProvider {
  id: string;
  name: string;
  accreditation: string[];
  location: string;
  phone: string;
  workingHours: string;
  specialties: string[];
  homeCollection: boolean;
  featured: boolean;
  logoColor: string;
  image: string;
  tests: { name: string; price: number; code: string; duration: string }[];
}

const LAB_PROVIDERS: LabProvider[] = [
  {
    id: "nawaloka",
    name: "Nawaloka Lab Diagnostics",
    accreditation: ["ISO 15189 Certified", "College of American Pathologists (CAP) Peer"],
    location: "Colombo 02 (Corporate Branch)",
    phone: "+94 11 5577111",
    workingHours: "24/7 Service",
    specialties: ["Pathology & Biopsy", "Genetics & Molecular", "Clinical Biochemistry"],
    homeCollection: true,
    featured: true,
    logoColor: "from-blue-600 to-indigo-700 text-white",
    image: "/Labs images/nawaloka.png",
    tests: [
      { name: "Full Blood Count (FBC)", price: 1250, code: "FBC-NL", duration: "4 Hours" },
      { name: "Lipid Profile (Fast)", price: 2400, code: "LPD-NL", duration: "6 Hours" },
      { name: "Skin Lesion Histopathology (Biopsy)", price: 6800, code: "BIO-NL", duration: "3 Days" },
      { name: "Chest X-Ray PA View", price: 2100, code: "XRY-NL", duration: "1 Hour" },
    ]
  },
  {
    id: "asiri",
    name: "Asiri Laboratories",
    accreditation: ["JCI Accredited", "ISO 15189 Certified", "ISO 9001 Certified"],
    location: "Colombo 05 (Main Lab Hub)",
    phone: "+94 11 4524400",
    workingHours: "24/7 Service",
    specialties: ["Immunology", "Hematology & Flow Cytometry", "Hormones Panel"],
    homeCollection: true,
    featured: true,
    logoColor: "from-emerald-600 to-teal-700 text-white",
    image: "/Labs images/asiri lab.png",
    tests: [
      { name: "Full Blood Count (FBC)", price: 1300, code: "FBC-AS", duration: "3 Hours" },
      { name: "HbA1c (Glycated Hemoglobin)", price: 1850, code: "HBA-AS", duration: "4 Hours" },
      { name: "Pathology Biopsy Specimen Review", price: 7200, code: "BIO-AS", duration: "3 Days" },
      { name: "Digital Chest X-Ray", price: 2200, code: "XRY-AS", duration: "45 Mins" },
    ]
  },
  {
    id: "durdans",
    name: "Durdance Lab",
    accreditation: ["ISO 15189 Certified", "Joint Commission International (JCI) Partner"],
    location: "Colombo 03 (Hospital Complex)",
    phone: "+94 11 2140000",
    workingHours: "6:00 AM - 10:00 PM",
    specialties: ["Cardiovascular Panel", "Microbiology & Cultures", "Radiology Imaging"],
    homeCollection: true,
    featured: false,
    logoColor: "from-sky-600 to-blue-700 text-white",
    image: "/Labs images/durdance.jpeg",
    tests: [
      { name: "Full Blood Count (FBC)", price: 1200, code: "FBC-DD", duration: "4 Hours" },
      { name: "Cardiac Troponin I", price: 3500, code: "TRP-DD", duration: "2 Hours" },
      { name: "Kidney Function Profile", price: 2800, code: "KFT-DD", duration: "5 Hours" },
      { name: "X-Ray Chest PA & Lateral", price: 2400, code: "XRY-DD", duration: "1 Hour" },
    ]
  },
  {
    id: "medihealth",
    name: "MEDIHELP",
    accreditation: ["ISO 9001 Certified", "Accredited Local Health Council"],
    location: "Nugegoda (Main Center)",
    phone: "+94 11 2828300",
    workingHours: "7:00 AM - 8:00 PM",
    specialties: ["General Wellness Profiles", "Urinalysis", "Routine Chemistry"],
    homeCollection: true,
    featured: false,
    logoColor: "from-purple-600 to-indigo-700 text-white",
    image: "/Labs images/MEDI-HELP.jpg",
    tests: [
      { name: "Full Blood Count (FBC)", price: 1100, code: "FBC-MH", duration: "5 Hours" },
      { name: "Fast Blood Sugar (FBS)", price: 450, code: "FBS-MH", duration: "2 Hours" },
      { name: "Routine Urine Test", price: 600, code: "URN-MH", duration: "3 Hours" },
      { name: "Basic Lipid Profile", price: 2100, code: "LPD-MH", duration: "6 Hours" },
    ]
  },
  {
    id: "ninewells",
    name: "Ninewells Lab",
    accreditation: ["ISO 15189 Certified", "Specialist Women & Child Accreditation"],
    location: "Narahenpita (Maternity Hospital)",
    phone: "+94 11 4520999",
    workingHours: "24/7 Service",
    specialties: ["Maternal & Fetal Screening", "Pediatric Diagnostics", "Biopsy & Histology"],
    homeCollection: true,
    featured: false,
    logoColor: "from-pink-600 to-rose-700 text-white",
    image: "/Labs images/ninewells.jpeg",
    tests: [
      { name: "Pediatric Full Blood Count", price: 1350, code: "PFB-NW", duration: "4 Hours" },
      { name: "Maternal Prenatal Triple Screening", price: 8500, code: "PRN-NW", duration: "24 Hours" },
      { name: "Skin / Soft Tissue Pathology Biopsy", price: 6900, code: "BIO-NW", duration: "2 Days" },
      { name: "Chest X-Ray Pediatric PA", price: 2300, code: "XRY-NW", duration: "1 Hour" },
    ]
  },
  {
    id: "kings",
    name: "Kings Hospital Labs",
    accreditation: ["ISO 15189 Certified", "Accredited Clinical Quality Standards"],
    location: "Colombo 05 (Kings Hospital Complex)",
    phone: "+94 11 7740000",
    workingHours: "6:00 AM - 11:00 PM",
    specialties: ["Oncology Bio-Markers", "Molecular PCR Assays", "Histopathology Biopsy"],
    homeCollection: true,
    featured: false,
    logoColor: "from-amber-600 to-amber-800 text-white",
    image: "/kings lab.png",
    tests: [
      { name: "Full Blood Count (FBC)", price: 1300, code: "FBC-KH", duration: "3 Hours" },
      { name: "Tumor Marker CEA", price: 4200, code: "CEA-KH", duration: "8 Hours" },
      { name: "Skin Lesion Histopathology (Biopsy)", price: 7000, code: "BIO-KH", duration: "2 Days" },
      { name: "High-Resolution Chest X-Ray", price: 2500, code: "XRY-KH", duration: "1 Hour" },
    ]
  }
];

const getTestIcon = (testName: string) => {
  const name = testName.toLowerCase();
  if (name.includes("blood") || name.includes("fbc") || name.includes("hba1c") || name.includes("sugar")) {
    return HeartPulse;
  }
  if (name.includes("biopsy") || name.includes("pathology") || name.includes("histopathology") || name.includes("lesion")) {
    return FileText;
  }
  if (name.includes("x-ray") || name.includes("xray")) {
    return ScanLine;
  }
  return ClipboardCheck;
};

function ElabPage() {
  const [viewingLabId, setViewingLabId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [selectedLab, setSelectedLab] = useState<LabProvider | null>(null);
  
  // Booking Dialog State
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<{ name: string; price: number; code: string; duration: string } | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [collectionMethod, setCollectionMethod] = useState<"home" | "walkin">("home");
  const [patientAddress, setPatientAddress] = useState("");
  
  // Prescription Dialog State
  const [isPrescDialogOpen, setIsPrescDialogOpen] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescCollectionMethod, setPrescCollectionMethod] = useState<"home" | "walkin">("home");
  const [prescAddress, setPrescAddress] = useState("");

  const activeLab = (LAB_PROVIDERS.find((lab) => lab.id === viewingLabId) || LAB_PROVIDERS[0]) as LabProvider;

  const filteredLabs = LAB_PROVIDERS.filter((lab) => {
    const matchesSearch = 
      lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.tests.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty = 
      specialtyFilter === "all" ||
      lab.specialties.some((s) => s.toLowerCase().includes(specialtyFilter.toLowerCase()));

    return matchesSearch && matchesSpecialty;
  });

  const handleBookTestClick = (lab: LabProvider, test: { name: string; price: number; code: string; duration: string }) => {
    setSelectedLab(lab);
    setSelectedTest(test);
    setIsBookDialogOpen(true);
  };

  const handlePrescriptionClick = (lab: LabProvider) => {
    setSelectedLab(lab);
    setIsPrescDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!bookingDate || !bookingTime) {
      toast.error("Please select a date and time slot.");
      return;
    }
    if (collectionMethod === "home" && !patientAddress.trim()) {
      toast.error("Please enter your home address for sample collection.");
      return;
    }

    toast.success("Lab test appointment booked successfully!", {
      description: `Scheduled at ${selectedLab?.name} for ${selectedTest?.name} on ${bookingDate} at ${bookingTime}.`
    });

    setIsBookDialogOpen(false);
    setSelectedTest(null);
    setBookingDate("");
    setBookingTime("");
    setPatientAddress("");
  };

  const handlePrescriptionSubmit = () => {
    if (!prescriptionFile) {
      toast.error("Please upload a prescription document.");
      return;
    }
    if (prescCollectionMethod === "home" && !prescAddress.trim()) {
      toast.error("Please enter your address for sample collection.");
      return;
    }

    toast.success("Prescription uploaded successfully!", {
      description: `Sent to ${selectedLab?.name}. Pharmacists will review and contact you with a quotation and sample scheduling shortly.`
    });

    setIsPrescDialogOpen(false);
    setPrescriptionFile(null);
    setPrescAddress("");
  };

  if (viewingLabId !== null) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        <Button 
          variant="ghost" 
          onClick={() => {
            setViewingLabId(null);
            setSearchQuery("");
          }} 
          className="mb-2 gap-2 text-xs font-semibold pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> Back to Laboratories
        </Button>

        <PageHeader
          title={`${activeLab.name} — Diagnostics`}
          description={`View and book accredited medical diagnostics at ${activeLab.name} or upload a prescription for a custom quotation.`}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lab details card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-soft border border-border overflow-hidden rounded-[24px] bg-card">
              {/* Header Header */}
              <div className={`p-5 bg-gradient-to-r ${activeLab.logoColor} text-white flex items-start justify-between relative`}>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg tracking-tight">{activeLab.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] opacity-90">
                    <MapPin className="size-3 shrink-0" />
                    <span>{activeLab.location}</span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden border border-white/20 p-1 shadow-sm">
                  <img src={activeLab.image} alt={activeLab.name} className="w-full h-full object-contain rounded-full" />
                </div>
              </div>

              {/* Accreditations */}
              <div className="px-5 py-3 border-b border-border bg-muted/20 flex flex-wrap gap-1.5 items-center">
                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                {activeLab.accreditation.map((acc: string, i: number) => (
                  <span key={i} className="text-[10px] bg-background text-muted-foreground font-semibold px-2 py-0.5 rounded border border-border/40">
                    {acc}
                  </span>
                ))}
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="size-3.5 text-primary shrink-0" />
                    <span>{activeLab.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5 text-primary shrink-0" />
                    <span>{activeLab.workingHours}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider shrink-0">Specialties:</span>
                    {activeLab.specialties.map((spec: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[9px] py-0 border-border bg-muted/35">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 bg-muted/5 flex flex-col gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-1.5 text-xs font-semibold h-10"
                  onClick={() => handlePrescriptionClick(activeLab)}
                >
                  <Upload className="size-3.5" />
                  Upload Prescription
                </Button>
              </div>
            </Card>
          </div>

          {/* Test menu column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-soft border border-border rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/60 bg-muted/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-extrabold flex items-center gap-2">
                    <HeartPulse className="size-5 text-primary" />
                    Available Diagnostics Menu
                  </CardTitle>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-52">
                    <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search tests..."
                      className="pl-8 h-8 text-xs"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                    <SelectTrigger className="h-8 text-xs w-[110px]">
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pathology">Pathology</SelectItem>
                      <SelectItem value="molecular">Molecular</SelectItem>
                      <SelectItem value="biochemistry">Biochemistry</SelectItem>
                      <SelectItem value="radiology">X-Ray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <div className="grid gap-3">
                  {activeLab.tests
                    .filter((test: any) => {
                      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesSpecialty = 
                        specialtyFilter === "all" ||
                        activeLab.specialties.some((s: string) => s.toLowerCase().includes(specialtyFilter.toLowerCase()));
                      return matchesSearch && matchesSpecialty;
                    })
                    .map((test: any, index: number) => {
                      const Icon = getTestIcon(test.name);
                      return (
                        <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-background hover:bg-muted/10 transition-all text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                              <Icon className="size-4.5" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-semibold text-foreground">{test.name}</p>
                              <p className="text-[10px] text-muted-foreground">ID: {test.code} · Result in {test.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3.5">
                            <span className="font-extrabold text-primary">LKR {test.price.toLocaleString()}</span>
                            <Button 
                              size="sm" 
                              className="h-8 text-[11px] font-bold px-3 py-0"
                              onClick={() => handleBookTestClick(activeLab, test)}
                            >
                              Book Test
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="eLAB Diagnostic Services"
        description="Select a diagnostic laboratory from Sri Lanka's leading accredited providers to view profiles, book medical tests, or upload prescriptions."
      />

      {/* Control bar */}
      <div className="grid gap-4 md:grid-cols-3 bg-muted/40 p-4 rounded-2xl border border-border/60">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search laboratory name or location..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Diagnostics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Diagnostics</SelectItem>
            <SelectItem value="pathology">Pathology & Biopsy</SelectItem>
            <SelectItem value="molecular">Genetics & Molecular</SelectItem>
            <SelectItem value="biochemistry">Biochemistry</SelectItem>
            <SelectItem value="radiology">Radiology & X-Ray</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lab Profiles List - Compact Contact Details Only */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredLabs.map((lab) => (
          <Card 
            key={lab.id} 
            className="shadow-soft border border-border flex flex-col justify-between overflow-hidden cursor-pointer hover:border-primary/35 hover:shadow transition-all duration-300 rounded-[24px] bg-card"
            onClick={() => setViewingLabId(lab.id)}
          >
            <div>
              {/* Header Banner Header */}
              <div className={`p-5 bg-gradient-to-r ${lab.logoColor} text-white flex items-start justify-between relative`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg tracking-tight">{lab.name}</h3>
                    {lab.featured && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-none text-[9px] uppercase font-bold py-0.5">
                        Main Partner
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] opacity-90">
                    <MapPin className="size-3 shrink-0" />
                    <span>{lab.location}</span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden border border-white/20 p-1 shadow-sm">
                  <img src={lab.image} alt={lab.name} className="w-full h-full object-contain rounded-full" />
                </div>
              </div>

              {/* Accreditations */}
              <div className="px-5 py-3 border-b border-border bg-muted/20 flex flex-wrap gap-1.5 items-center">
                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                {lab.accreditation.map((acc: string, i: number) => (
                  <span key={i} className="text-[10px] bg-background text-muted-foreground font-semibold px-2 py-0.5 rounded border border-border/40">
                    {acc}
                  </span>
                ))}
              </div>

              <div className="p-5 space-y-4">
                {/* Contact details grid */}
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="size-3.5 text-primary shrink-0" />
                    <span>{lab.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5 text-primary shrink-0" />
                    <span>{lab.workingHours}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider shrink-0">Specialties:</span>
                    {lab.specialties.map((spec: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[9px] py-0 border-border bg-muted/30">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-border/40 bg-muted/5 flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1 text-[11px]">
                <Check className="size-3.5 text-emerald-500 shrink-0" />
                Home Sample Collection Available
              </span>
              <span className="text-primary hover:underline flex items-center gap-0.5 text-[11px]">
                View Services & Book
                <ChevronRight className="size-3.5" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Test Booking Modal */}
      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="size-5 text-primary" />
              Schedule Laboratory Diagnostic
            </DialogTitle>
            <DialogDescription>
              Submit appointment details. Registered phlebotomists will visit or prepare your slot.
            </DialogDescription>
          </DialogHeader>

          {selectedLab && selectedTest && (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-muted rounded-xl border border-border/50 space-y-1 text-xs">
                <p className="text-muted-foreground uppercase font-bold text-[9px] tracking-wider">LABORATORY PROVIDER</p>
                <p className="font-bold text-foreground text-sm">{selectedLab.name}</p>
                <p className="text-muted-foreground pt-1.5 uppercase font-bold text-[9px] tracking-wider">SELECTED DIAGNOSTIC TEST</p>
                <div className="flex justify-between items-center pt-0.5">
                  <p className="font-semibold text-foreground">{selectedTest.name} ({selectedTest.code})</p>
                  <p className="font-bold text-primary">LKR {selectedTest.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="date" className="text-xs">Schedule Date</Label>
                  <Input 
                    type="date" 
                    id="date" 
                    value={bookingDate} 
                    onChange={(e) => setBookingDate(e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="time" className="text-xs">Preferred Time</Label>
                  <Input 
                    type="time" 
                    id="time" 
                    value={bookingTime} 
                    onChange={(e) => setBookingTime(e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Sample Collection Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={collectionMethod === "home" ? "default" : "outline"} 
                    className="text-xs h-9 justify-center gap-1.5"
                    onClick={() => setCollectionMethod("home")}
                  >
                    <MapPin className="size-3.5" />
                    Home Collection
                  </Button>
                  <Button 
                    variant={collectionMethod === "walkin" ? "default" : "outline"} 
                    className="text-xs h-9 justify-center gap-1.5"
                    onClick={() => setCollectionMethod("walkin")}
                  >
                    <Building2 className="size-3.5" />
                    Walk-in to Lab
                  </Button>
                </div>
              </div>

              {collectionMethod === "home" && (
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs">Sample Collection Address</Label>
                  <Input 
                    placeholder="Enter your street address, town, and city..." 
                    id="address" 
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">Mobile phlebotomists will arrive within the selected time slot.</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={() => setIsBookDialogOpen(false)}>Cancel</Button>
            <Button className="gap-1.5" onClick={handleConfirmBooking}>
              <Calendar className="size-4" />
              Confirm Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prescription Upload Modal */}
      <Dialog open={isPrescDialogOpen} onOpenChange={setIsPrescDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="size-5 text-primary" />
              Upload Medical Prescription
            </DialogTitle>
            <DialogDescription>
              Submit your doctor's prescription. The lab team will call back with pricing quotes.
            </DialogDescription>
          </DialogHeader>

          {selectedLab && (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-muted rounded-xl border border-border/50 space-y-1 text-xs">
                <p className="text-muted-foreground uppercase font-bold text-[9px] tracking-wider">LABORATORY PROVIDER</p>
                <p className="font-bold text-foreground text-sm">{selectedLab.name}</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="presc-file" className="text-xs">Select Prescription File (PDF or Image)</Label>
                <Input 
                  type="file" 
                  id="presc-file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Preferred Collection Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={prescCollectionMethod === "home" ? "default" : "outline"} 
                    className="text-xs h-9 justify-center gap-1.5"
                    onClick={() => setPrescCollectionMethod("home")}
                  >
                    <MapPin className="size-3.5" />
                    Home Collection
                  </Button>
                  <Button 
                    variant={prescCollectionMethod === "walkin" ? "default" : "outline"} 
                    className="text-xs h-9 justify-center gap-1.5"
                    onClick={() => setPrescCollectionMethod("walkin")}
                  >
                    <Building2 className="size-3.5" />
                    Walk-in to Lab
                  </Button>
                </div>
              </div>

              {prescCollectionMethod === "home" && (
                <div className="space-y-1.5">
                  <Label htmlFor="presc-address" className="text-xs">Sample Collection Address</Label>
                  <Input 
                    placeholder="Enter your street address, town, and city..." 
                    id="presc-address" 
                    value={prescAddress}
                    onChange={(e) => setPrescAddress(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={() => setIsPrescDialogOpen(false)}>Cancel</Button>
            <Button className="gap-1.5" onClick={handlePrescriptionSubmit}>
              <Sparkles className="size-4" />
              Upload & Request Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
