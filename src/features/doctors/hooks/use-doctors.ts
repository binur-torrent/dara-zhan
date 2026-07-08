"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllProcedures,
  fetchDoctorById,
  fetchDoctors,
  fetchProceduresForDoctor,
  updateDoctorProfile,
  updateDoctorSlotInterval,
  uploadDoctorAvatar,
  type DoctorProfileInput,
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

function useInvalidateDoctor(doctorId: string | null) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["doctors"] });
    queryClient.invalidateQueries({ queryKey: ["doctors", doctorId] });
  };
}

export function useUpdateDoctorProfile(doctorId: string) {
  const invalidate = useInvalidateDoctor(doctorId);
  return useMutation({
    mutationFn: (input: DoctorProfileInput) =>
      updateDoctorProfile(doctorId, input),
    onSuccess: invalidate,
  });
}

export function useUploadDoctorAvatar(doctorId: string) {
  const invalidate = useInvalidateDoctor(doctorId);
  return useMutation({
    mutationFn: (file: File) => uploadDoctorAvatar(doctorId, file),
    onSuccess: invalidate,
  });
}

export function useUpdateDoctorSlotInterval(doctorId: string) {
  const invalidate = useInvalidateDoctor(doctorId);
  return useMutation({
    mutationFn: (slotIntervalMinutes: number) =>
      updateDoctorSlotInterval(doctorId, slotIntervalMinutes),
    onSuccess: invalidate,
  });
}
