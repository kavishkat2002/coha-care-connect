import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, CreditCard, QrCode, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { DoctorCard } from "@/components/shared/DoctorCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { doctors, hospitals, SPECIALTIES, type Doctor } from "@/data/mock";

export const Route = createFileRoute("/patient/book")({
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

const SLOTS = ["09:00", "10:30", "12:00", "14:30", "16:30", "18:00"];

function BookPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [hospital, setHospital] = useState("all");
  const [branch, setBranch] = useState("all");
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Load custom hospital roster from localStorage to sync with Hospital Portal
  const [rosterDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem("mock_hospital_roster");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const branches = useMemo(() => {
    const h = hospitals.find((x) => x.name === hospital);
    return h ? h.branches : [];
  }, [hospital]);

  const results = useMemo(() => {
      // Use the live hospital roster if available, otherwise fallback to static mock doctors
      const allDoctors = rosterDoctors.length > 0 ? rosterDoctors : doctors;
      
      return allDoctors.filter((d) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          d.name.toLowerCase().includes(q) ||
          d.hospital.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q);
        return (
          matchesQuery &&
          (specialty === "all" || d.specialty === specialty) &&
          (hospital === "all" || d.hospital === hospital) &&
          (branch === "all" || d.branch === branch)
        );
      });
  }, [query, specialty, hospital, branch, rosterDoctors, doctors]);

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
                <dd className="font-medium">Today</dd>
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
                setConfirmed(false);
                setSelected(null);
                setSlot(null);
              }}
            >
              Book another appointment
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

      <Card className="shadow-soft">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-4">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Doctor, hospital or city"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
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
            <Select
              value={hospital}
              onValueChange={(v) => {
                setHospital(v);
                setBranch("all");
              }}
            >
              <SelectTrigger id="hospital">
                <SelectValue placeholder="All hospitals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hospitals</SelectItem>
                {hospitals.map((h) => (
                  <SelectItem key={h.id} value={h.name}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {branches.length ? (
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger id="branch">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <p className="text-sm text-muted-foreground">{results.length} specialists available</p>
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
              <DoctorCard doctor={d} />
            </button>
          ))}
          {!results.length ? (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No specialists match these filters.
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit shadow-soft lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-base">Availability & payment</CardTitle>
            <CardDescription>
              {selected ? `${selected.name} · ${selected.branch}` : "Select a specialist to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {selected ? (
              <>
                <div>
                  <p className="mb-2 text-sm font-medium">Today's slots</p>
                  <div className="grid grid-cols-3 gap-2">
                    {SLOTS.map((s) => (
                      <Button
                        key={s}
                        type="button"
                        size="sm"
                        variant={slot === s ? "default" : "outline"}
                        onClick={() => setSlot(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consultation fee</span>
                    <span>LKR {selected.fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee</span>
                    <span>LKR 250</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>LKR {(selected.fee + 250).toLocaleString()}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1.5">
                  <CreditCard className="size-3.5" /> Card payment on confirmation
                </Badge>
                <Button
                  className="w-full"
                  disabled={!slot}
                  onClick={() => {
                    setConfirmed(true);
                    toast.success("Appointment confirmed");
                  }}
                >
                  <CalendarCheck className="mr-2 size-4" /> Pay & confirm
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Choose a specialist from the list to see their available times.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
