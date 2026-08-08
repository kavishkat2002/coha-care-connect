-- 1. Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id TEXT NOT NULL,
    hospital_id TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    queue_number INTEGER NOT NULL,
    status TEXT DEFAULT 'Confirmed',
    fee NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create hospital reviews table
CREATE TABLE IF NOT EXISTS public.hospital_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create doctor availability table
CREATE TABLE IF NOT EXISTS public.doctor_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id TEXT NOT NULL,
    date TEXT NOT NULL,
    time_slots TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(doctor_id, date)
);

-- 4. Disable Row Level Security (RLS) for testing so you don't get permission errors
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability DISABLE ROW LEVEL SECURITY;
