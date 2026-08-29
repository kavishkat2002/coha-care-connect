# MedDoc — AI-Powered Integrated Healthcare Platform

> **Full-stack, SSR-enabled, multi-role healthcare platform** combining AI symptom analysis, cancer early-screening, real-time telemedicine, appointment booking, medical image classification, and an admin control plane — all deployed on a single Cloudflare-compatible edge runtime.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Role-Based Access Model](#4-role-based-access-model)
5. [Directory Structure](#5-directory-structure)
6. [Core Modules & Services](#6-core-modules--services)
   - 6.1 [Authentication Service](#61-authentication-service)
   - 6.2 [Patient Service](#62-patient-service)
   - 6.3 [Doctor Service](#63-doctor-service)
   - 6.4 [Hospital Service](#64-hospital-service)
   - 6.5 [AI Service](#65-ai-service)
7. [Data Layer & Database Schema](#7-data-layer--database-schema)
8. [Frontend Architecture](#8-frontend-architecture)
   - 8.1 [Routing System](#81-routing-system)
   - 8.2 [Portal Shell & Navigation](#82-portal-shell--navigation)
   - 8.3 [Design System](#83-design-system)
9. [Feature Deep-Dives](#9-feature-deep-dives)
   - 9.1 [AI Health Assistant](#91-ai-health-assistant)
   - 9.2 [Medical Image Analysis Pipeline](#92-medical-image-analysis-pipeline)
   - 9.3 [Telemedicine & Real-Time Video (WebRTC)](#93-telemedicine--real-time-video-webrtc)
   - 9.4 [Appointment Booking Engine](#94-appointment-booking-engine)
   - 9.5 [Doctor Clinical Dashboard](#95-doctor-clinical-dashboard)
   - 9.6 [Hospital Management Portal](#96-hospital-management-portal)
   - 9.7 [Platform Administration](#97-platform-administration)
10. [Server-Side Architecture](#10-server-side-architecture)
11. [Real-Time & Cross-Tab Sync](#11-real-time--cross-tab-sync)
12. [Data Persistence Strategy](#12-data-persistence-strategy)
13. [Session & Auth Guard Behaviour](#13-session--auth-guard-behaviour)
14. [Build & Deployment](#14-build--deployment)
15. [Environment Configuration](#15-environment-configuration)
16. [Development Setup](#16-development-setup)
17. [AI Datasets & Model Artefacts](#17-ai-datasets--model-artefacts)
18. [Known Limitations & Technical Debt](#18-known-limitations--technical-debt)
19. [Security Considerations](#19-security-considerations)

---

## 1. Product Overview

**MedDoc** is a comprehensive healthcare platform — branded internally as the **COHA Care Connect** project — aimed at delivering intelligent, connected healthcare to patients, doctors, hospitals, and platform administrators through four distinct, authenticated portals.

### Core Value Propositions

| Pillar | Description |
|---|---|
| **AI-Assisted Triage** | Conversational symptom analyser backed by Groq LLM with a local keyword-fallback engine covering 30+ disease clusters |
| **Cancer Early Screening** | ABCDE dermoscopic analysis pipeline for skin, oral, breast and eye images with structured classification output (malignant / benign / indeterminate) |
| **Telemedicine** | Real-time HD video via WebRTC + Supabase Realtime as a signalling layer; live doctor-patient chat with file/image sharing |
| **Appointment Booking** | Full booking funnel: specialty → hospital → doctor → date → time-slot → queue assignment → payment summary |
| **Medical Report Analysis** | AI report reader with PDF rendering, structured findings, flagged risk markers and downloadable summaries |
| **Multi-Role Operations** | Isolated portals for patients, doctors, hospitals and admins with role-specific guards and data access scopes |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER / CLIENT                           │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ Patient  │ │  Doctor  │ │ Hospital │ │  Admin   │  ← Portals   │
│  │  Portal  │ │  Portal  │ │  Portal  │ │  Portal  │              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │            TanStack Router v1  (File-based SSR routing)    │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌────────────────┐  ┌───────────────┐  ┌─────────────────────┐   │
│  │  AI Service    │  │ WebRTC Hook   │  │ Supabase Realtime   │   │
│  │ (Groq + local) │  │  (useWebRTC)  │  │ (Broadcast / PG)    │   │
│  └────────────────┘  └───────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
              │                                   │
              ▼                                   ▼
┌─────────────────────────┐         ┌────────────────────────────┐
│     Node / Nitro        │         │        Supabase             │
│   SSR Server (src/      │         │                            │
│   server.ts)            │         │  • Auth (JWT / Supabase)   │
│                         │         │  • appointments            │
│  /api/profile   (GET/   │◄───────►│  • doctors_roster          │
│                  POST)  │         │  • hospitals               │
│  /api/appoints (GET/    │         │  • hospital_reviews        │
│                  POST)  │         │  • doctor_availability     │
│  TanStack SSR handler   │         │  • Realtime Channels       │
└─────────────────────────┘         └────────────────────────────┘
              │
              ▼
    Cloudflare Workers / Node.js
      (Nitro adapter target)
```

### Request Lifecycle

1. **Edge receives request** → `src/server.ts` custom fetch handler.
2. **Short-circuit routes** checked first: `/favicon.ico`, `/api/profile`, `/api/appointments`.
3. **All other requests** delegated to `@tanstack/react-start`'s SSR engine via `getServerEntry()`.
4. **Catastrophic SSR errors** caught, pretty-printed via `src/lib/error-page.ts` instead of raw JSON.
5. **Client hydration** completes; TanStack Router takes over as a SPA.

---

## 3. Technology Stack

### Runtime & Build

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | `^5.8` |
| Framework | TanStack Start (TanStack Router + Vite SSR) | `^1.168` |
| Build Tool | Vite | `^8.1` |
| SSR Adapter | Nitro (Cloudflare / Node target) | `3.0 beta` |
| Package Manager | Bun (lock file) / npm | — |

### Frontend

| Concern | Technology |
|---|---|
| UI Components | Radix UI (headless) + shadcn/ui component layer |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) with OKLCH design tokens |
| Animation | Framer Motion (`motion` v12), `tw-animate-css` |
| Charts | Recharts v2 |
| Forms | React Hook Form + Zod |
| Date Utilities | date-fns v4 |
| Icons | Lucide React |
| Toast Notifications | Sonner |
| Carousel | Embla Carousel |
| PDF Generation | jsPDF + html2canvas |
| OTP Input | input-otp |
| Data Fetching | TanStack Query v5 |

### Backend & Infrastructure

| Concern | Technology |
|---|---|
| Database + Auth | Supabase (PostgreSQL + GoTrue) |
| Realtime | Supabase Realtime (Broadcast + Postgres Changes) |
| AI / LLM | Groq API (primary), local keyword engine (fallback) |
| Media Devices | Browser WebRTC (`RTCPeerConnection`) |
| File Storage | Base64 in-memory / LocalStorage (dev mode) |

---

## 4. Role-Based Access Model

The application supports **6 roles** defined in `src/data/mock.ts`:

```typescript
type Role = "patient" | "doctor" | "hospital" | "admin" | "elab" | "pharmacy";
```

| Role | Portal Route | Auth Required | Portal Label |
|---|---|---|---|
| `patient` | `/patient/*` | Optional (guest mode) | Patient Portal |
| `doctor` | `/doctor/*` | Yes | Doctor Portal |
| `hospital` | `/hospital/*` | Yes | Hospital Portal |
| `admin` | `/admin/*` | Yes | Admin Portal |
| `elab` | `/patient/elab` | Yes | — |
| `pharmacy` | `/patient/pharmacy` | Yes | — |

### Auth Guard Behaviour

`PortalShell` (`src/components/portal/PortalShell.tsx`) subscribes to `onAuthStateChange`. When `session` becomes `null` and the portal is **not** patient-guest-mode, it immediately calls `navigate({ to: "/auth", replace: true })`. This fires whether the session expires, the user manually logs out, or the Supabase token is invalidated in another tab.

**Guest Mode** (patient portal only): if `profile` is `null` but no session error occurred, restricted nav items (`/patient`, `/patient/timeline`, `/patient/profile`, `/patient/appointments`) are hidden and the guest is shown a `GuestCreditBanner`.

### Admin Account Provisioning (Session-Safe)

To create doctor/hospital accounts from the Admin portal without ejecting the admin's own session, a **secondary Supabase client** (`adminAuthClient`) is initialised with `persistSession: false`. After sign-up it is immediately signed out, and the primary session is re-hydrated if needed:

```typescript
// src/lib/supabase.ts
export const adminAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
```

---

## 5. Directory Structure

```
coha-care-connect/
├── src/
│   ├── routes/                    # TanStack file-based routes (SSR)
│   │   ├── __root.tsx             # HTML shell, QueryClientProvider, Toaster
│   │   ├── index.tsx              # Public landing page
│   │   ├── auth.tsx               # Sign-in / Register / Reset password
│   │   ├── patient.tsx            # Patient layout (wraps PortalShell)
│   │   ├── patient.index.tsx      # Patient dashboard
│   │   ├── patient.assistant.tsx  # AI health assistant chat
│   │   ├── patient.book.tsx       # Appointment booking funnel
│   │   ├── patient.appointments.tsx
│   │   ├── patient.images.tsx     # Medical image analysis
│   │   ├── patient.reports.tsx    # Report viewer + AI analysis
│   │   ├── patient.telemedicine.tsx # Telemedicine + live video
│   │   ├── patient.epass.tsx      # Digital health ePass
│   │   ├── patient.medmind-ecare.tsx # Medication tracker
│   │   ├── patient.medifit.tsx    # Fitness / wellness
│   │   ├── patient.elab.tsx       # eLab results
│   │   ├── patient.timeline.tsx   # Medical history timeline
│   │   ├── patient.profile.tsx
│   │   ├── doctor.tsx             # Doctor layout
│   │   ├── doctor.index.tsx       # Doctor dashboard (queue, chat, video)
│   │   ├── doctor.profile.tsx
│   │   ├── hospital.tsx           # Hospital layout
│   │   ├── hospital.index.tsx     # Hospital overview
│   │   ├── hospital.doctors.tsx   # Doctor roster management
│   │   ├── hospital.branches.tsx  # Branch management
│   │   ├── hospital.profile.tsx
│   │   ├── admin.tsx              # Admin layout
│   │   └── admin.index.tsx        # Platform admin dashboard
│   ├── components/
│   │   ├── portal/
│   │   │   ├── PortalShell.tsx    # Unified sidebar + header shell
│   │   │   └── navs.ts            # Per-role nav item definitions
│   │   ├── shared/                # Cross-portal reusable components
│   │   │   ├── DoctorCard.tsx
│   │   │   ├── DoctorProfileDialog.tsx
│   │   │   ├── GuestCreditBanner.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── RiskBadge.tsx
│   │   │   └── StatCard.tsx
│   │   ├── patient/               # Patient-specific components
│   │   ├── landing/               # Public landing page sections
│   │   └── ui/                    # shadcn/ui base component library
│   ├── services/
│   │   ├── ai.service.ts          # Groq LLM + local analysis engine (141 kB)
│   │   ├── auth.service.ts        # Supabase Auth wrapper
│   │   ├── patient.service.ts     # Patient data CRUD with fallback chain
│   │   ├── doctor.service.ts      # Doctor roster CRUD
│   │   ├── hospital.service.ts    # Hospital + reviews CRUD
│   │   └── profile.server.ts      # Server-only profile RPC
│   ├── hooks/
│   │   ├── use-webrtc.ts          # WebRTC peer connection lifecycle
│   │   └── use-mobile.tsx         # Breakpoint detection hook
│   ├── data/
│   │   ├── mock.ts                # Type definitions + seed data (1272 lines)
│   │   ├── ai_knowledge.json      # Domain-specific AI context
│   │   ├── disease_symptoms.json  # 700+ symptom-disease mappings
│   │   ├── lab_tests.json         # Lab reference values
│   │   ├── skin_cancer_model_metrics.json
│   │   ├── skin_cancer_dataset_metrics.json
│   │   └── eye_cancer_dataset_metrics.json
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client + admin client
│   │   ├── utils.ts               # `cn()` class merger
│   │   ├── error-capture.ts       # Global error capture for SSR
│   │   └── error-page.ts          # Fallback HTML error page renderer
│   ├── server.ts                  # Custom Nitro/Cloudflare fetch handler
│   ├── router.tsx                 # TanStack Router factory
│   ├── start.ts                   # App entry point
│   ├── routeTree.gen.ts           # Auto-generated route tree
│   └── styles.css                 # Tailwind v4 design system tokens
├── supabase_setup.sql             # DB schema DDL
├── supabase_seed.sql              # Seed data SQL
├── vite.config.ts                 # Vite config with custom presets
├── tsconfig.json
└── package.json
```

---

## 6. Core Modules & Services

### 6.1 Authentication Service

**File:** `src/services/auth.service.ts`

Thin wrapper around the Supabase GoTrue client, exposing:

| Export | Description |
|---|---|
| `getSession()` | Reads the current Supabase session and maps it to a local `Session` type |
| `signIn(email, password)` | `signInWithPassword` — throws on error |
| `signUp(email, password, role, name)` | Creates account with `user_metadata: { role, name, registration_id }` |
| `adminCreateAccount(...)` | Uses `adminAuthClient` to create accounts without disturbing the active admin session |
| `signOut()` | Clears all local health data caches then calls `supabase.auth.signOut()` |
| `onAuthStateChange(cb)` | Subscribes to the Supabase auth state change stream; returns a subscription to unsubscribe |
| `portalHome` | Map of `Role → string` for post-login redirect |

**Registration ID Generation:**
- Doctors → `DOC-XXXXXX` (6-digit random)
- Patients → `PAT-XXXXXX`

**Session Type:**
```typescript
type Session = {
  id: string;
  name: string;
  email: string;
  role: Role;
  registration_id?: string;
};
```

---

### 6.2 Patient Service

**File:** `src/services/patient.service.ts` (~906 lines)

The most complex service. All operations use a **three-tier fallback chain** to maximise reliability across environments (cloud deployment, local dev, offline):

```
1. Server API endpoint (/api/profile or /api/appointments)
2. Supabase (cloud database)
3. localStorage (in-browser persistence)
```

**Key operations:**

| Method | Description |
|---|---|
| `getAppointments()` | Tries `/api/appointments` → Supabase → localStorage; sorts ascending by date/time |
| `bookAppointment(data)` | Writes to Supabase + localStorage + server file; assigns queue number |
| `getPatientProfile()` | Tries server API → Supabase → localStorage |
| `updatePatientProfile(data)` | Writes to all three layers + broadcasts via `BroadcastChannel` for cross-tab sync |
| `getDoctorAvailability(doctorId, date)` | Fetches custom time slots from `doctor_availability` table |
| `clearLocalHealthData()` | Wipes all localStorage keys on sign-out |
| `getHealthTimeline()` | Aggregates appointments + reports into chronological timeline |

**Profile Sync:** Uses `BroadcastChannel("coha_profile_sync")` to push profile updates to all open tabs without a round-trip.

---

### 6.3 Doctor Service

**File:** `src/services/doctor.service.ts`

Manages the `doctors_roster` table in Supabase with a **merge strategy**:

```
DB doctors ∪ Mock doctors (where DB entry doesn't exist)
```

This prevents a blank roster on fresh databases while real data loads.

| Method | Description |
|---|---|
| `getAllDoctors()` | Merges DB + mock, always returns at least mock data |
| `getDoctorsBySpecialty(specialty)` | Fuzzy prefix match, sorted by rating DESC + distance ASC, limit 3 |
| `saveDoctor(doctor)` | Upsert by `id` |
| `saveAllDoctors(doctors[])` | Batch upsert |
| `deleteDoctor(id)` | Hard delete |

---

### 6.4 Hospital Service

**File:** `src/services/hospital.service.ts`

CRUD for `hospitals` and `hospital_reviews` tables, with LocalStorage fallback for reviews when Supabase is unavailable.

| Table | Operations |
|---|---|
| `hospitals` | `getAllHospitals()`, `saveHospital()` |
| `hospital_reviews` | `getHospitalReviews(hospitalId)`, `addHospitalReview(review)` |

---

### 6.5 AI Service

**File:** `src/services/ai.service.ts` (~2,627 lines — the largest file in the project)

The AI service is the intellectual core of the platform. It implements:

#### A) Symptom Analysis Engine

**Primary path:** Groq LLM API (conversation-aware, multi-turn context, structured JSON output)

**Fallback path:** Local keyword matching engine covering 30+ disease clusters:

```
Kidney/Urinary → Gastrointestinal → Oral → Skin → Breast →
Diabetes → Asthma → Hypertension → Arthritis → Obesity →
Eye → ENT → Neurological → Mental Health → Cardiac → Dental → ...
```

**Output type (`Assessment`):**
```typescript
type Assessment = {
  intent: string;
  possibleConditions: { name: string; likelihood: number }[];
  risk: "low" | "moderate" | "elevated";
  confidence: number;
  summary: string;
  plainLanguageSummary: string;
  followUpQuestions: string[];
  recommendation: string[];
  suggestedSpecialty: string;
  disclaimer: string;
  reasoning?: string;
  agenticAction?: AgenticAction;
};
```

#### B) Agentic Action System

The AI can trigger in-app actions in response to symptom descriptions:

```typescript
type AgenticAction = {
  type: "redirect" | "book_doctor" | "find_specialist" | "analyze_image" | "book_specific_doctor" | "none";
  targetRoute?: string;
  specialty?: string;
  message?: string;
  parameters?: Record<string, any>;
};
```

Example: if user says *"I need to see a Cardiologist"*, the AI returns `agenticAction: { type: "find_specialist", specialty: "Cardiology" }` and the UI automatically surfaces matched doctors.

#### C) Medical Image Analysis Pipeline

Processes **Oral / Skin / Eye** images through a 5-stage pipeline:

```
Stage 1 → Photo Upload & Quality Pre-Check
Stage 2 → Vision AI & YOLO Lesion Bounding Localisation
Stage 3 → ABCDE Dermoscopic Feature Vector Extraction
Stage 4 → External Search & Medical Resource Verification
Stage 5 → GPT Deep Reasoning & Prediction Score Calculation
```

**Skin Cancer Classification (`SkinCancerClassification`):**
- Binary: `benign | malignant | indeterminate`
- Subtypes: `melanocytic_nevi | melanoma | basal_cell_carcinoma | actinic_keratoses | ...` (10 subtypes)
- ABCDE analysis: asymmetry, border regularity, colour, diameter estimation, evolution
- Fitzpatrick skin type detection (`I-II | III-IV | V-VI`)
- TNM staging reference (requires confirmed diagnosis)
- Uncertainty layer with `referralTriage: "low_concern" | "suspicious" | "highly_suspicious"`

**Eye Cancer Classification (`EyeCancerClassification`):**
- Subtypes: `retinoblastoma | uveal_melanoma | orbital_lymphoma | conjunctival_melanoma | ...`
- Fundus scan pathology detection (diabetic retinopathy, glaucoma, macular degeneration)
- RCPath histopathology reference items
- Clinical feature vector (pigmentation, shape, border, vascularity, extent)

#### D) Report Analysis

Accepts PDF/image medical reports, runs structured text extraction and risk-flagging, returns:
- Flagged abnormal values with clinical significance
- Plain-language explanation for patients
- Recommended follow-up actions and specialist referrals

#### E) Audio Transcription

`transcribeAudio(audioBlob)` converts voice input to text for hands-free symptom description.

---

## 7. Data Layer & Database Schema

### Supabase Tables

```sql
-- Appointments
CREATE TABLE public.appointments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id   TEXT NOT NULL,
  hospital_id TEXT,
  date        TEXT NOT NULL,
  time        TEXT NOT NULL,
  queue_number INTEGER NOT NULL,
  status      TEXT DEFAULT 'Confirmed',   -- Confirmed | Approved | Completed | Scheduled
  fee         NUMERIC,
  patient_name  TEXT,
  patient_mobile TEXT,
  patient_nic    TEXT,
  patient_email  TEXT,
  patient_city   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Hospital Reviews
CREATE TABLE public.hospital_reviews (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  patient_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  rating      INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Doctor Availability
CREATE TABLE public.doctor_availability (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id  TEXT NOT NULL,
  date       TEXT NOT NULL,
  time_slots TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(doctor_id, date)
);

-- Doctors Roster (seeded via seed_roster.ts)
-- doctors_roster table mirrors the Doctor type from mock.ts
-- Columns: id, name, specialty, hospital, branch, city, distanceKm,
--          experienceYears, rating, reviews, fee, languages,
--          online, queue, nextSlot, photoInitials, about, availability

-- Hospitals (seeded via seed_hospitals.ts)
-- hospitals table mirrors the Hospital type from mock.ts
```

> **Row Level Security:** Currently disabled for all tables (`DISABLE ROW LEVEL SECURITY`) to simplify development. **Must be enabled and policies configured before production deployment.**

### Server-Side File Persistence

For environments where Supabase is not connected (local development, demos), the custom server maintains two in-memory + file-backed stores:

| File | Content |
|---|---|
| `.shared_profile.json` | Current patient profile |
| `.shared_appointments.json` | All appointments as JSON array |

These are served through `/api/profile` and `/api/appointments` endpoints in `src/server.ts`.

---

## 8. Frontend Architecture

### 8.1 Routing System

TanStack Router with **file-based routing** — the `routeTree.gen.ts` (21 kB) is auto-generated by the `@tanstack/router-plugin` Vite plugin at build time.

**Route hierarchy:**

```
/                              → Public landing
/auth                          → Authentication (sign-in, register, reset)

/patient                       → Layout: PortalShell(patientNav)
  /patient/                    → Patient dashboard
  /patient/assistant           → AI health assistant
  /patient/book                → Appointment booking (search param: doctorId, date, timeslot)
  /patient/appointments        → My appointments
  /patient/images              → Medical image analysis
  /patient/reports             → Report viewer + AI analysis
  /patient/telemedicine        → Doctor search + live sessions
  /patient/epass               → Digital health ePass + membership
  /patient/medmind-ecare       → Medication tracker (MedMind)
  /patient/medifit             → Fitness & wellness
  /patient/elab                → eLab results
  /patient/timeline            → Medical history timeline
  /patient/profile             → Edit profile

/doctor                        → Layout: PortalShell(doctorNav)
  /doctor/                     → Doctor clinical dashboard
  /doctor/profile              → Doctor profile editor

/hospital                      → Layout: PortalShell(hospitalNav)
  /hospital/                   → Hospital overview
  /hospital/doctors            → Doctor roster management
  /hospital/branches           → Branch management
  /hospital/profile            → Hospital profile editor

/admin                         → Layout: PortalShell(adminNav)
  /admin/                      → Platform administration
```

**Pending component:** All routes display `<LoadingScreen />` during data load (animated MedDoc spinner with heartbeat pulse effect).

### 8.2 Portal Shell & Navigation

`PortalShell` (`src/components/portal/PortalShell.tsx`) is the single layout component shared across all four authenticated portals. It provides:

- **Persistent sidebar** (desktop, `lg+`) with role-specific nav items
- **Mobile sheet drawer** (slides in from left)
- **Sticky header** with backdrop blur
- **Notification centre** — dropdown with categorised notifications (message / appointment / medication / ePass / system), unread badge counter, mark-all-read, clear panel
- **User menu** — avatar (from profile photo or gender-based Unsplash fallback), name, email, sign-out
- **Session guard** — redirects to `/auth` when session is null
- **Guest mode detection** — hides restricted nav items for unregistered patients
- **Profile sync** — subscribes to `BroadcastChannel("coha_profile_sync")` and `storage` events to keep avatar/name current across tabs

**Auth state subscription lifecycle:**
```
mount → getSession() → setSession + loadProfile
      → onAuthStateChange subscription → reactive session updates
      → BroadcastChannel / storage listeners for profile sync
unmount → unsubscribe + close channel + remove storage listener
```

### 8.3 Design System

**File:** `src/styles.css` (Tailwind CSS v4)

Design tokens use **OKLCH colour format** throughout:

```css
:root {
  --primary: oklch(0.5 0.12 190);   /* Teal #438787 equivalent */
  --background: oklch(1 0 0);
  --foreground: oklch(0.1 0 0);
  /* ... full set of semantic tokens */
}
```

**Font:** Inter (loaded from Google Fonts, preconnect links in `<head>`)

**Radius scale:** `sm → md → lg → xl → 2xl → 3xl → 4xl` mapped to CSS calc expressions from a single `--radius` base variable.

**Dark mode:** Class-based (`.dark` parent selector) via `@custom-variant dark (&:is(.dark *))`.

---

## 9. Feature Deep-Dives

### 9.1 AI Health Assistant

**Route:** `/patient/assistant`  
**File:** `src/routes/patient.assistant.tsx` (~936 lines)

**Architecture:**
- Multi-session chat with persistent history (JSON in `localStorage`)
- Each session: `{ id, title, updatedAt, messages[], assessment, care, dynamicSuggestions }`
- **Real session context** is injected into the Groq prompt: patient name, age, gender, past diseases, current medications, allergies, family history
- Supports **multimodal input**: text, image attachment, voice (via `transcribeAudio`)
- **Agentic routing**: AI can programmatically trigger doctor cards, booking forms, or redirect to specific pages
- Follow-up question generation adapts to conversation history
- **Reasoning display**: extended thinking steps shown in expandable UI for transparency
- Guest mode gets limited credits tracked in `localStorage`

**Conversation flow:**
```
User input (text/image/voice)
  → analyseSymptoms(messages, patientProfile)
    → [Groq LLM] OR [local keyword fallback]
      → Assessment { possibleConditions, risk, followUpQuestions, agenticAction }
        → recommendCare(assessment, profile)
          → Recommendation { doctors[], hospitals[], care[] }
            → UI renders: RiskBadge + DoctorCards + ActionButton
```

### 9.2 Medical Image Analysis Pipeline

**Route:** `/patient/images`  
**File:** `src/routes/patient.images.tsx` (~982 lines)

**Supported regions:** Oral, Skin, Eye

**Pipeline execution** (simulated progressive with real AI calls):

| Stage | What Happens |
|---|---|
| Quality Pre-Check | Validates image is medical-relevant, detects region, estimates Fitzpatrick type |
| YOLO Lesion Localisation | Returns `boundingBox: [x, y, w, h]` coordinates for lesion highlight overlay |
| ABCDE Extraction | Asymmetry, Border, Colour, Diameter, Evolution analysis |
| External Search Verification | AI cites external medical evidence to calibrate prediction |
| Deep Reasoning Score | Final `malignancyProbability` (0–1), `referralTriage` classification |

**Output display includes:**
- Interactive bounding box overlay on uploaded image
- ABCDE analysis badges
- Dermoscopy feature table (if applicable)
- Confidence level + clinical certainty statement
- TNM staging reference (with disclaimer: requires confirmed diagnosis)
- Matched specialist doctor cards with booking CTA
- Export as PDF

**Model metrics** (served from static JSON datasets):
- `skin_cancer_model_metrics.json`: sensitivity, specificity, AUC per subtype
- `eye_cancer_dataset_metrics.json`: dataset class distribution, evaluation metrics

### 9.3 Telemedicine & Real-Time Video (WebRTC)

**Route:** `/patient/telemedicine` | **Doctor side:** `/doctor/` (queue management)

#### Signalling Architecture

WebRTC peer-to-peer connection is brokered via **Supabase Realtime Broadcast** channels (no dedicated signalling server required):

```
Patient Browser                                    Doctor Browser
     │                                                   │
     │──── subscribe: channel("webrtc-{apptId}") ───────│
     │                                                   │
     │──── offer ──────────────────────────────────────►│
     │                                                   │
     │◄─── answer ────────────────────────────────────  │
     │                                                   │
     │◄──► ice-candidate exchange (STUN: Google servers)│
     │                                                   │
     │══════════════ P2P Media Stream ══════════════════│
```

**`useWebRTC` hook** (`src/hooks/use-webrtc.ts`):
- Manages `RTCPeerConnection` lifecycle (create → negotiate → stream → cleanup)
- Acquires `getUserMedia({ video: true, audio: true })`
- ICE servers: `stun:stun.l.google.com:19302` + `stun:stun1.l.google.com:19302`
- `roomId` = appointment UUID from Supabase
- On unmount: stops all media tracks + closes peer connection + removes Supabase channel

#### Live Chat

Parallel to video, a text + file chat operates:
- Messages persisted in `localStorage` keyed by `meddoc_chat_{apptId}`
- Real-time sync via `supabase.channel("chat_{apptId}").broadcast`
- Cross-tab sync via `storage` event listener
- Supports image and PDF file sharing (base64 FileReader)
- Doctor can end session (`session_ended` broadcast event)
- Patient can rebook an ended session (updates `status → "Scheduled"` in Supabase + LKR payment confirmation flow)

### 9.4 Appointment Booking Engine

**Route:** `/patient/book`  
**File:** `src/routes/patient.book.tsx` (~840 lines)

**Booking funnel:**
1. **Filter panel**: specialty → hospital → branch → doctor name search
2. **Doctor cards**: rating, distance, fee, languages, availability, next slot
3. **Doctor profile dialog**: full bio, experience, reviews
4. **Time slot selection**: pulls `doctor_availability` from Supabase (custom slots) or falls back to fixed defaults
5. **Booking confirmation**: submits to `patientService.bookAppointment()` (3-tier write)
6. **Queue number assignment**: atomic increment per doctor per date
7. **Insurance / ePass handling**: shows membership discounts if ePass is active
8. **Deep-link support**: URL search params `?doctorId=&date=&timeslot=` from AI assistant recommendations

**Guest booking**: Guests can book without registration; guest appointments are stored locally.

### 9.5 Doctor Clinical Dashboard

**Route:** `/doctor/`  
**File:** `src/routes/doctor.index.tsx` (~933 lines)

**Sections:**
- **Stats bar**: Appointments today, Total Revenue (LKR), Waiting now, Follow-ups due
- **Availability Schedule**: date picker to toggle Available / Offline per day
- **Telemedicine Queue**: list of patient appointments with inline:
  - "View Health Background" → fetches and displays patient profile, past diseases, medications, allergies
  - "Start Video Call" → launches `useWebRTC` with the appointment's room ID
  - "Chat" → opens live chat panel
  - "Approve / Reject" appointment
  - "End Session" + View Log
- **Doctor Live Chat Panel**: bidirectional messaging, file/PDF sending, session state management
- **Prescription workflow**: doctor can compose and send digital prescriptions via chat

**Patient health background** is fetched from `patientService.getPatientProfile()` using the `patient_id` from the appointment record.

### 9.6 Hospital Management Portal

**Routes:** `/hospital/*`  
**Files:** `hospital.index.tsx`, `hospital.doctors.tsx`, `hospital.branches.tsx`, `hospital.profile.tsx`

**Capabilities:**
- Overview: live appointment metrics, department stats
- **Doctor Roster**: view, add, edit, delete doctors; sync to `doctors_roster` table
- **Branch Management**: add/remove hospital branches; each branch has departments, facilities, emergency flag
- **Hospital Profile**: edit name, city, phone, emergency status, facilities
- **Reviews dashboard**: view patient reviews per hospital/branch from `hospital_reviews` table

### 9.7 Platform Administration

**Route:** `/admin/`  
**File:** `src/routes/admin.index.tsx` (~491 lines)

**Capabilities:**
- **Platform Stats**: total users, doctors, hospitals, AI requests (pulled from Supabase + mock)
- **Account Provisioning**: create Doctor and Hospital accounts using `adminCreateAccount()` (session-safe, uses `adminAuthClient`)
- **AI Model Status Monitor**: real-time status cards for each AI model (Groq, Vision AI, symptom engine) showing latency and request counts
- **All Appointments Table**: cross-portal view of all appointment records
- **Hospital Registry**: list of all registered hospitals

---

## 10. Server-Side Architecture

**File:** `src/server.ts`

The custom server entry point is a **Cloudflare Workers / Nitro-compatible fetch handler**:

```typescript
export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const url = new URL(request.url, "http://localhost");

    // Route: favicon (prevents 500 errors)
    if (url.pathname.startsWith("/favicon")) → serve inline SVG

    // Route: /api/profile (GET/POST) → file-backed profile sync
    // Route: /api/appointments (GET/POST) → file-backed appointment sync

    // Fallthrough: SSR via TanStack Start
    const handler = await getServerEntry();
    const response = await handler.fetch(request, env, ctx);
    return normalizeCatastrophicSsrResponse(response);
  }
}
```

**Error normalisation:** If TanStack's h3 swallows an internal error and returns `{ unhandled: true, message: "HTTPError" }`, the server converts it to a human-readable HTML error page instead of a raw JSON 500.

**Filesystem helpers** (`safeReadJson`, `safeWriteJson`) use dynamic `require("node:fs")` to avoid parse-time failures on edge runtimes where the module doesn't exist.

---

## 11. Real-Time & Cross-Tab Sync

Three layers of real-time communication are in use simultaneously:

| Layer | Technology | Use Case |
|---|---|---|
| DB push | Supabase `postgres_changes` | Appointment updates broadcast to all connected clients |
| Presence/signalling | Supabase Broadcast | WebRTC offer/answer/ICE exchange; chat messages; session events |
| Cross-tab | `BroadcastChannel` | Profile updates pushed to all open tabs of same origin |
| Cross-tab fallback | `storage` event | For browsers without BroadcastChannel |

---

## 12. Data Persistence Strategy

Every critical write uses a **write-through** strategy across multiple stores:

```
Write operation
  │
  ├── 1. POST /api/profile (or /api/appointments)  ← server memory + .json file
  │
  ├── 2. supabase.from("...").upsert(...)           ← cloud DB
  │
  └── 3. localStorage.setItem(...)                  ← browser cache
```

**Read priority:** Server API → Supabase → localStorage → Mock data

This ensures the application remains functional in:
- Full cloud mode (Supabase + Nitro server)
- Local dev mode (Nitro server + localStorage, no Supabase)
- Completely offline / demo mode (localStorage + mock data)

---

## 13. Session & Auth Guard Behaviour

```
PortalShell mounts
  │
  ├── getSession() → reads Supabase session
  │
  ├── onAuthStateChange(callback)
  │     │
  │     └── on SIGNED_OUT or token expire:
  │           session = null
  │           → useEffect detects: !isLoading && !session && !isGuest
  │           → navigate({ to: "/auth", replace: true })
  │
  └── isGuest check (patient portal only):
        profile === null && portalLabel includes "patient"
        → show GuestCreditBanner, hide restricted nav items
        → do NOT redirect to /auth
```

---

## 14. Build & Deployment

### Build Commands

```bash
# Development server with HMR
npm run dev           # or: bun run dev

# Production build (SSR + client bundles)
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint

# Format
npm run format
```

### Build Output

```
.output/
  public/               # Static assets (client JS bundles, CSS)
  server/               # SSR server bundles
    index.mjs           # Nitro server entry (~923 kB pre-gzip)
    wrangler.json       # Cloudflare Workers deployment config
```

### Deployment Targets

| Target | Command |
|---|---|
| Cloudflare Workers | `npx nitro deploy --prebuilt` (auto-configured by Nitro) |
| Preview | `npx vite preview` |

---

## 15. Environment Configuration

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Groq AI Inference Engine (Optional but recommended for full AI features)
VITE_GROQ_API_KEY=gsk_your-groq-api-key-here
```

> **Security note:** `VITE_` prefixed variables are embedded in the client bundle and visible in the browser. The Supabase `anon` key is safe to expose as long as Row Level Security policies are correctly configured. Never put your Supabase `service_role` key in `VITE_` variables.

---

## 16. Development Setup & Run Instructions

### Prerequisites

- **Node.js**: `>=18.x` (or **Bun**: `>=1.0`)
- **Package Manager**: `npm`, `pnpm`, or `bun`
- **Database**: Supabase account (or use built-in offline/localStorage fallback)

### Quick Start Guide

```bash
# 1. Clone repository & install dependencies
git clone https://github.com/kavishkat2002/coha-care-connect.git
cd coha-care-connect
npm install

# 2. Configure environment variables
# Create a .env file with your Supabase & Groq keys:
# VITE_SUPABASE_URL=https://htkaegeoqtjmpdywrtzy.supabase.co
# VITE_SUPABASE_ANON_KEY=...
# VITE_GROQ_API_KEY=...

# 3. Start local development server
npm run dev

# App runs locally at: http://localhost:3000 (or http://localhost:5173)
```

### Available NPM Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Starts Vite HMR local dev server |
| `build` | `npm run build` | Compiles production client & Nitro SSR server bundle |
| `preview` | `npm run preview` | Previews the production build locally |
| `typecheck` | `npm run typecheck` | Validates TypeScript with `tsc --noEmit` |
| `lint` | `npm run lint` | Runs ESLint analysis across the codebase |
| `lint:fix` | `npm run lint:fix` | Auto-fixes ESLint formatting and rule warnings |
| `format` | `npm run format` | Runs Prettier formatter across all source files |

---

## 16.1 Demo & Test Credentials

The platform supports 4 distinct portal roles. You can sign in using the test accounts below, or click **"Register"** on the `/auth` page to create your own account under any role.

| Role | Email | Password | Target Portal | Notes |
|---|---|---|---|---|
| **Doctor** | `amara.silva@meddoc.com` | `password123` | `/doctor` | Pre-configured Consultant Dermatologist account (Dr. Amara Silva) |
| **Patient** | `kavishka@gmail.com` | `password123` | `/patient` | Patient profile with sample health records, appointments, and ePass |
| **Hospital** | `hospital@lakeside.com` | `password123` | `/hospital` | Hospital administrator for Lakeside General Hospital |
| **Admin** | `admin@meddoc.com` | `password123` | `/admin` | System Administrator with full operational & provisioning control |

> 💡 **Self-Registration**: You can also register a brand new account with any valid email and password directly on the [`/auth`](/auth) page by selecting your desired role tab (*Patient*, *Doctor*, or *Hospital*).

### Database Seeding & Maintenance Scripts

```bash
# Seed initial hospital registry into Supabase
npx tsx scripts/seed_hospitals.ts

# Seed doctor schedules and clinic roster
npx tsx scripts/seed_roster.ts

# Test Supabase connectivity and verify tables
node scripts/check_db.mjs
```

---

## 17. AI Datasets & Model Artefacts

| File | Description |
|---|---|
| `breast_cancer_dataset.csv` | Wisconsin Breast Cancer dataset (30 features, 569 records) used to validate AI accuracy claims |
| `data/skin_cancer_model_metrics.json` | Per-class metrics for skin cancer classifier (sensitivity, specificity, AUC) |
| `data/skin_cancer_dataset_metrics.json` | HAM10000 dataset class distribution and preprocessing metadata |
| `data/eye_cancer_dataset_metrics.json` | Ocular oncology dataset evaluation metrics |
| `data/disease_symptoms.json` | 700+ symptom-to-disease mappings used by local keyword fallback |
| `data/lab_tests.json` | Reference ranges for common lab tests used in report analysis |
| `train_skin_cancer_model.py` | Python training script (PyTorch/sklearn) — not run at app startup |
| `fetch_breast_cancer.py` | Script to fetch and preprocess the UCI breast cancer dataset |

---

## 18. Known Limitations & Technical Debt

| Area | Issue |
|---|---|
| **RLS** | Row Level Security is disabled on all Supabase tables. Policies must be written before production. |
| **AI Fallback** | The Groq API key is not in this repo — without it, all AI features use the local keyword engine which has lower accuracy. |
| **WebRTC NAT Traversal** | Only STUN servers configured. For production, TURN servers are required for clients behind symmetric NAT. |
| **File Storage** | Medical images and PDFs are base64 in-memory — not persisted to cloud storage. Large images will exhaust localStorage quota. |
| **Mock Data Coupling** | Several components fall back to hardcoded mock doctors/hospitals when DB is unavailable. This creates a data consistency gap. |
| **Doctor Availability** | Queue number is client-assigned (not atomic on the DB level), which could cause duplicate queue numbers under concurrent writes. |
| **Admin Accounts** | Any user who knows the admin email/password can access the admin portal; no additional admin verification layer. |
| **elab / pharmacy roles** | Defined in the Role type and `portalHome` map, but no dedicated routes or portal UIs have been built yet. |

---

## 19. Security Considerations

| Consideration | Current State | Recommended Action |
|---|---|---|
| **Supabase RLS** | Disabled | Enable per-table policies; patients should only read their own appointments |
| **VITE env vars** | Supabase URL + anon key exposed in bundle | Acceptable for anon key; never put service role key in VITE env |
| **Admin provisioning** | Uses session-safe secondary client | ✅ Correct pattern — prevents session hijack |
| **AI disclaimer** | Shown on all AI-powered screens | ✅ Implemented |
| **WebRTC** | Direct P2P (no TURN relay) | Add TURN server for production reliability |
| **XSS** | Sonner toast library + React JSX (auto-escapes) | ✅ Low risk; avoid `dangerouslySetInnerHTML` |
| **CSRF** | `createCsrfMiddleware` imported in server bundle | Verify middleware is active for API POST routes |
| **Medical data at rest** | In Supabase (encrypted at rest by default) | Ensure Supabase project is in compliant region |

---

## License

MedDoc 2026© . All rights reserved.

---

