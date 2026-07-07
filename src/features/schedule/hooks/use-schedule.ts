"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteScheduleOverride,
  fetchScheduleOverrides,
  fetchWorkingHours,
  saveScheduleOverride,
  saveWorkingHours,
  type ScheduleOverrideInput,
  type WorkingHoursInput,
} from "@/features/schedule/api/schedule";

export function useWorkingHours(doctorId: string | null) {
  return useQuery({
    queryKey: ["working-hours", doctorId],
    queryFn: () => fetchWorkingHours(doctorId!),
    enabled: !!doctorId,
  });
}

export function useSaveWorkingHours(doctorId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entries: WorkingHoursInput[]) =>
      saveWorkingHours(doctorId!, entries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["working-hours", doctorId] });
    },
  });
}

export function useScheduleOverrides(doctorId: string | null, fromDate?: string) {
  return useQuery({
    queryKey: ["schedule-overrides", doctorId, fromDate],
    queryFn: () => fetchScheduleOverrides(doctorId!, fromDate),
    enabled: !!doctorId,
  });
}

export function useSaveScheduleOverride(doctorId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ScheduleOverrideInput) =>
      saveScheduleOverride(doctorId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-overrides", doctorId] });
    },
  });
}

export function useDeleteScheduleOverride(doctorId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteScheduleOverride(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-overrides", doctorId] });
    },
  });
}
