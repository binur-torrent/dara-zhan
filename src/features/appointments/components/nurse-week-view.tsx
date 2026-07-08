"use client";

import { useCallback, useState } from "react";
import { AppointmentWeekCalendar } from "@/features/appointments/components/appointment-week-calendar";
import { AppointmentActionsDialog } from "@/features/appointments/components/appointment-actions-dialog";
import { useAppointmentActions } from "@/features/appointments/hooks/use-appointment-actions";
import { useNurseAppointments } from "@/features/appointments/hooks/use-appointments";
import type { AppointmentStatus } from "@/types";

interface NurseWeekViewProps {
  status: AppointmentStatus | "all";
  doctorId?: string;
}

export function NurseWeekView({ status, doctorId }: NurseWeekViewProps) {
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);
  const actions = useAppointmentActions();

  const { data: appointments = [], isLoading } = useNurseAppointments({
    status,
    doctorId,
    dateFrom: range?.from,
    dateTo: range?.to,
  });

  const handleRangeChange = useCallback((from: string, to: string) => {
    setRange((prev) =>
      prev?.from === from && prev?.to === to ? prev : { from, to },
    );
  }, []);

  return (
    <>
      <AppointmentWeekCalendar
        appointments={appointments}
        isLoading={isLoading || !range}
        onSelect={actions.openEdit}
        onRangeChange={handleRangeChange}
      />
      <AppointmentActionsDialog actions={actions} />
    </>
  );
}
