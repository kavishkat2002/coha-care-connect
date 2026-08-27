import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htkaegeoqtjmpdywrtzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a2FlZ2VvcXRqbXBkeXdydHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDYwNzIsImV4cCI6MjEwMTUyMjA3Mn0.gitrqSgV1RZ00NkFRkDTdnpO-g4x-op1EYcjO9QNBHs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createDoc() {
  const email = 'amara.silva@meddoc.com';
  const password = 'password123';
  
  const { data, error } = await supabase.auth.signUp({
    email, 
    password, 
    options: { 
      data: { 
        role: 'doctor', 
        name: 'Dr. Amara Silva', 
        registration_id: 'd1' 
      }
    }
  });

  if (error) {
    console.error('Error creating user:', error);
  } else {
    console.log('Successfully created doctor account:', data.user?.email || email);
  }
}
createDoc();
