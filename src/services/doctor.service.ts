import { supabase } from "@/lib/supabase";
import { type Doctor } from "@/data/mock";

export const doctorService = {
  /**
   * Fetch all doctors from Supabase
   */
  async getAllDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from("doctors_roster")
      .select("*");
    
    if (error) {
      console.error("Error fetching doctors:", error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Save a single doctor to Supabase (insert or update)
   */
  async saveDoctor(doctor: Doctor): Promise<boolean> {
    const { error } = await supabase
      .from("doctors_roster")
      .upsert([doctor], { onConflict: "id" });
      
    if (error) {
      console.error("Error saving doctor:", error);
      return false;
    }
    return true;
  },

  /**
   * Save multiple doctors (batch insert/update)
   */
  async saveAllDoctors(doctors: Doctor[]): Promise<boolean> {
    if (!doctors.length) return true;
    
    const { error } = await supabase
      .from("doctors_roster")
      .upsert(doctors, { onConflict: "id" });
      
    if (error) {
      console.error("Error saving doctors batch:", error);
      return false;
    }
    return true;
  },

  /**
   * Delete a doctor by ID
   */
  async deleteDoctor(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("doctors_roster")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Error deleting doctor:", error);
      return false;
    }
    return true;
  }
};
