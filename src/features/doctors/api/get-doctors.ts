import { createClient } from "@/lib/supabase/client";
import type { Doctor, DoctorProcedureOption, Procedure } from "@/types";

export async function fetchDoctors(): Promise<Doctor[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function fetchDoctorById(id: string): Promise<Doctor | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function fetchProceduresForDoctor(
  doctorId: string,
): Promise<DoctorProcedureOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("doctor_procedures")
    .select("price_kzt, duration_minutes, procedures(id, name, description)")
    .eq("doctor_id", doctorId);

  if (error) throw error;

  return (
    (data as unknown as {
      price_kzt: number;
      duration_minutes: number;
      procedures: Pick<Procedure, "id" | "name" | "description"> | null;
    }[])
      ?.filter((row) => row.procedures)
      .map((row) => ({
        id: row.procedures!.id,
        name: row.procedures!.name,
        description: row.procedures!.description,
        price_kzt: row.price_kzt,
        duration_minutes: row.duration_minutes,
      })) ?? []
  );
}

export async function fetchAllProcedures(): Promise<Procedure[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("procedures")
    .select("*")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export interface DoctorProfileInput {
  name: string;
  specialty: string;
  bio: string | null;
}

/** Updates the editable public-profile fields of a doctor's own record. */
export async function updateDoctorProfile(
  doctorId: string,
  input: DoctorProfileInput,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("doctors")
    .update({
      name: input.name,
      specialty: input.specialty,
      bio: input.bio,
    })
    .eq("id", doctorId);

  if (error) throw error;
}

/** Updates how far apart bookable slot start times are for a doctor. */
export async function updateDoctorSlotInterval(
  doctorId: string,
  slotIntervalMinutes: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("doctors")
    .update({ slot_interval_minutes: slotIntervalMinutes })
    .eq("id", doctorId);

  if (error) throw error;
}

const AVATAR_BUCKET = "doctor-avatars";

/** Uploads an avatar to Storage under `{doctorId}/`, saves its public URL on
 * the doctor row, and returns that URL. */
export async function uploadDoctorAvatar(
  doctorId: string,
  file: File,
): Promise<string> {
  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${doctorId}/avatar-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("doctors")
    .update({ avatar_url: publicUrl })
    .eq("id", doctorId);
  if (updateError) throw updateError;

  return publicUrl;
}
