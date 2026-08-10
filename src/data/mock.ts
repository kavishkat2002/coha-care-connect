export type Role = "patient" | "doctor" | "hospital" | "admin";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  branch: string;
  city: string;
  distanceKm: number;
  experienceYears: number;
  rating: number;
  reviews: number;
  fee: number;
  languages: string[];
  online: boolean;
  queue: number;
  nextSlot: string;
  photoInitials: string;
  about: string;
  availability?: Record<string, boolean>;
};

export type Hospital = {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  branches: string[];
  departments: string[];
  emergency: boolean;
  facilities: string[];
  phone: string;
};

export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  mode: "In-person" | "Telemedicine";
  status: "Confirmed" | "Completed" | "Cancelled" | "Pending";
};

export type ReportItem = {
  id: string;
  title: string;
  type: "Blood" | "MRI" | "CT" | "Biopsy" | "Lab";
  date: string;
  status: "Analysed" | "Processing";
  flagged: number;
  summary: string;
};

export type TimelineItem = {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: "appointment" | "report" | "image" | "insight" | "prescription";
};

export const SPECIALTIES = [
  "Psychiatry & Mental Health",
  "Dermatology",
  "Oncology",
  "Ophthalmology",
  "Dentistry & Oral Medicine",
  "General Medicine",
  "Radiology",
  "Cardiology",
  "Gynaecology",
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Amara Silva",
    specialty: "Dermatology",
    hospital: "Lakeside General Hospital",
    branch: "Colombo 07",
    city: "Colombo",
    distanceKm: 2.4,
    experienceYears: 14,
    rating: 4.9,
    reviews: 412,
    fee: 4500,
    languages: ["English", "Sinhala"],
    online: true,
    queue: 3,
    nextSlot: "Today · 16:30",
    photoInitials: "AS",
    about:
      "Consultant dermatologist focused on early detection of skin lesions and pigmented mole assessment.",
  },
  {
    id: "d1-b",
    name: "Dr. Amara Silva",
    specialty: "Dermatology",
    hospital: "Nawaloka Hospital",
    branch: "Colombo 02",
    city: "Colombo",
    distanceKm: 4.1,
    experienceYears: 14,
    rating: 4.9,
    reviews: 412,
    fee: 5000,
    languages: ["English", "Sinhala"],
    online: true,
    queue: 1,
    nextSlot: "Tomorrow · 10:00",
    photoInitials: "AS",
    about:
      "Consultant dermatologist focused on early detection of skin lesions and pigmented mole assessment.",
  },
  {
    id: "d2",
    name: "Dr. Nuwan Perera",
    specialty: "Oncology",
    hospital: "Metro Cancer Institute",
    branch: "Nugegoda",
    city: "Colombo",
    distanceKm: 6.1,
    experienceYears: 21,
    rating: 4.8,
    reviews: 289,
    fee: 7500,
    languages: ["English", "Sinhala", "Tamil"],
    online: false,
    queue: 8,
    nextSlot: "Tomorrow · 09:00",
    photoInitials: "NP",
    about: "Medical oncologist specialising in breast and oral cancer screening pathways.",
  },
  {
    id: "d3",
    name: "Dr. Hasini Fernando",
    specialty: "Ophthalmology",
    hospital: "Vision Care Hospital",
    branch: "Kandy",
    city: "Kandy",
    distanceKm: 12.8,
    experienceYears: 9,
    rating: 4.7,
    reviews: 168,
    fee: 3500,
    languages: ["English", "Sinhala"],
    online: true,
    queue: 1,
    nextSlot: "Today · 18:00",
    photoInitials: "HF",
    about: "Eye surgeon treating anterior segment infections and diabetic retinal screening.",
  },
  {
    id: "d4",
    name: "Dr. Ravi Kumar",
    specialty: "Dentistry & Oral Medicine",
    hospital: "Lakeside General Hospital",
    branch: "Dehiwala",
    city: "Colombo",
    distanceKm: 4.9,
    experienceYears: 17,
    rating: 4.6,
    reviews: 233,
    fee: 3000,
    languages: ["English", "Tamil"],
    online: false,
    queue: 5,
    nextSlot: "Fri · 11:15",
    photoInitials: "RK",
    about: "Oral medicine specialist with an interest in persistent ulcers and mucosal lesions.",
  },
  {
    id: "d5",
    name: "Dr. Ishara Jayawardena",
    specialty: "General Medicine",
    hospital: "Riverstone Medical Centre",
    branch: "Galle",
    city: "Galle",
    distanceKm: 3.2,
    experienceYears: 11,
    rating: 4.8,
    reviews: 351,
    fee: 2500,
    languages: ["English", "Sinhala"],
    online: true,
    queue: 2,
    nextSlot: "Today · 15:00",
    photoInitials: "IJ",
    about: "Primary care physician coordinating referrals and preventive health reviews.",
  },
  {
    id: "d6",
    name: "Dr. Menaka De Alwis",
    specialty: "Gynaecology",
    hospital: "Metro Cancer Institute",
    branch: "Colombo 05",
    city: "Colombo",
    distanceKm: 5.5,
    experienceYears: 16,
    rating: 4.9,
    reviews: 402,
    fee: 5500,
    languages: ["English", "Sinhala"],
    online: true,
    queue: 4,
    nextSlot: "Tomorrow · 10:30",
    photoInitials: "MD",
    about: "Consultant gynaecologist leading the breast and cervical screening clinic.",
  },
  {
    id: "d7-psych",
    name: "Dr. Anura Senanayake",
    specialty: "Psychiatry & Mental Health",
    hospital: "Lakeside General Hospital",
    branch: "Colombo 07",
    city: "Colombo",
    distanceKm: 2.1,
    experienceYears: 18,
    rating: 4.9,
    reviews: 489,
    fee: 4500,
    languages: ["English", "Sinhala"],
    online: true,
    queue: 2,
    nextSlot: "Today · 17:00",
    photoInitials: "AS",
    about: "Consultant Psychiatrist specializing in anxiety disorders, clinical depression, CBT therapy, and stress management.",
  },
  {
    id: "d8-psych",
    name: "Dr. Diluka Wickramasinghe",
    specialty: "Psychiatry & Mental Health",
    hospital: "Metro Mind Wellness Institute",
    branch: "Colombo 05",
    city: "Colombo",
    distanceKm: 3.8,
    experienceYears: 14,
    rating: 4.8,
    reviews: 310,
    fee: 4000,
    languages: ["English", "Sinhala"],
    online: true,
    queue: 1,
    nextSlot: "Tomorrow · 10:00",
    photoInitials: "DW",
    about: "Senior Consultant Psychiatrist & Behavioral Therapist focusing on holistic mental wellness and adult psychiatry.",
  },
];

export const hospitals: Hospital[] = [
  {
    id: "h1",
    name: "Lakeside General Hospital",
    city: "Colombo",
    rating: 4.7,
    reviews: 1840,
    branches: ["Colombo 07", "Dehiwala", "Kelaniya"],
    departments: ["Dermatology", "Oral Medicine", "General Medicine", "Radiology"],
    emergency: true,
    facilities: ["24/7 Emergency", "Digital Imaging", "Pharmacy", "Laboratory"],
    phone: "+94 11 234 5678",
  },
  {
    id: "h2",
    name: "Metro Cancer Institute",
    city: "Colombo",
    rating: 4.9,
    reviews: 962,
    branches: ["Nugegoda", "Colombo 05"],
    departments: ["Oncology", "Gynaecology", "Pathology", "Radiology"],
    emergency: true,
    facilities: ["PET-CT", "Biopsy Unit", "Chemotherapy Suite", "Counselling"],
    phone: "+94 11 765 4321",
  },
  {
    id: "h3",
    name: "Vision Care Hospital",
    city: "Kandy",
    rating: 4.6,
    reviews: 512,
    branches: ["Kandy", "Matale"],
    departments: ["Ophthalmology", "Optometry", "General Medicine"],
    emergency: false,
    facilities: ["OCT Scanning", "Day Surgery", "Optical Store"],
    phone: "+94 81 220 1122",
  },
  {
    id: "h4",
    name: "Riverstone Medical Centre",
    city: "Galle",
    rating: 4.5,
    reviews: 738,
    branches: ["Galle", "Hikkaduwa"],
    departments: ["General Medicine", "Cardiology", "Dermatology"],
    emergency: true,
    facilities: ["24/7 Emergency", "Laboratory", "Physiotherapy"],
    phone: "+94 91 224 3344",
  },
];

export const appointments: Appointment[] = [
  {
    id: "a1",
    doctor: "Dr. Amara Silva",
    specialty: "Dermatology",
    hospital: "Lakeside General Hospital · Colombo 07",
    date: "12 Aug 2026",
    time: "16:30",
    mode: "In-person",
    status: "Confirmed",
  },
  {
    id: "a2",
    doctor: "Dr. Ishara Jayawardena",
    specialty: "General Medicine",
    hospital: "Telemedicine",
    date: "15 Aug 2026",
    time: "10:00",
    mode: "Telemedicine",
    status: "Pending",
  },
  {
    id: "a3",
    doctor: "Dr. Ravi Kumar",
    specialty: "Oral Medicine",
    hospital: "Lakeside General Hospital · Dehiwala",
    date: "24 Jul 2026",
    time: "11:15",
    mode: "In-person",
    status: "Completed",
  },
  {
    id: "a4",
    doctor: "Dr. Menaka De Alwis",
    specialty: "Gynaecology",
    hospital: "Metro Cancer Institute · Colombo 05",
    date: "02 Jun 2026",
    time: "09:30",
    mode: "In-person",
    status: "Completed",
  },
];

export const reports: ReportItem[] = [
  {
    id: "r1",
    title: "Full Blood Count",
    type: "Blood",
    date: "28 Jul 2026",
    status: "Analysed",
    flagged: 2,
    summary: "Haemoglobin slightly below reference range; white cell count normal.",
  },
  {
    id: "r2",
    title: "Breast Ultrasound",
    type: "MRI",
    date: "14 Jul 2026",
    status: "Analysed",
    flagged: 1,
    summary: "One well-defined lesion noted. Follow-up imaging suggested in 6 months.",
  },
  {
    id: "r3",
    title: "Oral Biopsy",
    type: "Biopsy",
    date: "02 Jul 2026",
    status: "Processing",
    flagged: 0,
    summary: "Awaiting histopathology summary.",
  },
];

export const timeline: TimelineItem[] = [
  {
    id: "t1",
    date: "28 Jul 2026",
    title: "Blood report analysed",
    detail: "2 values outside reference range · specialist suggestion: General Medicine",
    kind: "report",
  },
  {
    id: "t2",
    date: "24 Jul 2026",
    title: "Consultation completed",
    detail: "Dr. Ravi Kumar · Oral Medicine · Lakeside General Hospital",
    kind: "appointment",
  },
  {
    id: "t3",
    date: "22 Jul 2026",
    title: "Oral image assessment",
    detail: "Low risk indication · review advised if unchanged after 14 days",
    kind: "image",
  },
  {
    id: "t4",
    date: "18 Jul 2026",
    title: "Preventive insight generated",
    detail: "Annual skin screening recommended based on your history",
    kind: "insight",
  },
  {
    id: "t5",
    date: "24 Jun 2026",
    title: "Prescription issued",
    detail: "Topical antifungal · 14 day course",
    kind: "prescription",
  },
];

export const patientProfile = {
  name: "Mahinda Rajapaksha",
  age: 84,
  gender: "Male",
  bloodGroup: "O+",
  city: "Colombo",
  phone: "+94 77 123 4567",
  email: "Mahinda@pohottuwa.com",
  pastDiseases: ["Iron deficiency anaemia (2023)", "Seasonal allergic rhinitis"],
  medications: ["Ferrous sulphate 200mg", "Cetirizine 10mg (as needed)"],
  allergies: ["Penicillin"],
  familyHistory: ["Breast cancer — maternal aunt", "Type 2 diabetes — father"],
};

export const AI_DISCLAIMER =
  "This is an AI-assisted health assessment and should not replace professional medical advice.";
