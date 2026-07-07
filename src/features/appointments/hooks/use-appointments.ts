"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAppointment,
  fetchBookedSlots,
  fetchDoctorAppointments,
  fetchNurseAppointments,
  updateAppointmentStatus,
} from "@/features/appointments/api/appointments";
import type { AppointmentStatus } from "@/types";
import type { BookingFormValues } from "@/features/appointments/schemas/booking-schema";

export function useBookedSlots(doctorId: string | null) {
  return useQuery({
    queryKey: ["booked-slots", doctorId],
    queryFn: () => fetchBookedSlots(doctorId!),
    enabled: !!doctorId,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      values: BookingFormValues & { durationMinutes: number; priceKzt: number },
    ) => createAppointment(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booked-slots"] });
    },
  });
}

export function useNurseAppointments(filters?: {
  status?: AppointmentStatus | "all";
  doctorId?: string;
  date?: string;
}) {
  return useQuery({
    queryKey: ["nurse-appointments", filters],
    queryFn: () => fetchNurseAppointments(filters),
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      scheduledAt,
      notes,
    }: {
      id: string;
      status: AppointmentStatus;
      scheduledAt?: string;
      notes?: string;
    }) => updateAppointmentStatus(id, status, scheduledAt, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurse-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
    },
  });
}

export function useDoctorAppointments() {
  return useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: fetchDoctorAppointments,
  });
}
