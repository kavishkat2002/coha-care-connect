import { supabase } from "@/lib/supabase";
import { type Appointment, type ReportItem, type TimelineItem } from "@/data/mock";

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
  async getAppointments(): Promise<Appointment[]> {
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
    
    if (error) {
      console.error("Error fetching patient profile:", error);
      return null;
    }
    
    return data;
  }
};
