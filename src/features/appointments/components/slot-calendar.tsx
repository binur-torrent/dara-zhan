"use client";

import { useMemo, useState } from "react";
import { addDays, addWeeks, format, isSameDay, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkingHours, useScheduleOverrides } from "@/features/schedule/hooks/use-schedule";
import { useBookedSlots } from "@/features/appointments/hooks/use-appointments";
import { useDoctor } from "@/features/doctors/hooks/use-doctors";
import {
  formatSlotDate,
  formatSlotTime,
  generateSlotsForDay,
  getEffectiveDayWindow,
} from "@/lib/time-slots";
import { cn } from "@/lib/utils";

interface SlotCalendarProps {
  doctorId: string | null;
  durationMinutes: number;
  value: string;
  onChange: (iso: string) => void;
}

export function SlotCalendar({
  doctorId,
  durationMinutes,
  value,
  onChange,
}: SlotCalendarProps) {
  const currentWeekStart = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    [],
  );
  const [weekStart, setWeekStart] = useState(currentWeekStart);

  const { data: doctor } = useDoctor(doctorId);
  const { data: workingHours = [], isLoading: hoursLoading } =
    useWorkingHours(doctorId);
  const { data: overrides = [], isLoading: overridesLoading } =
    useScheduleOverrides(doctorId, formatSlotDate(new Date()));
  const { data: bookedSlots = [], isLoading: bookedLoading } =
    useBookedSlots(doctorId);

  const slotIntervalMinutes = doctor?.slot_interval_minutes ?? durationMinutes;
  const isLoading = hoursLoading || overridesLoading || bookedLoading;

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const window = getEffectiveDayWindow(date, workingHours, overrides);
      const slots = window
        ? generateSlotsForDay(
            date,
            durationMinutes,
            slotIntervalMinutes,
            workingHours,
            overrides,
            bookedSlots,
          )
        : [];
      return { date, window, slots };
    });
  }, [
    weekStart,
    workingHours,
    overrides,
    bookedSlots,
    durationMinutes,
    slotIntervalMinutes,
  ]);

  const canGoPrev = weekStart > currentWeekStart;

  if (!doctorId) return null;

  if (isLoading) {
    return <Skeleton className="h-72 w-full rounded-xl" />;
  }

  return (
    <div className="rounded-xl border border-slate-200/80 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="cursor-pointer"
          disabled={!canGoPrev}
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

      <div className="grid grid-flow-col auto-cols-[minmax(96px,1fr)] gap-2 overflow-x-auto pb-1 sm:grid-flow-row sm:grid-cols-7 sm:overflow-visible">
        {days.map(({ date, window, slots }) => {
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
              <div className="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-0.5">
                {slots.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    {window ? "Занято" : "Выходной"}
                  </p>
                ) : (
                  slots.map((slot) => {
                    const iso = slot.toISOString();
                    const selected = value === iso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => onChange(iso)}
                        className={cn(
                          "cursor-pointer rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-slate-200 bg-white text-slate-700 hover:border-primary/50 hover:bg-primary/5",
                        )}
                      >
                        {formatSlotTime(slot)}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
