import { supabase } from "@/lib/supabase";
import { type Appointment, type ReportItem, type TimelineItem, patientProfile as mockPatientProfile } from "@/data/mock";

// Type for the new Supabase appointment row
export type DbAppointment = {
  id?: string;
  patient_id?: string | null;
  patient_name?: string;
  patient_mobile?: string;
  patient_nic?: string;
  patient_email?: string;
  patient_city?: string;
  doctor_id: string;
  hospital_id: string;
  date: string;
  time: string;
  queue_number: number;
  status: string;
  fee: number;
  created_at?: string;
};

export type PatientProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  city: string;
  phone: string;
  email: string;
  pastDiseases: string[];
  medications: string[];
  allergies: string[];
  familyHistory: string[];
};

export const patientService = {
  /**
   * Fetch all appointments from Supabase
   */
  async getAppointments(): Promise<DbAppointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*");
    
    if (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Fetch custom time slots for a doctor on a specific date, or fallback to defaults
   */
  async getDoctorAvailability(doctorId: string, date: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("doctor_availability")
      .select("time_slots")
      .eq("doctor_id", doctorId)
      .eq("date", date)
      .single();

    if (error || !data || !data.time_slots || data.time_slots.length === 0) {
      // Fallback default slots if doctor hasn't configured manually
      return ["09:00", "10:30", "12:00", "14:30", "16:30", "18:00"];
    }
    return data.time_slots;
  },

  /**
   * Fetch how many patients are booked for a specific doctor, date, and time slot
   */
  async getSlotQueueCount(doctorId: string, date: string, time: string): Promise<number> {
    const { count, error } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", doctorId)
      .eq("date", date)
      .eq("time", time);

    if (error) {
      console.warn("Supabase count failed, falling back to LocalStorage:", error);
      try {
        const localApps = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
        return localApps.filter((a: any) => a.doctor_id === doctorId && a.date === date && a.time === time).length;
      } catch (e) {
        return 0;
      }
    }
    return count || 0;
  },

  /**
   * Securely book an appointment and return the assigned queue number
   */
  async bookAppointment(appointment: Omit<DbAppointment, "id" | "created_at" | "queue_number">): Promise<DbAppointment | null> {
    // 1. Get the current queue count to assign the NEXT number
    const currentQueueCount = await this.getSlotQueueCount(
      appointment.doctor_id, 
      appointment.date, 
      appointment.time
    );
    const assignedQueueNumber = currentQueueCount + 1;

    // 2. Insert the appointment
    const { data, error } = await supabase
      .from("appointments")
      .insert([{ ...appointment, queue_number: assignedQueueNumber }])
      .select()
      .single();

    if (error) {
      console.warn("Supabase insert failed, falling back to LocalStorage:", error);
      try {
        const localApps = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
        const newApp = { ...appointment, queue_number: assignedQueueNumber, id: 'local-' + Date.now() };
        localApps.push(newApp);
        localStorage.setItem('mock_appointments', JSON.stringify(localApps));
        return newApp;
      } catch (e) {
        return null;
      }
    }

    return data;
  },

  /**
   * Fetch all reports from Supabase
   */
  async getReports(): Promise<ReportItem[]> {
    const { data, error } = await supabase
      .from("reports")
      .select("*");
    
    if (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Fetch timeline from Supabase
   */
  async getTimeline(): Promise<TimelineItem[]> {
    const { data, error } = await supabase
      .from("timeline")
      .select("*")
      .order("date", { ascending: false }); // Note: Since date is a string (e.g., '28 Jul 2026'), string sorting applies. Better to use proper timestamp columns in production.
    
    if (error) {
      console.error("Error fetching timeline:", error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Fetch patient profile from Supabase
   */
  async getPatientProfile(id: string = "p1"): Promise<PatientProfile | null> {
    const { data, error } = await supabase
      .from("patient_profiles")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error || !data) {
      console.warn("Error fetching patient profile from Supabase, falling back to mock:", error);
      try {
        const local = localStorage.getItem(`mock_patient_profile_${id}`);
        if (local) return JSON.parse(local);
      } catch (e) {}
      return { id: "p1", ...mockPatientProfile } as PatientProfile;
    }
    
    return data;
  },

  /**
   * Update patient profile
   */
  async updatePatientProfile(profile: PatientProfile): Promise<PatientProfile | null> {
    const { data, error } = await supabase
      .from("patient_profiles")
      .upsert(profile)
      .select()
      .single();
    
    if (error) {
      console.warn("Supabase profile update failed, falling back to LocalStorage:", error);
      try {
        localStorage.setItem(`mock_patient_profile_${profile.id}`, JSON.stringify(profile));
        return profile;
      } catch (e) {
        return null;
      }
    }
    
    return data;
  },

  /**
   * Fetch doctor reviews
   */
  async getDoctorReviews(doctorId: string) {
    const { data, error } = await supabase
      .from("doctor_reviews")
      .select("*")
      .eq("doctor_id", doctorId)
      .order("created_at", { ascending: false });
    
    let results = data || [];
    
    if (error) {
      console.warn("Error fetching doctor reviews from Supabase, falling back to local storage:", error);
    }
    
    try {
      const local = JSON.parse(localStorage.getItem('mock_doctor_reviews') || '[]');
      const localForDoc = local.filter((r: any) => r.doctor_id === doctorId);
      results = [...results, ...localForDoc].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (e) {
      // Ignore local storage errors
    }
    
    return results;
  },

  /**
   * Add a new doctor review
   */
  async addDoctorReview(review: { doctor_id: string; patient_id: string; patient_name: string; rating: number; comment: string }) {
    const { data, error } = await supabase
      .from("doctor_reviews")
      .insert([review])
      .select()
      .single();
    
    if (error) {
      console.warn("Supabase insert failed, falling back to LocalStorage:", error);
      try {
        const localReviews = JSON.parse(localStorage.getItem('mock_doctor_reviews') || '[]');
        const newReview = { 
          ...review, 
          id: 'local-rev-' + Date.now(),
          created_at: new Date().toISOString()
        };
        localReviews.push(newReview);
        localStorage.setItem('mock_doctor_reviews', JSON.stringify(localReviews));
        return newReview;
      } catch (e) {
        return null;
      }
    }
    return data;
  },

  /**
   * Update an existing doctor review
   */
  async updateDoctorReview(reviewId: string, rating: number, comment: string) {
    const { data, error } = await supabase
      .from("doctor_reviews")
      .update({ rating, comment })
      .eq("id", reviewId)
      .select()
      .single();
    
    if (error) {
      console.warn("Supabase update failed, falling back to LocalStorage:", error);
      try {
        const localReviews = JSON.parse(localStorage.getItem('mock_doctor_reviews') || '[]');
        const index = localReviews.findIndex((r: any) => r.id === reviewId);
        if (index > -1) {
          localReviews[index] = { ...localReviews[index], rating, comment };
          localStorage.setItem('mock_doctor_reviews', JSON.stringify(localReviews));
          return localReviews[index];
        }
        return null;
      } catch (e) {
        return null;
      }
    }
    return data;
  },

  /**
   * Delete a doctor review
   */
  async deleteDoctorReview(reviewId: string) {
    const { error } = await supabase
      .from("doctor_reviews")
      .delete()
      .eq("id", reviewId);
      
    if (error) {
      console.warn("Supabase delete failed, falling back to LocalStorage:", error);
      try {
        const localReviews = JSON.parse(localStorage.getItem('mock_doctor_reviews') || '[]');
        const filtered = localReviews.filter((r: any) => r.id !== reviewId);
        localStorage.setItem('mock_doctor_reviews', JSON.stringify(filtered));
        return true;
      } catch (e) {
        return false;
      }
    }
    return true;
  },

  /**
   * Check if patient has a previous booking with a doctor
   */
  async hasPreviousBooking(doctorId: string, patientId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", doctorId)
      .eq("patient_id", patientId)
      .in("status", ["Completed", "Confirmed"]); // allow Confirmed or Completed to leave a review
    
    if (error) {
      console.warn("Error checking previous bookings in Supabase, falling back to local:", error);
    }
    
    // Check local storage fallback
    try {
      const localApps = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
      const hasLocal = localApps.some((app: any) => 
        app.doctor_id === doctorId && 
        app.patient_id === patientId && 
        (app.status === "Completed" || app.status === "Confirmed")
      );
      if (hasLocal) return true;
    } catch (e) {
      // Ignore local storage errors
    }
    
    return count ? count > 0 : false;
  }
};
