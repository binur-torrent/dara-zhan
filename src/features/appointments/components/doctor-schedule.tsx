"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useDoctorAppointments } from "@/features/appointments/hooks/use-appointments";
import { AppointmentWeekCalendar } from "@/features/appointments/components/appointment-week-calendar";
import { AppointmentDetailsDialog } from "@/features/appointments/components/appointment-details-dialog";
import type { AppointmentWithRelations } from "@/types";
import { formatPriceKzt } from "@/lib/utils";

export function DoctorSchedule() {
  const { data: appointments = [], isLoading } = useDoctorAppointments();
  const [selected, setSelected] = useState<AppointmentWithRelations | null>(
    null,
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="list">
      <TabsList>
        <TabsTrigger value="list" className="cursor-pointer">
          Список
        </TabsTrigger>
        <TabsTrigger value="week" className="cursor-pointer">
          Неделя
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="mt-4">
        {appointments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {appointments.map((apt) => (
              <Card
                key={apt.id}
                className="border-slate-200/80 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    <User className="h-4 w-4 text-primary" aria-hidden />
                    {apt.patient_name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {apt.procedures?.name} · {formatPriceKzt(apt.price_kzt)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden
                    />
                    {format(new Date(apt.scheduled_at), "EEEE, d MMMM yyyy", {
                      locale: ru,
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden
                    />
                    {format(new Date(apt.scheduled_at), "HH:mm")}
                    <span className="text-muted-foreground">
                      · {apt.duration_minutes} мин
                    </span>
                  </div>
                  {apt.notes && (
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                      {apt.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="week" className="mt-4">
        <AppointmentWeekCalendar
          appointments={appointments}
          onSelect={setSelected}
        />
      </TabsContent>

      <AppointmentDetailsDialog
        appointment={selected}
        onClose={() => setSelected(null)}
      />
    </Tabs>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
      <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300" aria-hidden />
      <p className="text-sm font-medium text-slate-700">
        Нет подтверждённых приёмов
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Ваше расписание появится здесь после подтверждения заявок
        администратором.
      </p>
    </div>
  );
}
