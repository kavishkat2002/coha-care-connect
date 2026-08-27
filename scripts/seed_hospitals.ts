import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { hospitals } from './src/data/mock.ts';

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
  for (const h of hospitals) {
    const { error } = await supabase
      .from('hospitals')
      .upsert({
        id: h.id,
        name: h.name,
        city: h.city,
        rating: h.rating,
        reviews: h.reviews,
        branches: h.branches,
        departments: h.departments,
        emergency: h.emergency,
        facilities: h.facilities,
        phone: h.phone
      });
      
    if (error) {
      console.error(`Failed to seed ${h.name}:`, error.message);
    } else {
      console.log(`Seeded ${h.name}`);
    }
  }
}

seed();
