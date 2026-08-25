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
    
    const { doctors: mockDoctors } = await import("@/data/mock");

    if (error || !data) {
      if (error) console.warn("Error fetching doctors:", error);
      return mockDoctors;
    }
    
    // Merge DB doctors and mock doctors
    const dbDocIds = new Set(data.map(d => d.id));
    const missingMocks = mockDoctors.filter(d => !dbDocIds.has(d.id));
    
    return [...data, ...missingMocks];
  },

  /**
   * Fetch doctors by specialty, ordered by rating and distance
   */
  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    // Fuzzy matching: e.g. "Dermatologist" -> "Derma"
    const searchPrefix = specialty ? specialty.slice(0, 5).toLowerCase() : "";
    const searchTerm = searchPrefix ? `%${searchPrefix}%` : "%";
    
    const { data, error } = await supabase
      .from("doctors_roster")
      .select("*")
      .ilike("specialty", searchTerm)
      .order("rating", { ascending: false })
      .order("distanceKm", { ascending: true })
      .limit(3);
      
    const { doctors: mockDoctors } = await import("@/data/mock");

    if (error || !data) {
      console.warn("Falling back to mock doctors for specialty:", specialty);
      const matched = mockDoctors.filter(d => 
        searchPrefix ? d.specialty.toLowerCase().includes(searchPrefix) : true
      );
      return matched
        .sort((a, b) => b.rating - a.rating || a.distanceKm - b.distanceKm)
        .slice(0, 3);
    }
    
    const dbDocIds = new Set(data.map(d => d.id));
    const missingMocks = mockDoctors.filter(d => 
      !dbDocIds.has(d.id) && 
      (searchPrefix ? d.specialty.toLowerCase().includes(searchPrefix) : true)
    );

    const merged = [...data, ...missingMocks];
    return merged
      .sort((a, b) => b.rating - a.rating || a.distanceKm - b.distanceKm)
      .slice(0, 3);
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
