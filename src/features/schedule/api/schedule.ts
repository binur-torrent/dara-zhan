import { createClient } from "@/lib/supabase/client";
import type { DoctorScheduleOverride, DoctorWorkingHours } from "@/types";

export async function fetchWorkingHours(
  doctorId: string,
): Promise<DoctorWorkingHours[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("doctor_working_hours")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("day_of_week", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export interface WorkingHoursInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
}

/** Replaces the doctor's entire weekly template with the given entries. */
export async function saveWorkingHours(
  doctorId: string,
  entries: WorkingHoursInput[],
): Promise<void> {
  const supabase = createClient();

  const { error: deleteError } = await supabase
    .from("doctor_working_hours")
    .delete()
    .eq("doctor_id", doctorId);
  if (deleteError) throw deleteError;

  if (entries.length === 0) return;

  const { error: insertError } = await supabase
    .from("doctor_working_hours")
    .insert(
      entries.map((entry) => ({
        doctor_id: doctorId,
        day_of_week: entry.dayOfWeek,
        start_time: entry.startTime,
        end_time: entry.endTime,
        break_start_time: entry.breakStartTime ?? null,
        break_end_time: entry.breakEndTime ?? null,
      })),
    );
  if (insertError) throw insertError;
}

export async function fetchScheduleOverrides(
  doctorId: string,
  fromDate?: string,
): Promise<DoctorScheduleOverride[]> {
  const supabase = createClient();
  let query = supabase
    .from("doctor_schedule_overrides")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("date", { ascending: true });

  if (fromDate) {
    query = query.gte("date", fromDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export interface ScheduleOverrideInput {
  date: string;
  isAvailable: boolean;
  startTime?: string | null;
  endTime?: string | null;
}

export async function saveScheduleOverride(
  doctorId: string,
  input: ScheduleOverrideInput,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("doctor_schedule_overrides").upsert(
    {
      doctor_id: doctorId,
      date: input.date,
      is_available: input.isAvailable,
      start_time: input.isAvailable ? (input.startTime ?? null) : null,
      end_time: input.isAvailable ? (input.endTime ?? null) : null,
    },
    { onConflict: "doctor_id,date" },
  );
  if (error) throw error;
}

export async function deleteScheduleOverride(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("doctor_schedule_overrides")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
