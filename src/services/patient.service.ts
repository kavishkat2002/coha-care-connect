import { supabase } from "@/lib/supabase";
import { type Appointment, type ReportItem, type TimelineItem, patientProfile as mockPatientProfile, reports as mockReports, timeline as mockTimeline } from "@/data/mock";
import { fetchServerProfile, updateServerProfile as updateServerProfileFn } from "@/services/profile.server";

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
  nic?: string;
  pastDiseases: string[];
  medications: string[];
  allergies: string[];
  familyHistory: string[];
};

const profileSyncChannel = typeof window !== "undefined" && "BroadcastChannel" in window 
  ? new BroadcastChannel("coha_profile_sync") 
  : null;

export const patientService = {
  /**
   * Fetch all appointments from Supabase
   */
  async getAppointments(): Promise<DbAppointment[]> {
    // 1. Try file-backed server API endpoint (works across all browsers & devices)
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {}

    // 2. Try Supabase
    const { data, error } = await supabase
      .from("appointments")
      .select("*");
    
    if (!error && data && data.length > 0) return data;

    // 3. Try LocalStorage
    try {
      const localApps = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
      if (Array.isArray(localApps)) return localApps;
    } catch (e) {}

    return [];
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
    const newApp = { ...appointment, queue_number: assignedQueueNumber, id: 'app-' + Date.now() };
    
    // Save to server API endpoint (syncs to all browsers)
    try {
      void fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApp),
      });
    } catch (e) {}

    const { data, error } = await supabase
      .from("appointments")
      .insert([{ ...appointment, queue_number: assignedQueueNumber }])
      .select()
      .single();

    if (error) {
      console.warn("Supabase insert failed, falling back to LocalStorage:", error);
      try {
        const localApps = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
        localApps.push(newApp);
        localStorage.setItem('mock_appointments', JSON.stringify(localApps));
        return newApp;
      } catch (e) {
        return newApp;
      }
    }

    return data || newApp;
  },

  /**
   * Fetch all reports from Supabase
   */
  async getReports(): Promise<ReportItem[]> {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*");
      
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
    
    return mockReports;
  },

  /**
   * Fetch timeline from Supabase or fallback
   */
  async getTimeline(): Promise<TimelineItem[]> {
    try {
      const { data, error } = await supabase
        .from("timeline")
        .select("*")
        .order("date", { ascending: false });
      
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
    
    return mockTimeline;
  },

  /**
   * Fetch patient profile from domain cookie, Supabase, or local storage
   */
  async getPatientProfile(id?: string): Promise<PatientProfile | null> {
    let activeId = id || "p1";

    // 1. Try file-backed server API endpoint (syncs across all browsers & devices)
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data && data.name) return data;
      }
    } catch (e) {}

    // 2. Try TanStack Start Server Function RPC
    try {
      const serverProfile = await fetchServerProfile();
      if (serverProfile && serverProfile.name) {
        return serverProfile;
      }
    } catch (e) {}

    // 3. Try reading shared domain cookie
    if (typeof document !== "undefined") {
      try {
        const match = document.cookie.match(/(?:^|; )coha_patient_profile=([^;]*)/);
        if (match && match[1]) {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed && parsed.name) return parsed;
        }
      } catch (e) {}
    }

    // 4. Try reading local shared storage
    try {
      const shared = localStorage.getItem("coha_patient_profile_shared");
      if (shared) {
        const parsed = JSON.parse(shared);
        if (parsed && parsed.name) return parsed;
      }
      const local = localStorage.getItem(`mock_patient_profile_${activeId}`);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.name) return parsed;
      }
    } catch (e) {}

    // 5. Try Supabase table
    try {
      const { data, error } = await supabase
        .from("patient_profiles")
        .select("*")
        .eq("id", activeId)
        .single();
      if (!error && data) return data;
    } catch (e) {}

    return { id: activeId, ...mockPatientProfile } as PatientProfile;
  },

  /**
   * Update patient profile with domain cookie and shared storage persistence
   */
  async updatePatientProfile(profile: PatientProfile): Promise<PatientProfile | null> {
    // 0. Mutate in-memory mock object so all fallbacks across the app reflect updated profile
    try {
      Object.assign(mockPatientProfile, profile);
    } catch (e) {}

    // 1. Save to server API endpoint (syncs to all browsers)
    try {
      void fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
    } catch (e) {}

    // 2. Save to domain cookie (accessible across all browser windows on same host)
    if (typeof document !== "undefined") {
      try {
        const cookieVal = encodeURIComponent(JSON.stringify(profile));
        document.cookie = `coha_patient_profile=${cookieVal}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (e) {}
    }

    // 2. Save to local shared storage & broadcast
    try {
      localStorage.setItem(`mock_patient_profile_${profile.id}`, JSON.stringify(profile));
      localStorage.setItem("coha_patient_profile_shared", JSON.stringify(profile));
      profileSyncChannel?.postMessage({ type: "PROFILE_UPDATED", profile });
    } catch (e) {}

    // 3. Save to Supabase table
    try {
      const { data, error } = await supabase
        .from("patient_profiles")
        .upsert(profile)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {}

    return profile;
  },

  /**
   * Instantly sync active MedDoc ePass membership & profile details to Supabase
   */
  async syncEPassMembershipToSupabase(membership: {
    patient_id: string;
    patient_name: string;
    patient_phone: string;
    patient_nic?: string;
    plan_id: string;
    plan_name: string;
    status: string;
    ai_credits?: number;
  }) {
    // 1. Save to Supabase patient_memberships table
    try {
      const { data, error } = await supabase
        .from("patient_memberships")
        .upsert({
          id: membership.patient_id,
          patient_name: membership.patient_name,
          patient_phone: membership.patient_phone,
          patient_nic: membership.patient_nic,
          plan_id: membership.plan_id,
          plan_name: membership.plan_name,
          status: membership.status,
          ai_credits: membership.ai_credits,
          updated_at: new Date().toISOString(),
        })
        .select();
      if (!error) console.log("Supabase ePass sync success:", data);
    } catch (e) {
      console.warn("Supabase ePass sync notice:", e);
    }

    // 2. Also sync to file-backed server API endpoint
    try {
      void fetch("/api/epass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(membership),
      });
    } catch (e) {}
  },

  /**
   * Instantly sync remaining AI credits count to Supabase
   */
  async updateAICredits(patientId: string, credits: number) {
    try {
      await supabase
        .from("patient_memberships")
        .update({
          ai_credits: credits,
          updated_at: new Date().toISOString(),
        })
        .eq("id", patientId);
    } catch (e) {
      console.warn("Supabase credit sync notice:", e);
    }
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
