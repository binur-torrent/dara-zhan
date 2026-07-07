"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSaveWorkingHours,
  useWorkingHours,
} from "@/features/schedule/hooks/use-schedule";
import type { DoctorWorkingHours } from "@/types";
import { cn } from "@/lib/utils";

const DAYS: { value: number; label: string }[] = [
  { value: 1, label: "Понедельник" },
  { value: 2, label: "Вторник" },
  { value: 3, label: "Среда" },
  { value: 4, label: "Четверг" },
  { value: 5, label: "Пятница" },
  { value: 6, label: "Суббота" },
  { value: 0, label: "Воскресенье" },
];

interface DayState {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const DEFAULT_DAY_STATE: DayState = {
  enabled: false,
  startTime: "09:00",
  endTime: "17:00",
};

interface WorkingHoursEditorProps {
  doctorId: string;
}

export function WorkingHoursEditor({ doctorId }: WorkingHoursEditorProps) {
  const { data: workingHours, isLoading } = useWorkingHours(doctorId);

  if (isLoading || !workingHours) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  return (
    <WorkingHoursForm
      key={doctorId}
      doctorId={doctorId}
      initialWorkingHours={workingHours}
    />
  );
}

function buildInitialDays(
  initialWorkingHours: DoctorWorkingHours[],
): Record<number, DayState> {
  return Object.fromEntries(
    DAYS.map((day) => {
      const existing = initialWorkingHours.find(
        (w) => w.day_of_week === day.value,
      );
      return [
        day.value,
        existing
          ? {
              enabled: true,
              startTime: existing.start_time.slice(0, 5),
              endTime: existing.end_time.slice(0, 5),
            }
          : { ...DEFAULT_DAY_STATE },
      ];
    }),
  );
}

interface WorkingHoursFormProps {
  doctorId: string;
  initialWorkingHours: DoctorWorkingHours[];
}

function WorkingHoursForm({ doctorId, initialWorkingHours }: WorkingHoursFormProps) {
  const saveMutation = useSaveWorkingHours(doctorId);
  const [days, setDays] = useState<Record<number, DayState>>(() =>
    buildInitialDays(initialWorkingHours),
  );

  const updateDay = (dayValue: number, patch: Partial<DayState>) => {
    setDays((prev) => ({ ...prev, [dayValue]: { ...prev[dayValue], ...patch } }));
  };

  const handleSave = async () => {
    const entries = DAYS.filter((d) => days[d.value]?.enabled).map((d) => ({
      dayOfWeek: d.value,
      startTime: days[d.value].startTime,
      endTime: days[d.value].endTime,
    }));
    await saveMutation.mutateAsync(entries);
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">
          Часы работы по дням недели
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Включите дни, когда вы принимаете пациентов, и укажите часы работы.
          Пациенты смогут выбрать время записи только в эти часы.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {DAYS.map((day) => {
          const state = days[day.value] ?? DEFAULT_DAY_STATE;
          return (
            <div
              key={day.value}
              className={cn(
                "flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                state.enabled ? "border-primary/30 bg-primary/5" : "border-slate-200",
              )}
            >
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={state.enabled}
                  onChange={(e) =>
                    updateDay(day.value, { enabled: e.target.checked })
                  }
                  className="h-4 w-4 cursor-pointer accent-primary"
                />
                <span className="text-sm font-medium text-slate-900">
                  {day.label}
                </span>
              </label>
              {state.enabled ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={state.startTime}
                    onChange={(e) =>
                      updateDay(day.value, { startTime: e.target.value })
                    }
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">—</span>
                  <Input
                    type="time"
                    value={state.endTime}
                    onChange={(e) =>
                      updateDay(day.value, { endTime: e.target.value })
                    }
                    className="w-32"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Выходной</span>
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            className="cursor-pointer"
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Сохранение…
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" aria-hidden />
                Сохранить расписание
              </>
            )}
          </Button>
          {saveMutation.isSuccess && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Сохранено
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
