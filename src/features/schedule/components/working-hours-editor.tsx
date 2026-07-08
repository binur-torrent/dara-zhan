"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSaveWorkingHours,
  useWorkingHours,
} from "@/features/schedule/hooks/use-schedule";
import {
  useDoctor,
  useUpdateDoctorSlotInterval,
} from "@/features/doctors/hooks/use-doctors";
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

const INTERVAL_OPTIONS = [10, 15, 20, 30, 45, 60];

interface DayState {
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakEnabled: boolean;
  breakStartTime: string;
  breakEndTime: string;
}

const DEFAULT_DAY_STATE: DayState = {
  enabled: false,
  startTime: "09:00",
  endTime: "17:00",
  breakEnabled: false,
  breakStartTime: "13:00",
  breakEndTime: "14:00",
};

interface WorkingHoursEditorProps {
  doctorId: string;
}

export function WorkingHoursEditor({ doctorId }: WorkingHoursEditorProps) {
  const { data: workingHours, isLoading: hoursLoading } =
    useWorkingHours(doctorId);
  const { data: doctor, isLoading: doctorLoading } = useDoctor(doctorId);

  if (hoursLoading || !workingHours || doctorLoading || !doctor) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  return (
    <WorkingHoursForm
      key={doctorId}
      doctorId={doctorId}
      initialWorkingHours={workingHours}
      initialInterval={doctor.slot_interval_minutes}
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
      if (!existing) return [day.value, { ...DEFAULT_DAY_STATE }];
      return [
        day.value,
        {
          enabled: true,
          startTime: existing.start_time.slice(0, 5),
          endTime: existing.end_time.slice(0, 5),
          breakEnabled: !!(existing.break_start_time && existing.break_end_time),
          breakStartTime:
            existing.break_start_time?.slice(0, 5) ??
            DEFAULT_DAY_STATE.breakStartTime,
          breakEndTime:
            existing.break_end_time?.slice(0, 5) ??
            DEFAULT_DAY_STATE.breakEndTime,
        },
      ];
    }),
  );
}

interface WorkingHoursFormProps {
  doctorId: string;
  initialWorkingHours: DoctorWorkingHours[];
  initialInterval: number;
}

function WorkingHoursForm({
  doctorId,
  initialWorkingHours,
  initialInterval,
}: WorkingHoursFormProps) {
  const saveMutation = useSaveWorkingHours(doctorId);
  const intervalMutation = useUpdateDoctorSlotInterval(doctorId);
  const [slotInterval, setSlotInterval] = useState(String(initialInterval));
  const [days, setDays] = useState<Record<number, DayState>>(() =>
    buildInitialDays(initialWorkingHours),
  );

  const updateDay = (dayValue: number, patch: Partial<DayState>) => {
    setDays((prev) => ({ ...prev, [dayValue]: { ...prev[dayValue], ...patch } }));
  };

  const handleSave = async () => {
    const entries = DAYS.filter((d) => days[d.value]?.enabled).map((d) => {
      const state = days[d.value];
      return {
        dayOfWeek: d.value,
        startTime: state.startTime,
        endTime: state.endTime,
        breakStartTime: state.breakEnabled ? state.breakStartTime : null,
        breakEndTime: state.breakEnabled ? state.breakEndTime : null,
      };
    });
    await intervalMutation.mutateAsync(Number(slotInterval));
    await saveMutation.mutateAsync(entries);
  };

  const isPending = saveMutation.isPending || intervalMutation.isPending;
  const isError = saveMutation.isError || intervalMutation.isError;
  const isSuccess = saveMutation.isSuccess && intervalMutation.isSuccess;

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
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label htmlFor="slot-interval">Интервал между приёмами</Label>
            <p className="text-xs text-muted-foreground">
              Как часто начинаются свободные слоты записи.
            </p>
          </div>
          <Select
            value={slotInterval}
            onValueChange={(v) => v && setSlotInterval(v)}
          >
            <SelectTrigger id="slot-interval" className="w-40 cursor-pointer">
              <SelectValue>{() => `${slotInterval} мин`}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {INTERVAL_OPTIONS.map((option) => (
                <SelectItem
                  key={option}
                  value={String(option)}
                  className="cursor-pointer"
                >
                  {option} мин
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {DAYS.map((day) => {
          const state = days[day.value] ?? DEFAULT_DAY_STATE;
          return (
            <div
              key={day.value}
              className={cn(
                "flex flex-col gap-3 rounded-xl border px-4 py-3",
                state.enabled ? "border-primary/30 bg-primary/5" : "border-slate-200",
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

              {state.enabled && (
                <div className="flex flex-col gap-3 border-t border-primary/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={state.breakEnabled}
                      onChange={(e) =>
                        updateDay(day.value, { breakEnabled: e.target.checked })
                      }
                      className="h-4 w-4 cursor-pointer accent-primary"
                    />
                    <span className="text-sm text-slate-700">Обеденный перерыв</span>
                  </label>
                  {state.breakEnabled && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={state.breakStartTime}
                        onChange={(e) =>
                          updateDay(day.value, {
                            breakStartTime: e.target.value,
                          })
                        }
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">—</span>
                      <Input
                        type="time"
                        value={state.breakEndTime}
                        onChange={(e) =>
                          updateDay(day.value, { breakEndTime: e.target.value })
                        }
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isError && (
          <Alert variant="destructive">
            <AlertDescription>
              Не удалось сохранить расписание. Проверьте, что перерыв находится
              внутри рабочих часов, и попробуйте ещё раз.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            className="cursor-pointer"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? (
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
          {isSuccess && (
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
