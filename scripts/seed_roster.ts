import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { doctors } from './src/data/mock.ts';

const envFile = fs.readFileSync('.env', 'utf-8');
const env: Record<string, string> = {};
for (const line of envFile.split('\n')) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    env[k.trim()] = v.trim();
  }
}

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  for (const doc of doctors) {
    // Insert or update
    const { error } = await supabase
      .from('doctors_roster')
      .upsert({
        id: doc.id,
        name: doc.name,
        specialty: doc.specialty,
        hospital: doc.hospital,
        branch: doc.branch,
        city: doc.city,
        distanceKm: doc.distanceKm,
        experienceYears: doc.experienceYears,
        rating: doc.rating,
        reviews: doc.reviews,
        fee: doc.fee,
        languages: doc.languages,
        online: doc.online,
        queue: doc.queue,
        nextSlot: doc.nextSlot,
        photoInitials: doc.photoInitials,
        about: doc.about
      });
      
    if (error) {
      console.error(`Failed to seed ${doc.name}:`, error.message);
    } else {
      console.log(`Seeded ${doc.name}`);
    }
  }
}

seed();
