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
  avatarUrl?: string;
  patientId?: string;
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
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*");
      
      if (!error && data && data.length > 0) return data;
    } catch (e) {}

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
    try {
      const { data, error } = await supabase
        .from("doctor_availability")
        .select("time_slots")
        .eq("doctor_id", doctorId)
        .eq("date", date)
        .single();

      if (!error && data && data.time_slots && data.time_slots.length > 0) {
        return data.time_slots;
      }
    } catch (e) {}

    // Fallback default slots if doctor hasn't configured manually
    return ["09:00", "10:30", "12:00", "14:30", "16:30", "18:00"];
  },

  /**
   * Fetch how many patients are booked for a specific doctor, date, and time slot
   */
  async getSlotQueueCount(doctorId: string, date: string, time: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", doctorId)
        .eq("date", date)
        .eq("time", time);

      if (!error) return count || 0;
    } catch (e) {}

    try {
      const localApps = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
      return localApps.filter((a: any) => a.doctor_id === doctorId && a.date === date && a.time === time).length;
    } catch (e) {
      return 0;
    }
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

    try {
      const { data, error } = await supabase
        .from("appointments")
        .insert([{ ...appointment, queue_number: assignedQueueNumber }])
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {}

    try {
      const localApps = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
      localApps.push(newApp);
      localStorage.setItem('mock_appointments', JSON.stringify(localApps));
      return newApp;
    } catch (e) {
      return newApp;
    }
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
    
    try {
      const saved = localStorage.getItem("mock_reports");
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return mockReports;
  },

  /**
   * Save a newly analyzed report to Supabase and fallback storage
   */
  async addReport(report: ReportItem): Promise<ReportItem> {
    try {
      const { data, error } = await supabase
        .from("reports")
        .insert({
          id: report.id,
          title: report.title,
          type: report.type,
          date: report.date,
          status: report.status,
          flagged: report.flagged,
          summary: report.summary,
        })
        .select()
        .single();
      
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase addReport notice:", e);
    }
    
    try {
      const saved = localStorage.getItem("mock_reports");
      const localReports = saved ? JSON.parse(saved) : [...mockReports];
      localReports.unshift(report);
      localStorage.setItem("mock_reports", JSON.stringify(localReports));
      profileSyncChannel?.postMessage({ type: "REPORTS_UPDATED" });
    } catch (e) {}

    return report;
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
    
    try {
      const saved = localStorage.getItem("mock_timeline");
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return mockTimeline;
  },

  /**
   * Add a new item to the patient's timeline in Supabase and fallback storage
   */
  async addTimelineItem(item: TimelineItem): Promise<TimelineItem> {
    try {
      const { data, error } = await supabase
        .from("timeline")
        .insert({
          id: item.id,
          title: item.title,
          date: item.date,
          detail: item.detail,
          kind: item.kind,
        })
        .select()
        .single();
      
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase addTimelineItem notice:", e);
    }

    try {
      const saved = localStorage.getItem("mock_timeline");
      const localTimeline = saved ? JSON.parse(saved) : [...mockTimeline];
      localTimeline.unshift(item);
      localStorage.setItem("mock_timeline", JSON.stringify(localTimeline));
      profileSyncChannel?.postMessage({ type: "TIMELINE_UPDATED" });
    } catch (e) {}

    return item;
  },

  /**
   * Fetch patient profile from domain cookie, Supabase, or local storage
   */
  async getPatientProfile(id?: string): Promise<PatientProfile | null> {
    let activeId = id || "p1";
    let profile: PatientProfile | null = null;

    // 1. Try file-backed server API endpoint (syncs across all browsers & devices)
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data && data.name) profile = data;
      }
    } catch (e) {}

    // 2. Try TanStack Start Server Function RPC
    if (!profile) {
      try {
        const serverProfile = await fetchServerProfile();
        if (serverProfile && serverProfile.name) {
          profile = serverProfile as any;
        }
      } catch (e) {}
    }

    // 3. Try reading shared domain cookie
    if (!profile) {
      if (typeof document !== "undefined") {
        try {
          const match = document.cookie.match(/(?:^|; )coha_patient_profile=([^;]*)/);
          if (match && match[1]) {
            const parsed = JSON.parse(decodeURIComponent(match[1]));
            if (parsed && parsed.name) profile = parsed;
          }
        } catch (e) {}
      }
    }

    // 4. Try reading local shared storage
    if (!profile) {
      try {
        const shared = localStorage.getItem("coha_patient_profile_shared");
        if (shared) {
          const parsed = JSON.parse(shared);
          if (parsed && parsed.name) profile = parsed;
        }
        const local = localStorage.getItem(`mock_patient_profile_${activeId}`);
        if (local && !profile) {
          const parsed = JSON.parse(local);
          if (parsed && parsed.name) profile = parsed;
        }
      } catch (e) {}
    }

    // 5. Try Supabase table
    if (!profile) {
      try {
        const { data, error } = await supabase
          .from("patient_profiles")
          .select("*")
          .eq("id", activeId)
          .single();
        if (!error && data) profile = data as any;
      } catch (e) {}
    }

    if (!profile) {
      profile = { id: activeId, ...mockPatientProfile } as PatientProfile;
    }

    // Ensure we always have a dynamic unique patientId
    if (profile && !profile.patientId) {
      profile.patientId = `PAT-${Math.floor(Math.random() * 900000) + 100000}`;
      void this.updatePatientProfile(profile);
    }

    return profile;
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
   * Clear all local health data, caches, cookies, and session data upon user logout
   */
  clearLocalHealthData() {
    // 1. Reset in-memory mock objects
    try {
      mockPatientProfile.name = "";
      mockPatientProfile.age = 0;
      mockPatientProfile.gender = "";
      mockPatientProfile.bloodGroup = "";
      mockPatientProfile.city = "";
      mockPatientProfile.phone = "";
      mockPatientProfile.email = "";
      mockPatientProfile.pastDiseases = [];
      mockPatientProfile.medications = [];
      mockPatientProfile.allergies = [];
      mockPatientProfile.familyHistory = [];
      (mockPatientProfile as any).avatarUrl = undefined;
      (mockPatientProfile as any).patientId = undefined;
    } catch (e) {}

    // 2. Clear domain cookie
    if (typeof document !== "undefined") {
      try {
        document.cookie = "coha_patient_profile=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        if (typeof window !== "undefined") {
          document.cookie = `coha_patient_profile=; path=/; domain=${window.location.hostname}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        }
      } catch (e) {}
    }

    // 3. Clear LocalStorage health and patient keys
    if (typeof localStorage !== "undefined") {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            if (
              key.startsWith("mock_patient_profile") ||
              key.startsWith("coha_patient_profile") ||
              key.startsWith("mock_reports") ||
              key.startsWith("mock_timeline") ||
              key.startsWith("mock_appointments") ||
              key.startsWith("mock_doctor_reviews") ||
              key.startsWith("mock_hospital_reviews") ||
              key.startsWith("meddoc_") ||
              key.startsWith("telemed_") ||
              key.startsWith("patient_") ||
              key.startsWith("chat_") ||
              key.startsWith("coha_")
            ) {
              keysToRemove.push(key);
            }
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (e) {}
    }

    // 4. Clear SessionStorage
    if (typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.clear();
      } catch (e) {}
    }

    // 5. Broadcast logout event to other tabs
    try {
      profileSyncChannel?.postMessage({ type: "LOGOUT" });
    } catch (e) {}
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
   * Fetch active MedDoc ePass membership & credits from Supabase
   */
  async getEPassMembership(patientId: string) {
    try {
      const { data, error } = await supabase
        .from("patient_memberships")
        .select("*")
        .eq("id", patientId)
        .maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase getMembership notice:", e);
    }
    return null;
  },

  /**
   * Fetch doctor reviews
   */
  async getDoctorReviews(doctorId: string) {
    let results: any[] = [];
    try {
      const { data, error } = await supabase
        .from("doctor_reviews")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("created_at", { ascending: false });
      
      if (!error && data) results = data;
    } catch (e) {}
    
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
    try {
      const { data, error } = await supabase
        .from("doctor_reviews")
        .insert([review])
        .select()
        .single();
      
      if (!error && data) return data;
    } catch (e) {}
    
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
  },

  /**
   * Update an existing doctor review
   */
  async updateDoctorReview(reviewId: string, rating: number, comment: string) {
    try {
      const { data, error } = await supabase
        .from("doctor_reviews")
        .update({ rating, comment })
        .eq("id", reviewId)
        .select()
        .single();
      
      if (!error && data) return data;
    } catch (e) {}
    
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
  },

  /**
   * Delete a doctor review
   */
  async deleteDoctorReview(reviewId: string) {
    try {
      const { error } = await supabase
        .from("doctor_reviews")
        .delete()
        .eq("id", reviewId);
        
      if (!error) return true;
    } catch (e) {}
      
    try {
      const localReviews = JSON.parse(localStorage.getItem('mock_doctor_reviews') || '[]');
      const filtered = localReviews.filter((r: any) => r.id !== reviewId);
      localStorage.setItem('mock_doctor_reviews', JSON.stringify(filtered));
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Check if patient has a previous booking with a doctor
   */
  async hasPreviousBooking(doctorId: string, patientId: string): Promise<boolean> {
    let count = 0;
    try {
      const { count: dbCount, error } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", doctorId)
        .eq("patient_id", patientId)
        .in("status", ["Completed", "Confirmed"]);
      
      if (!error && dbCount !== null) count = dbCount;
    } catch (e) {}
    
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
    
    return count > 0;
  },

  /**
   * Fetch chat history from Supabase
   */
  async getChatHistory(patientId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("patient_id", patientId)
        .order("updatedAt", { ascending: false });
      
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase getChatHistory notice:", e);
    }
    return [];
  },

  /**
   * Save a chat session to Supabase
   */
  async saveChatSession(patientId: string, session: any): Promise<void> {
    try {
      await supabase
        .from("chat_sessions")
        .upsert({
          id: session.id,
          patient_id: patientId,
          title: session.title,
          updatedAt: session.updatedAt,
          messages: session.messages,
          assessment: session.assessment,
          care: session.care,
          dynamicSuggestions: session.dynamicSuggestions
        });
    } catch (e) {
      console.warn("Supabase saveChatSession notice:", e);
    }
  },

  /**
   * Save the last image analysis result to Supabase
   */
  async saveLastImageAnalysis(patientId: string, result: any): Promise<void> {
    try {
      await supabase
        .from("health_analyses")
        .upsert({
          patient_id: patientId,
          type: "image",
          result: result,
          updated_at: new Date().toISOString(),
        }, { onConflict: "patient_id,type" });
    } catch (e) {
      console.warn("Supabase saveLastImageAnalysis notice:", e);
    }
  },

  /**
   * Get the last image analysis result from Supabase
   */
  async getLastImageAnalysis(patientId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from("health_analyses")
        .select("result")
        .eq("patient_id", patientId)
        .eq("type", "image")
        .single();
      if (!error && data) return data.result;
    } catch (e) {}
    return null;
  },

  /**
   * Save the last report analysis result to Supabase
   */
  async saveLastReportAnalysis(patientId: string, result: any): Promise<void> {
    try {
      await supabase
        .from("health_analyses")
        .upsert({
          patient_id: patientId,
          type: "report",
          result: result,
          updated_at: new Date().toISOString(),
        }, { onConflict: "patient_id,type" });
    } catch (e) {
      console.warn("Supabase saveLastReportAnalysis notice:", e);
    }
  },

  /**
   * Get the last report analysis result from Supabase
   */
  async getLastReportAnalysis(patientId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from("health_analyses")
        .select("result")
        .eq("patient_id", patientId)
        .eq("type", "report")
        .single();
      if (!error && data) return data.result;
    } catch (e) {}
    return null;
  },

  /**
   * Save eLAB sent reports to Supabase
   */
  async saveSentReports(patientId: string, reports: any[]): Promise<void> {
    try {
      await supabase
        .from("sent_reports")
        .upsert({
          patient_id: patientId,
          reports: reports,
          updated_at: new Date().toISOString(),
        }, { onConflict: "patient_id" });
    } catch (e) {
      console.warn("Supabase saveSentReports notice:", e);
    }

    try {
      localStorage.setItem("meddoc_sent_reports", JSON.stringify(reports));
    } catch (e) {}
  },

  /**
   * Get eLAB sent reports from Supabase
   */
  async getSentReports(patientId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("sent_reports")
        .select("reports")
        .eq("patient_id", patientId)
        .single();
      if (!error && data && data.reports) return data.reports;
    } catch (e) {}
    
    // Fallback to local storage if Supabase fails or is empty
    try {
      const localSent = localStorage.getItem("meddoc_sent_reports");
      if (localSent) {
        const parsed = JSON.parse(localSent);
        if (parsed && parsed.length > 0) {
          // Force migrate to Supabase
          if (patientId) {
             void patientService.saveSentReports(patientId, parsed);
          }
          return parsed;
        }
      }
    } catch (e) {}
    
    return [];
  }
};
