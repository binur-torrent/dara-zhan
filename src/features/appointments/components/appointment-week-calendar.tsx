"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  startOfWeek,
} from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatSlotDate } from "@/lib/time-slots";
import { cn } from "@/lib/utils";
import type { AppointmentStatus, AppointmentWithRelations } from "@/types";

const STATUS_CHIP: Record<AppointmentStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100",
  confirmed:
    "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
  rejected: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
};

interface AppointmentWeekCalendarProps {
  appointments: AppointmentWithRelations[];
  isLoading?: boolean;
  onSelect: (appointment: AppointmentWithRelations) => void;
  /** Notifies the parent of the visible week range (yyyy-MM-dd, inclusive) so
   * it can fetch appointments for that range. */
  onRangeChange?: (dateFrom: string, dateTo: string) => void;
}

export function AppointmentWeekCalendar({
  appointments,
  isLoading = false,
  onSelect,
  onRangeChange,
}: AppointmentWeekCalendarProps) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  useEffect(() => {
    onRangeChange?.(
      formatSlotDate(weekStart),
      formatSlotDate(addDays(weekStart, 6)),
    );
  }, [weekStart, onRangeChange]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dayKey = formatSlotDate(date);
      const items = appointments
        .filter((apt) => formatSlotDate(new Date(apt.scheduled_at)) === dayKey)
        .sort(
          (a, b) =>
            new Date(a.scheduled_at).getTime() -
            new Date(b.scheduled_at).getTime(),
        );
      return { date, items };
    });
  }, [weekStart, appointments]);

  return (
    <div className="rounded-xl border border-slate-200/80 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="cursor-pointer"
          onClick={() => setWeekStart((w) => addWeeks(w, -1))}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          <span className="sr-only">Предыдущая неделя</span>
        </Button>
        <p className="text-sm font-medium text-slate-900">
          {format(weekStart, "d MMM", { locale: ru })} –{" "}
          {format(addDays(weekStart, 6), "d MMM yyyy", { locale: ru })}
        </p>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="cursor-pointer"
          onClick={() => setWeekStart((w) => addWeeks(w, 1))}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
          <span className="sr-only">Следующая неделя</span>
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-72 w-full rounded-xl" />
      ) : (
        <div className="grid grid-flow-col auto-cols-[minmax(150px,1fr)] gap-2 overflow-x-auto pb-1 sm:grid-flow-row sm:grid-cols-7 sm:overflow-visible">
          {days.map(({ date, items }) => {
            const today = isSameDay(date, new Date());
            return (
              <div key={date.toISOString()} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "rounded-lg border px-2 py-1.5 text-center",
                    today
                      ? "border-primary/40 bg-primary/5"
                      : "border-slate-200",
                  )}
                >
                  <p className="text-[11px] uppercase text-muted-foreground">
                    {format(date, "EEE", { locale: ru })}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {format(date, "d MMM", { locale: ru })}
                  </p>
                </div>
                <div className="flex min-h-24 flex-col gap-1.5">
                  {items.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                      —
                    </p>
                  ) : (
                    items.map((apt) => (
                      <button
                        key={apt.id}
                        type="button"
                        onClick={() => onSelect(apt)}
                        className={cn(
                          "cursor-pointer rounded-lg border px-2 py-1.5 text-left text-xs transition-colors",
                          STATUS_CHIP[apt.status],
                        )}
                      >
                        <span className="block font-semibold">
                          {format(new Date(apt.scheduled_at), "HH:mm")}
                        </span>
                        <span className="block truncate font-medium">
                          {apt.patient_name}
                        </span>
                        <span className="block truncate opacity-80">
                          {apt.procedures?.name ?? "—"}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
