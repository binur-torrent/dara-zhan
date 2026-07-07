import { createClient } from "@/lib/supabase/client";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
  BookedSlot,
} from "@/types";
import type { BookingFormValues } from "@/features/appointments/schemas/booking-schema";

export async function createAppointment(
  values: BookingFormValues & { durationMinutes: number; priceKzt: number },
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("appointments").insert({
    doctor_id: values.doctorId,
    procedure_id: values.procedureId,
    patient_name: values.patientName,
    patient_phone: values.patientPhone,
    scheduled_at: values.scheduledAt,
    duration_minutes: values.durationMinutes,
    price_kzt: values.priceKzt,
    status: "pending",
  });

  if (error) throw error;
}

export async function fetchBookedSlots(
  doctorId: string,
): Promise<BookedSlot[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_booked_slots", {
    p_doctor_id: doctorId,
  });

  if (error) throw error;
  return (data as BookedSlot[]) ?? [];
}

export async function fetchNurseAppointments(filters?: {
  status?: AppointmentStatus | "all";
  doctorId?: string;
  date?: string;
}): Promise<AppointmentWithRelations[]> {
  const supabase = createClient();
  let query = supabase
    .from("appointments")
    .select(
      `
      *,
      doctors (id, name, specialty),
      procedures (id, name, duration_minutes)
    `,
    )
    .order("scheduled_at", { ascending: true });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters?.doctorId) {
    query = query.eq("doctor_id", filters.doctorId);
  }
  if (filters?.date) {
    const start = `${filters.date}T00:00:00.000Z`;
    const end = `${filters.date}T23:59:59.999Z`;
    query = query.gte("scheduled_at", start).lte("scheduled_at", end);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as AppointmentWithRelations[]) ?? [];
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  scheduledAt?: string,
  notes?: string,
): Promise<void> {
  const supabase = createClient();
  const payload: Record<string, unknown> = { status };
  if (scheduledAt) payload.scheduled_at = scheduledAt;
  if (notes !== undefined) payload.notes = notes;

  const { error } = await supabase
    .from("appointments")
    .update(payload)
    .eq("id", id);

  if (error) throw error;
}

export async function fetchDoctorAppointments(): Promise<
  AppointmentWithRelations[]
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      doctors (id, name, specialty),
      procedures (id, name, duration_minutes)
    `,
    )
    .eq("status", "confirmed")
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  return (data as AppointmentWithRelations[]) ?? [];
}
