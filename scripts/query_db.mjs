import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: p } = await supabase.from('patient_profiles').select('*').limit(1);
  console.log('patient_profiles:', p);

  const { data: d } = await supabase.from('doctors_roster').select('*').limit(1);
  console.log('doctors_roster:', d);
}
check();



