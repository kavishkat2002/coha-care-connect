import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Brain,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Eye,
  FileText,
  Image as ImageIcon,
  MapPin,
  Mail,
  MessageSquare,
  Microscope,
  Phone,
  ScanLine,
  ShieldCheck,
  Star,
  Stethoscope,
  Video,
  Watch,
} from "lucide-react";

import heroImage from "@/assets/hero-care.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  muted = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section id={id} className={muted ? "bg-card" : undefined}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <Reveal className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          ) : null}
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
          {description ? <p className="mt-4 text-muted-foreground">{description}</p> : null}
        </Reveal>
        {children ? <div className="mt-12">{children}</div> : null}
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <section className="bg-card">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <Reveal>
          <Badge variant="outline" className="rounded-full border-border bg-accent/60 px-3 py-1">
            <Activity className="mr-1.5 size-3.5" aria-hidden="true" />
            AI-assisted early screening
          </Badge>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            Intelligent healthcare, from first symptom to the right specialist
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            MedDoc brings appointment booking, an AI health assistant, medical image and report
            analysis, telemedicine and your digital health record into one calm, connected platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/patient/book">
                <CalendarCheck className="mr-2 size-4" /> Book appointment
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/patient/assistant">
                <Bot className="mr-2 size-4" /> Try AI assistant
              </Link>
            </Button>
          </div>
          <AiDisclaimer className="mt-8 max-w-xl" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-border shadow-card">
            <img
              src={heroImage}
              alt="A doctor reviewing results with a patient in a bright consultation room"
              width={1280}
              height={960}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const overview = [
  {
    icon: Bot,
    title: "AI health assistant",
    body: "Describe symptoms in your own words, attach images or reports, and get a plain-language assessment.",
  },
  {
    icon: CalendarCheck,
    title: "Appointments that fit",
    body: "Search by doctor, hospital, specialty or branch, then book a slot with instant confirmation.",
  },
  {
    icon: Microscope,
    title: "Early screening pathways",
    body: "Structured oral, skin, breast and eye screening flows designed around earlier detection.",
  },
  {
    icon: Activity,
    title: "One health record",
    body: "Reports, images, prescriptions and visits collected into a single personal timeline.",
  },
  {
    icon: Video,
    title: "Telemedicine built in",
    body: "Video, voice or chat consultations with digital prescriptions and follow-up booking.",
  },
  {
    icon: ShieldCheck,
    title: "Clinician oversight",
    body: "Every AI output is reviewable by the treating doctor before it informs care.",
  },
];

export function PlatformOverview() {
  return (
    <Section
      id="platform"
      eyebrow="Platform overview"
      title="A complete healthcare ecosystem, not a single tool"
      description="Patients, doctors, hospitals and administrators work in dedicated portals that share the same record."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {overview.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <Card className="h-full shadow-soft">
              <CardHeader className="pb-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="pt-3 text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.body}</CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const steps = [
  {
    step: "01",
    title: "Share what you feel",
    body: "Start a chat, describe your symptoms, and attach an image, prescription or lab report if you have one.",
  },
  {
    step: "02",
    title: "Get an AI assessment",
    body: "MedDoc identifies your intent, reviews attachments and returns possible conditions with a confidence score.",
  },
  {
    step: "03",
    title: "See the right specialist",
    body: "We recommend a hospital, branch, department and specialist with slots that match your location and urgency.",
  },
  {
    step: "04",
    title: "Keep everything together",
    body: "Visits, reports and insights flow into your health timeline so future care starts with full context.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      muted
      eyebrow="How it works"
      title="Four steps from symptom to specialist"
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.step} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-border bg-background p-6">
              <span className="text-sm font-semibold text-primary">{s.step}</span>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const services = [
  { icon: Stethoscope, title: "Specialist consultations", body: "Across 20+ departments and partner hospitals." },
  { icon: Building2, title: "Hospital & branch search", body: "Compare ratings, facilities, distance and queue length." },
  { icon: FileText, title: "Report analysis", body: "Blood, MRI, CT, biopsy and laboratory reports explained simply." },
  { icon: ImageIcon, title: "Medical image review", body: "Oral, skin, breast and eye images with lesion highlighting." },
  { icon: ShieldCheck, title: "Preventive health reviews", body: "Personalised screening reminders based on your history." },
  { icon: MessageSquare, title: "Care coordination", body: "Referrals, follow-ups and prescriptions in one thread." },
];

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="Healthcare services"
      title="Everyday care and specialist pathways"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.04}>
            <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <s.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const aiFeatures = [
  { icon: Brain, title: "Intent detection", body: "Understands whether you need triage, a report explained or a specialist." },
  { icon: ScanLine, title: "Image quality checks", body: "Flags blurry or poorly lit photos before analysis runs." },
  { icon: FileText, title: "Abnormal value highlighting", body: "Marks out-of-range results and explains what they mean." },
  { icon: MapPin, title: "Recommendation engine", body: "Ranks care by rating, distance, availability and experience." },
];

export function AiFeatures() {
  return (
    <Section
      id="ai"
      muted
      eyebrow="AI features"
      title="Assistive intelligence with clear boundaries"
      description="MedDoc never claims to diagnose. It summarises, highlights and recommends — the clinician decides."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {aiFeatures.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <div className="flex h-full gap-4 rounded-2xl border border-border bg-background p-6">
              <f.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <AiDisclaimer className="mt-8 max-w-2xl" />
    </Section>
  );
}

const screening = [
  { icon: MessageSquare, title: "Oral", body: "Persistent ulcers, white or red patches, mucosal changes." },
  { icon: ScanLine, title: "Skin", body: "Moles, pigmented lesions, non-healing sores." },
  { icon: Activity, title: "Breast", body: "Lumps, pain, skin or nipple changes." },
  { icon: Eye, title: "Eye", body: "Lesions, persistent redness, vision changes." },
];

export function CancerScreening() {
  return (
    <Section
      id="screening"
      eyebrow="Cancer screening"
      title="Structured early screening for four areas"
      description="Each pathway walks through capture, quality check, lesion detection, risk indication and next steps."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {screening.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05}>
            <Card className="h-full shadow-soft">
              <CardHeader className="pb-2">
                <s.icon className="size-5 text-primary" aria-hidden="true" />
                <CardTitle className="pt-3 text-base">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{s.body}</CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link to="/patient/images">Start an image assessment</Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Results are indications for review, never a diagnosis.
          </span>
        </div>
      </Reveal>
    </Section>
  );
}

export function Telemedicine() {
  return (
    <Section
      id="telemedicine"
      muted
      eyebrow="Telemedicine"
      title="Consult from wherever you are"
      description="See which doctors are online now and choose video, voice or chat. Prescriptions and follow-ups are digital."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { icon: Video, title: "Video consultation", body: "Face-to-face review with screen sharing for reports." },
          { icon: Phone, title: "Voice consultation", body: "Lower bandwidth option for quick follow-ups." },
          { icon: MessageSquare, title: "Chat consultation", body: "Asynchronous messaging with attachments." },
        ].map((t, i) => (
          <Reveal key={t.title} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-border bg-background p-6">
              <t.icon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold">{t.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.15}>
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background p-6">
          <Watch className="size-5 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Wearable integrations — Apple Health, Google Fit, Samsung Health, Fitbit, Garmin
          </p>
          <Badge variant="secondary">Coming soon</Badge>
        </div>
      </Reveal>
    </Section>
  );
}

const stats = [
  { value: "180k+", label: "Assessments assisted" },
  { value: "42", label: "Partner hospitals" },
  { value: "1,300+", label: "Verified specialists" },
  { value: "6 min", label: "Median time to a slot" },
];

export function Stats() {
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <p className="text-3xl font-semibold sm:text-4xl">{s.value}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote:
      "A patient uploaded a photo of a mouth ulcer that had lasted three weeks. The assistant flagged it for review and she was in my clinic two days later.",
    name: "Dr. Ravi Kumar",
    role: "Oral Medicine, Lakeside General Hospital",
  },
  {
    quote:
      "My blood report finally made sense. It showed which values were low and which specialist to see, without alarming language.",
    name: "Dilani R.",
    role: "Patient, Colombo",
  },
  {
    quote:
      "Queue visibility across our three branches changed how we schedule screening clinics.",
    name: "Suresh Bandara",
    role: "Operations Director, Metro Cancer Institute",
  },
];

export function Testimonials() {
  return (
    <Section eyebrow="Testimonials" title="Trusted by clinicians and patients">
      <div className="grid gap-5 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <Card className="h-full shadow-soft">
              <CardContent className="p-6">
                <div className="flex gap-0.5 text-primary" aria-label="Five out of five">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="size-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed">“{t.quote}”</p>
                <p className="mt-5 text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const faqs = [
  {
    q: "Does MedDoc diagnose disease?",
    a: "No. MedDoc produces an AI-assisted assessment with possible conditions, a risk indication and a confidence score. Diagnosis is made by a licensed clinician.",
  },
  {
    q: "What can I upload?",
    a: "Photographs of an affected area, prescriptions, laboratory reports, blood reports, and scan reports such as MRI, CT or biopsy summaries in PDF or image form.",
  },
  {
    q: "How are hospitals and specialists recommended?",
    a: "The recommendation engine weighs your location and distance, the required specialty, doctor and hospital ratings, experience, availability and current queue length.",
  },
  {
    q: "Who can see my medical data?",
    a: "You, and the clinicians you book with. Hospital and system administrators see only the operational data needed to run services.",
  },
  {
    q: "Is telemedicine included?",
    a: "Yes. Video, voice and chat consultations are available with online doctors, including digital prescriptions and follow-up booking.",
  },
];

export function Faq() {
  return (
    <Section id="faq" muted title="Frequently asked questions" eyebrow="FAQ">
      <div className="max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Talk to our team"
      description="Hospitals and clinics can request a walkthrough of the provider portals."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <form
            className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thanks — our team will reply within one working day.");
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Full name</Label>
                <Input id="contact-name" required placeholder="Jane Perera" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-org">Organisation</Label>
                <Input id="contact-org" placeholder="Hospital or clinic" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" required placeholder="you@hospital.lk" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">How can we help?</Label>
              <Textarea id="contact-message" rows={4} placeholder="Tell us about your needs" />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Send message
            </Button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "care@coha.ai" },
              { icon: Phone, label: "Phone", value: "+94 11 500 0100" },
              { icon: MapPin, label: "Office", value: "Level 6, Union Place, Colombo 02" },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <c.icon className="size-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-sm font-medium">{c.value}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <p className="text-sm font-semibold">Emergencies</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                MedDoc is not an emergency service. For urgent symptoms, contact your nearest
                emergency department immediately.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {["Verified clinicians only", "Consent-based record sharing", "Audit trail on AI outputs"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-success" aria-hidden="true" /> {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
