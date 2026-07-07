"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAllProcedures,
  fetchDoctorById,
  fetchDoctors,
  fetchProceduresForDoctor,
} from "@/features/doctors/api/get-doctors";

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });
}

export function useDoctor(id: string | null) {
  return useQuery({
    queryKey: ["doctors", id],
    queryFn: () => fetchDoctorById(id!),
    enabled: !!id,
  });
}

export function useDoctorProcedures(doctorId: string | null) {
  return useQuery({
    queryKey: ["doctor-procedures", doctorId],
    queryFn: () => fetchProceduresForDoctor(doctorId!),
    enabled: !!doctorId,
  });
}

export function useProcedures() {
  return useQuery({
    queryKey: ["procedures"],
    queryFn: fetchAllProcedures,
  });
}
