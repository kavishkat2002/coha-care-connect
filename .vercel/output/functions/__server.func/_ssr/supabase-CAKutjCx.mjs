import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-CAKutjCx.js
var supabaseUrl = "https://htkaegeoqtjmpdywrtzy.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a2FlZ2VvcXRqbXBkeXdydHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDYwNzIsImV4cCI6MjEwMTUyMjA3Mn0.gitrqSgV1RZ00NkFRkDTdnpO-g4x-op1EYcjO9QNBHs";
var supabase = createClient(supabaseUrl, supabaseAnonKey);
var adminAuthClient = createClient(supabaseUrl, supabaseAnonKey, { auth: {
	persistSession: false,
	autoRefreshToken: false,
	detectSessionInUrl: false,
	storageKey: "admin-auth-token"
} });
//#endregion
export { supabase as n, adminAuthClient as t };
