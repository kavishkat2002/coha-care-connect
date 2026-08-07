import { supabase } from "@/lib/supabase";
import { type Hospital } from "@/data/mock";

export const hospitalService = {
  /**
   * Fetch all hospitals from Supabase
   */
  async getAllHospitals(): Promise<Hospital[]> {
    const { data, error } = await supabase
      .from("hospitals")
      .select("*");
    
    if (error) {
      console.error("Error fetching hospitals:", error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Save a single hospital to Supabase (insert or update)
   */
  async saveHospital(hospital: Hospital): Promise<boolean> {
    const { error } = await supabase
      .from("hospitals")
      .upsert([hospital], { onConflict: "id" });
      
    if (error) {
      console.error("Error saving hospital:", error);
      return false;
    }
    return true;
  }
};
