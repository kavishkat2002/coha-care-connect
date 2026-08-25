import { supabase } from "@/lib/supabase";
import { type Hospital } from "@/data/mock";

export type HospitalReview = {
  id: string;
  hospital_id: string;
  patient_id: string;
  patient_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export const hospitalService = {
  /**
   * Fetch all hospitals from Supabase
   */
  async getAllHospitals(): Promise<Hospital[]> {
    const { data, error } = await supabase
      .from("hospitals")
      .select("*");
    
    if (error || !data || data.length === 0) {
      if (error) console.warn("Error fetching hospitals:", error);
      const { hospitals: mockHospitals } = await import("@/data/mock");
      return mockHospitals;
    }
    
    return data;
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
  },

  /**
   * Fetch reviews for a specific hospital
   */
  async getHospitalReviews(hospitalId: string): Promise<HospitalReview[]> {
    const { data, error } = await supabase
      .from("hospital_reviews")
      .select("*")
      .eq("hospital_id", hospitalId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Error fetching hospital reviews from Supabase, falling back to LocalStorage:", error);
      try {
        const localReviews = JSON.parse(localStorage.getItem('mock_hospital_reviews') || '[]');
        return localReviews.filter((r: any) => r.hospital_id === hospitalId);
      } catch (e) {
        return [];
      }
    }
    return data || [];
  },

  /**
   * Submit a new hospital review
   */
  async addHospitalReview(review: Omit<HospitalReview, "id" | "created_at">): Promise<boolean> {
    const { error } = await supabase
      .from("hospital_reviews")
      .insert([review]);

    if (error) {
      console.warn("Error adding hospital review to Supabase, falling back to LocalStorage:", error);
      try {
        const localReviews = JSON.parse(localStorage.getItem('mock_hospital_reviews') || '[]');
        localReviews.push({ ...review, id: 'local-' + Date.now(), created_at: new Date().toISOString() });
        localStorage.setItem('mock_hospital_reviews', JSON.stringify(localReviews));
        return true;
      } catch (e) {
        return false;
      }
    }
    return true;
  }
};
