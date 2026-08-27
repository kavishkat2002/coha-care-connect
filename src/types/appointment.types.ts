/**
 * Appointment Domain Types
 * Patient-facing appointment view and Supabase DB row types.
 */

/** Patient-facing appointment view (from mock data / timeline). */
export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  mode: "In-person" | "Telemedicine";
  status: "Confirmed" | "Completed" | "Cancelled" | "Pending";
};

/** Supabase database appointment row type. */
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
