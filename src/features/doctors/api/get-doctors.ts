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
