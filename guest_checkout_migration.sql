-- Update appointments table to support guest checkouts
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_mobile TEXT,
ADD COLUMN IF NOT EXISTS patient_nic TEXT,
ADD COLUMN IF NOT EXISTS patient_email TEXT,
ADD COLUMN IF NOT EXISTS patient_city TEXT;

-- Remove NOT NULL requirement from patient_id if it exists
ALTER TABLE public.appointments ALTER COLUMN patient_id DROP NOT NULL;
