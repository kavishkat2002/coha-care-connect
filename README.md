# 🏥 MedDoc Coha Care Connect (COHA AI)
### Enterprise AI-Powered Healthcare Ecosystem & Telemedicine Platform

> **Architectural Paradigm**: Hybrid Clinical Telemedicine & Multimodal Early Disease / Cancer Screening Platform  
> **Target Industry**: Healthcare SaaS, Clinical Oncology, Digital Health Membership (MedDoc ePass), Remote Patient Care  

---

## 🌟 Executive Summary

**MedDoc Coha Care Connect (COHA AI)** is a state-of-the-art enterprise healthcare architecture designed by Senior AI Engineers and Clinical SaaS Architects. The platform bridges traditional healthcare delivery with cutting-edge machine learning and generative artificial intelligence.

The platform provides a dual-engine capability:
1. **Clinical Telemedicine & Remote Consultations**: Seamless 2-way HD video conferencing, real-time messaging, photo/PDF prescription exchange, doctor pre-approval queues, and automated scheduling.
2. **AI Multimodal Diagnostic Engine**: Automated early cancer risk classification (breast cancer ensemble ML), medical image vision diagnosis, structured OCR lab report extraction, AI health triage, and MedMind eCare medication scheduling.

---

## 📐 System Architecture

```mermaid
graph TD
    User([Patient / Doctor]) -->|HTTPS / WSS| CDN[Vite / TanStack Router Client]
    
    subgraph Client Layer (React 18 + TypeScript)
        CDN --> Auth[Auth Gatekeeper / Session Manager]
        CDN --> Telemed[Telemedicine Module]
        CDN --> EPass[MedDoc ePass Membership]
        CDN --> Notifications[Global Notification Panel]
    end

    subgraph Backend Services & Storage
        Auth --> SupabaseAuth[Supabase / Custom JWT Auth]
        Telemed --> ApptDB[(PostgreSQL / Supabase Database)]
        EPass --> PayHere[PayHere Payment Gateway]
    end

    subgraph AI Diagnostic Pipeline
        Telemed --> AI_Service[AI Diagnostic Hub]
        AI_Service --> ML_Model[ML Classification Engine - Python / Scikit-Learn]
        AI_Service --> Vision_AI[Multimodal Image & Report Analyzer - Gemini API]
    end
```

---

## 🔥 Key System Capabilities & Modules

### 1. 🛡️ MedDoc ePass Digital Health Membership
- **3-Tier Subscription Engine**: Basic Health, Gold Care, and Platinum Oncology.
- **30-Day Active Validity**: Automated expiration tracking (`valid_until` timestamp enforcement).
- **Authentication Gatekeeper**: Unauthenticated users attempting to activate a membership pass are redirected to Sign-In/Register and returned smoothly to the payment gateway upon successful login.
- **PayHere Payment Integration**: Interactive checkout with instant tier activation.

### 2. 📹 HD Video Telemedicine & Scheduled Consultations
- **Date-Locked Patient Video Access**: The **"Join Video Call"** button is automatically unlocked **only on or after the scheduled appointment date**, preventing premature access while displaying a clear unlock date countdown badge.
- **Always-On Doctor Video Launcher**: Telemedicine doctors can initiate or join HD video calls with any approved patient at any time.
- **Interactive HD Video Meeting Rooms**: Includes picture-in-picture patient view, live encrypted call timer (`00:45`), mic mute toggles, camera stream controls, and single-click meeting termination.
- **Session Lifecycle Management**: Doctors can approve requests, view full patient health history, conduct video calls, and trigger **"End Session"** to mark consultations as completed and archive records.

### 3. 💬 2-Way Doctor-Patient Chat & File Sharing
- **Photo & Document Uploads**: Bi-directional file exchange supporting symptom photos (`.png`, `.jpg`, `.webp`) and PDF medical documents/e-prescriptions (`.pdf`).
- **Rich Chat Bubbles**: Inline image preview thumbnails and PDF document download cards with red document indicators.
- **Persistent Conversation Storage**: `localStorage` and database fallback synchronization for seamless history retrieval.

### 4. 🧬 AI Early Cancer & Diagnostic Screening Engine
- **Breast Cancer Risk Classification (`fetch_breast_cancer.py`)**: Trained Random Forest ML ensemble evaluating cell nucleomorphology (radius, texture, perimeter, area, smoothness, concavity) to calculate malignancy probabilities.
- **Multimodal Medical Vision Analysis**: Direct image upload evaluation for skin lesions, mammograms, and X-rays with clinical disclaimer warnings.
- **Medical Report OCR & Structured Insights**: Extracts key biomarkers, blood counts, and diagnostic flags from uploaded lab PDFs and images.
- **MedMind eCare Medication Scheduler**: Automated pill reminders, dosage tracking, and timing notifications.

### 5. 🔔 Centralized Notification & Reminder Hub
- **Top Navigation Bell Icon**: Dynamic unread counter badge (`3 new`) displaying pending alerts without invasive animations.
- **Multi-Category Alert Stream**: Aggregates doctor follow-up chat alerts, scheduled appointment reminders, ePass expiration warnings, and pill schedules.
- **Single-Click Quick Navigation**: Tapping any notification routes directly to the relevant portal section.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite, TanStack Router |
| **Styling & Design System** | TailwindCSS, shadcn/ui, Radix UI, Lucide Icons |
| **State & Navigation** | TanStack React Router, React Hooks, Context API |
| **AI / Machine Learning** | Python 3.10+, Scikit-Learn, PyTorch, Google Gemini API |
| **Database & Auth** | Supabase, PostgreSQL, LocalStorage / IndexedDB Fallbacks |
| **Payment Gateway** | PayHere Integration Sandbox & Live API |

---

## 📂 Project Directory Structure

```
coha-care-connect/
├── fetch_breast_cancer.py         # ML Model Generator for Breast Cancer Risk Analysis
├── src/
│   ├── components/
│   │   ├── portal/
│   │   │   └── PortalShell.tsx    # App Layout & Global Notification Panel
│   │   ├── shared/                # Headers, Cards, Logo & AI Disclaimers
│   │   └── ui/                    # shadcn/ui Reusable Component Library
│   ├── routes/
│   │   ├── auth.tsx               # Authentication (Login / Register Gate)
│   │   ├── doctor.index.tsx       # Doctor Clinical Dashboard & Session Management
│   │   ├── patient.epass.tsx      # MedDoc ePass Membership & Payment Gateway
│   │   ├── patient.telemedicine.tsx # Doctor Search, Favorites, Schedule & Video Calls
│   │   ├── patient.medmind-ecare.tsx # AI Medication & Pill Scheduler
│   │   ├── patient.reports.tsx    # Medical Report & Lab OCR Analyzer
│   │   └── patient.profile.tsx    # Patient Profile & Health Background
│   ├── services/
│   │   ├── ai.service.ts          # AI Diagnostics & Gemini API Integration
│   │   ├── auth.service.ts        # Supabase Authentication & Session Logic
│   │   └── patient.service.ts     # Appointment & Health Data Operations
│   └── main.tsx                   # Application Entry Point
├── package.json                   # Dependencies & Build Scripts
└── tsconfig.json                  # TypeScript Compiler Configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm` or `pnpm`
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
