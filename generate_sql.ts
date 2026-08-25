import { hospitals, doctors } from './src/data/mock.ts';
import fs from 'fs';

let sql = `-- 1. Create hospitals table
CREATE TABLE IF NOT EXISTS public.hospitals (
  id text PRIMARY KEY,
  name text,
  city text,
  rating numeric,
  reviews integer,
  branches jsonb,
  departments jsonb,
  emergency boolean,
  facilities jsonb,
  phone text
);

-- 2. Enable Read Access (so the app can query it without logging in)
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users on hospitals" ON public.hospitals FOR SELECT USING (true);

-- 3. Insert Hospitals (Upsert to avoid duplicates)
INSERT INTO public.hospitals (id, name, city, rating, reviews, branches, departments, emergency, facilities, phone) VALUES
`;

const hValues = hospitals.map(h => `(
  '${h.id}',
  '${h.name.replace(/'/g, "''")}',
  '${h.city.replace(/'/g, "''")}',
  ${h.rating},
  ${h.reviews},
  '${JSON.stringify(h.branches).replace(/'/g, "''")}'::jsonb,
  '${JSON.stringify(h.departments).replace(/'/g, "''")}'::jsonb,
  ${h.emergency},
  '${JSON.stringify(h.facilities).replace(/'/g, "''")}'::jsonb,
  '${h.phone.replace(/'/g, "''")}'
)`).join(',\n');

sql += hValues + `\nON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  branches = EXCLUDED.branches,
  departments = EXCLUDED.departments,
  emergency = EXCLUDED.emergency,
  facilities = EXCLUDED.facilities,
  phone = EXCLUDED.phone;\n\n`;

sql += `-- 4. Insert Doctors
-- Note: Assuming you run this in the Supabase SQL editor as an Admin (postgres role), 
-- this will bypass any RLS policies that block anonymous inserts.
INSERT INTO public.doctors_roster (id, name, specialty, hospital, branch, city, "distanceKm", "experienceYears", rating, reviews, fee, languages, online, queue, "nextSlot", "photoInitials", about) VALUES
`;

const dValues = doctors.map(d => `(
  '${d.id}',
  '${d.name.replace(/'/g, "''")}',
  '${d.specialty.replace(/'/g, "''")}',
  '${d.hospital.replace(/'/g, "''")}',
  '${d.branch.replace(/'/g, "''")}',
  '${d.city.replace(/'/g, "''")}',
  ${d.distanceKm},
  ${d.experienceYears},
  ${d.rating},
  ${d.reviews},
  ${d.fee},
  '${JSON.stringify(d.languages).replace(/'/g, "''")}'::jsonb,
  ${d.online},
  ${d.queue},
  '${d.nextSlot}',
  '${d.photoInitials}',
  '${d.about.replace(/'/g, "''")}'
)`).join(',\n');

sql += dValues + `\nON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  specialty = EXCLUDED.specialty,
  hospital = EXCLUDED.hospital,
  branch = EXCLUDED.branch,
  city = EXCLUDED.city,
  "distanceKm" = EXCLUDED."distanceKm",
  "experienceYears" = EXCLUDED."experienceYears",
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  fee = EXCLUDED.fee,
  languages = EXCLUDED.languages,
  online = EXCLUDED.online,
  queue = EXCLUDED.queue,
  "nextSlot" = EXCLUDED."nextSlot",
  "photoInitials" = EXCLUDED."photoInitials",
  about = EXCLUDED.about;\n`;

fs.writeFileSync('./supabase_seed.sql', sql);
