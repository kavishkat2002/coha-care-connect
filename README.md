# 🏥 MedDoc Coha Care Connect (COHA AI)
### Enterprise AI-Powered Healthcare Ecosystem & Telemedicine Platform

> **Architectural Paradigm**: Hybrid Clinical Telemedicine, SSR Web Application, & Multimodal Early Disease / Cancer Screening Platform  
> **Target Industry**: Healthcare SaaS, Clinical Oncology, Digital Health Membership (MedDoc ePass), Remote Patient Care  

---

## 🌟 Executive Summary

**MedDoc Coha Care Connect (COHA AI)** is a state-of-the-art enterprise healthcare architecture designed by Senior AI Engineers and Clinical SaaS Architects. The platform bridges traditional healthcare delivery with cutting-edge machine learning and generative artificial intelligence.

The platform provides a dual-engine capability:
1. **Clinical Telemedicine & Remote Consultations**: Seamless 2-way HD video conferencing, real-time messaging, photo/PDF prescription exchange, doctor pre-approval queues, and automated scheduling.
2. **AI Multimodal Diagnostic Engine**: Automated early cancer risk classification (breast cancer ensemble ML), medical image vision diagnosis, structured OCR lab report extraction, AI health triage, and MedMind eCare medication scheduling.

---

## 📐 System Architecture

The application is built on a modern **Isomorphic Server-Side Rendered (SSR) architecture** using TanStack Start and Nitro, allowing it to run efficiently on Edge networks (e.g., Cloudflare Workers, Vercel Edge).

```mermaid
graph TD
    User([Patient / Doctor]) -->|HTTPS / WSS| CDN[Vite / TanStack Start Edge Node]
    
    subgraph Client Layer (React 19 + TypeScript)
        CDN --> Auth[Auth Gatekeeper / Session Manager]
        CDN --> Telemed[Telemedicine Module]
        CDN --> EPass[MedDoc ePass Membership]
        CDN --> Notifications[Global Notification Panel]
    end

    subgraph Server Layer (Nitro Edge / H3)
        CDN --> API[Server API Routes]
        API --> ProfileSync[Shared Profile Sync .json]
        API --> ApptSync[Shared Appointments Sync .json]
        API --> SSRError[Custom Error Normalization]
    end

    subgraph Backend Services & Storage
        Auth --> SupabaseAuth[Supabase / Custom JWT Auth]
        Telemed --> ApptDB[(PostgreSQL / Supabase Database)]
        EPass --> PayHere[PayHere Payment Gateway]
    end

    subgraph AI Diagnostic Pipeline
        Telemed --> AI_Service[AI Diagnostic Hub]
        AI_Service --> ML_Model[ML Classification Engine - Python / Scikit-Learn]
        AI_Service --> Vision_AI[Multimodal Image & Report Analyzer - Llama Vision API]
    end
```

---

## ⚙️ Technical Deep Dive & Data Flow

### 1. Routing & Server-Side Rendering (SSR)
The application leverages **@tanstack/react-router** and **@tanstack/react-start** for universal routing. 
- **Nitro Edge Runtime**: The `server.ts` entry point intercepts all HTTP requests. 
- **API Interception**: Routes like `/api/profile` and `/api/appointments` are manually intercepted to provide lightweight, file-backed state sync across sessions (useful for multi-tab or multi-device state without relying entirely on Supabase during development).
- **Error Normalization**: A custom `normalizeCatastrophicSsrResponse` intercepts swallowed H3 errors, safely rendering a custom `renderErrorPage()` HTML fallback to prevent ugly stack traces from leaking to the client on 500 errors.

### 2. Authentication & Authorization
- **Supabase JWT**: `services/auth.service.ts` wraps Supabase's authentication client, mapping users to strict roles (`patient`, `doctor`, `hospital`, `admin`).
- **Registration IDs**: Doctors are assigned unique IDs (`DOC-XXXXXX`) allowing hospitals to link profiles directly.
- **Route Guards**: `Route.beforeLoad` hooks dynamically protect routes based on the authenticated session's role, redirecting unauthorized users to `/auth`.

### 3. Database Schema (PostgreSQL)
The Supabase PostgreSQL backend handles relational data:
- `appointments`: Tracks `patient_id` (foreign key to `auth.users`), `doctor_id`, `hospital_id`, `date`, `time`, and `queue_number`.
- `hospital_reviews`: Stores 1-5 star ratings and textual comments linking patients to hospitals.
- `doctor_availability`: Tracks dynamic arrays of available `time_slots` mapped to specific dates, ensuring real-time concurrency handling when patients book.

### 4. AI & Machine Learning Pipeline
The AI architecture utilizes a hybrid **Cloud LLM + Local ML Strategy**:

- **Multimodal Medical Vision (Llama 3.2 11B Vision)**: Image uploads (skin lesions, reports) are converted to Base64 and sent to the Groq API. The prompt enforces a strict JSON schema for ABCDE (Asymmetry, Border, Color, Diameter, Evolution) dermoscopic feature extraction and bounding box detection.
- **Offline/Fallback Heuristics**: If the API fails, `ai.service.ts` falls back to an advanced local image heuristic parser (`extractImageFeaturesFromBase64`), calculating:
  - **Color Variegation & Redness Ratio** (RGB pixel grouping)
  - **Border Irregularity** (High-contrast transition counts)
  - **Entropy & Asymmetry Scoring**
- **Offline ML Training (`fetch_breast_cancer.py`)**: Uses Scikit-Learn's `RandomForestClassifier` trained on the Wisconsin Breast Cancer Dataset. It serializes the model performance and ROC-AUC metrics directly into JSON for the frontend to consume.

---

## 🔥 Key System Capabilities & Modules

### 1. 🛡️ MedDoc ePass Digital Health Membership
- **3-Tier Subscription Engine**: Basic Health, Gold Care, and Platinum Oncology.
- **30-Day Active Validity**: Automated expiration tracking (`valid_until` timestamp enforcement).
- **PayHere Payment Integration**: Interactive checkout with instant tier activation.

### 2. 📹 HD Video Telemedicine & Scheduled Consultations
- **Date-Locked Patient Video Access**: The **"Join Video Call"** button is automatically unlocked **only on or after the scheduled appointment date**.
- **Interactive HD Video Meeting Rooms**: Includes picture-in-picture patient view, live encrypted call timer (`00:45`), mic mute toggles, camera stream controls, and single-click termination.

### 3. 💬 2-Way Doctor-Patient Chat & File Sharing
- **Photo & Document Uploads**: Bi-directional file exchange supporting symptom photos and PDF medical documents/e-prescriptions.
- **Rich Chat Bubbles**: Inline image preview thumbnails and PDF document download cards.

### 4. 🧬 AI Early Cancer & Diagnostic Screening Engine
- **Medical Report OCR & Structured Insights**: Extracts key biomarkers, blood counts, and diagnostic flags from uploaded lab PDFs and images.
- **MedMind eCare Medication Scheduler**: Automated pill reminders, dosage tracking, and timing notifications.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite, TanStack Start |
| **Styling & UI** | TailwindCSS 4, shadcn/ui, Radix UI, Framer Motion, Lucide |
| **State & Navigation** | TanStack React Router, React Query |
| **AI / Machine Learning** | Python 3.10+, Scikit-Learn, Google Gemini API, Groq Llama Vision |
| **Database & Auth** | Supabase, PostgreSQL, Nitro Edge FS Fallbacks |
| **Payment Gateway** | PayHere Integration Sandbox & Live API |

---

## 📂 Project Directory Structure

```text
coha-care-connect/
├── fetch_breast_cancer.py         # ML Model Generator for Breast Cancer Risk Analysis
├── train_skin_cancer_model.py     # ML Model Generator for Dermoscopic Analysis
├── supabase_setup.sql             # Relational Database Schema 
├── src/
│   ├── components/
│   │   ├── portal/                # App Layout & Global Notification Panel
│   │   ├── shared/                # Headers, Cards, Logo & AI Disclaimers
│   │   └── ui/                    # shadcn/ui Reusable Component Library
│   ├── routes/
│   │   ├── __root.tsx             # Root Layout & Global Providers
│   │   ├── auth.tsx               # Authentication (Login / Register Gate)
│   │   ├── doctor.index.tsx       # Doctor Clinical Dashboard & Session Management
│   │   ├── patient.epass.tsx      # MedDoc ePass Membership & Payment Gateway
│   │   ├── patient.telemedicine.tsx # Doctor Search, Favorites, Schedule & Video Calls
│   │   ├── patient.medmind-ecare.tsx # AI Medication & Pill Scheduler
│   │   └── patient.reports.tsx    # Medical Report & Lab OCR Analyzer
│   ├── services/
│   │   ├── ai.service.ts          # AI Diagnostics & LLM Prompt Engineering
│   │   ├── auth.service.ts        # Supabase Authentication & Session Logic
│   │   └── patient.service.ts     # Appointment & Health Data Operations
│   ├── lib/
│   │   ├── error-capture.ts       # H3 SSR Error Interceptor
│   │   └── server.ts              # Nitro Edge Request Handler & Fallback APIs
│   ├── router.tsx                 # TanStack Router Configuration
│   └── start.ts                   # TanStack Start Edge Entry
├── package.json                   # Dependencies & Build Scripts
└── vite.config.ts                 # Vite & Nitro Bundler Configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `npm`, `pnpm`, or `bun`
- **Python**: `v3.10+` (optional for running standalone ML scripts)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kavishkat2002/coha-care-connect.git
   cd coha-care-connect
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:5173`.

5. **Type Checking & Production Build**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 🔒 Safety & Medical Disclaimer

> **IMPORTANT**: MedDoc Coha Care Connect provides AI-assisted diagnostic insights for informational, triage, and educational support only. It does not replace formal clinical medical diagnoses. All diagnostic outputs and image analyses must be reviewed by licensed medical professionals.

---

## 📄 License & Attribution

Designed and engineered by **Coha Care Health Architecture Team**. All rights reserved.
