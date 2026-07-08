export type UserRole = "nurse" | "doctor";

export type AppointmentStatus = "pending" | "confirmed" | "rejected";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  avatar_url: string | null;
  /** Minutes between bookable slot start times (10/15/20/30/45/60). */
  slot_interval_minutes: number;
  created_at: string;
}

export interface Procedure {
  id: string;
  name: string;
  duration_minutes: number;
  description: string | null;
}

export interface DoctorProcedure {
  doctor_id: string;
  procedure_id: string;
  price_kzt: number;
  duration_minutes: number;
}

/** A procedure as offered by a specific doctor — name/description come from
 * the shared catalog, price and duration are set individually per doctor. */
export interface DoctorProcedureOption {
  id: string;
  name: string;
  description: string | null;
  price_kzt: number;
  duration_minutes: number;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  procedure_id: string;
  patient_name: string;
  patient_phone: string;
  scheduled_at: string;
  duration_minutes: number;
  price_kzt: number;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  doctor_id: string | null;
  full_name: string;
  created_at: string;
}

export interface AppointmentWithRelations extends Appointment {
  doctors: Pick<Doctor, "id" | "name" | "specialty"> | null;
  procedures: Pick<Procedure, "id" | "name"> | null;
}

export interface DoctorWithProcedures extends Doctor {
  procedures: Procedure[];
}

/** Weekly recurring template — e.g. "every Monday, 09:00-17:00". */
export interface DoctorWorkingHours {
  id: string;
  doctor_id: string;
  /** 0 = Sunday ... 6 = Saturday (matches JS `Date#getDay()`) */
  day_of_week: number;
  start_time: string;
  end_time: string;
  /** Optional lunch break that splits the day into two bookable windows. */
  break_start_time: string | null;
  break_end_time: string | null;
}

/** A per-date exception that opens, closes, or customizes a specific day,
 * overriding the weekly template for that one date. */
export interface DoctorScheduleOverride {
  id: string;
  doctor_id: string;
  date: string;
  is_available: boolean;
  start_time: string | null;
  end_time: string | null;
}

export interface BookedSlot {
  scheduled_at: string;
  duration_minutes: number;
}
