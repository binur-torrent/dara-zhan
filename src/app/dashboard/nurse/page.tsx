"use client";

import { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { AppointmentFilters } from "@/features/dashboard/components/appointment-filters";
import { NurseAppointmentTable } from "@/features/appointments/components/nurse-appointment-table";

export default function NurseDashboardPage() {
  const [status, setStatus] = useState("pending");
  const [doctorId, setDoctorId] = useState("all");
  const [date, setDate] = useState("");

  return (
    <DashboardShell
      title="Заявки на приём"
      description="Просматривайте, подтверждайте или отклоняйте заявки."
    >
      <AppointmentFilters
        status={status}
        doctorId={doctorId}
        date={date}
        onStatusChange={setStatus}
        onDoctorChange={(v) => setDoctorId(v === "all" ? "" : v)}
        onDateChange={setDate}
      />
      <NurseAppointmentTable
        statusFilter={status}
        doctorFilter={doctorId === "all" ? "" : doctorId}
        dateFilter={date}
      />
    </DashboardShell>
  );
}
