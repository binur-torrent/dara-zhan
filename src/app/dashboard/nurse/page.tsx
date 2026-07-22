"use client";

import { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { AppointmentFilters } from "@/features/dashboard/components/appointment-filters";
import { NurseAppointmentTable } from "@/features/appointments/components/nurse-appointment-table";
import { NurseWeekView } from "@/features/appointments/components/nurse-week-view";
import { NurseBookAppointmentDialog } from "@/features/appointments/components/nurse-book-appointment-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppointmentStatus } from "@/types";

export default function NurseDashboardPage() {
  const [status, setStatus] = useState("pending");
  const [doctorId, setDoctorId] = useState("all");
  const [date, setDate] = useState("");
  const [view, setView] = useState("list");

  const doctorFilter = doctorId === "all" ? undefined : doctorId;
  const statusFilter = status as AppointmentStatus | "all";

  return (
    <DashboardShell
      title="Заявки на приём"
      description="Просматривайте, подтверждайте или отклоняйте заявки."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="list" className="cursor-pointer">
              Список
            </TabsTrigger>
            <TabsTrigger value="week" className="cursor-pointer">
              Неделя
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <NurseBookAppointmentDialog />
      </div>

      <AppointmentFilters
        status={status}
        doctorId={doctorId}
        date={date}
        onStatusChange={setStatus}
        onDoctorChange={setDoctorId}
        onDateChange={setDate}
        showDate={view === "list"}
      />

      {view === "list" ? (
        <NurseAppointmentTable
          filters={{
            status: statusFilter,
            doctorId: doctorFilter,
            date: date || undefined,
          }}
        />
      ) : (
        <NurseWeekView status={statusFilter} doctorId={doctorFilter} />
      )}
    </DashboardShell>
  );
}
