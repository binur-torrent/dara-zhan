"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useUpdateAppointment } from "@/features/appointments/hooks/use-appointments";
import type { AppointmentWithRelations } from "@/types";

/** Shared confirm / reject / edit-time / WhatsApp-message behavior used by
 * both the nurse appointment table and the weekly calendar, so the two views
 * stay in sync without duplicating dialog state. */
export function useAppointmentActions() {
  const updateMutation = useUpdateAppointment();
  const [editing, setEditing] = useState<AppointmentWithRelations | null>(null);
  const [newTime, setNewTime] = useState("");
  const [notes, setNotes] = useState("");
  const [messageSent, setMessageSent] = useState<string | null>(null);

  const openEdit = (appointment: AppointmentWithRelations) => {
    setEditing(appointment);
    setNewTime(format(new Date(appointment.scheduled_at), "yyyy-MM-dd'T'HH:mm"));
    setNotes(appointment.notes ?? "");
  };

  const closeEdit = () => setEditing(null);

  /** Confirms a pending appointment (or saves an updated time/notes on an
   * already-confirmed one) — both mean "write confirmed + time + notes". */
  const confirm = async () => {
    if (!editing) return;
    await updateMutation.mutateAsync({
      id: editing.id,
      status: "confirmed",
      scheduledAt: new Date(newTime).toISOString(),
      notes,
    });
    setEditing(null);
  };

  const reject = async (id: string) => {
    await updateMutation.mutateAsync({ id, status: "rejected" });
    setEditing((current) => (current?.id === id ? null : current));
  };

  const sendMessage = (appointment: AppointmentWithRelations) => {
    const phone = appointment.patient_phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Здравствуйте, ${appointment.patient_name}! Ваш приём ${format(
        new Date(appointment.scheduled_at),
        "PPp",
        { locale: ru },
      )} к врачу ${appointment.doctors?.name} подтверждён.`,
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    setMessageSent(appointment.id);
  };

  return {
    updateMutation,
    editing,
    newTime,
    setNewTime,
    notes,
    setNotes,
    messageSent,
    openEdit,
    closeEdit,
    confirm,
    reject,
    sendMessage,
  };
}

export type AppointmentActions = ReturnType<typeof useAppointmentActions>;
