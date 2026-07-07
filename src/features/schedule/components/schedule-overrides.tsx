"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarOff, CalendarPlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteScheduleOverride,
  useSaveScheduleOverride,
  useScheduleOverrides,
} from "@/features/schedule/hooks/use-schedule";
import { formatSlotDate } from "@/lib/time-slots";

interface ScheduleOverridesProps {
  doctorId: string;
}

export function ScheduleOverrides({ doctorId }: ScheduleOverridesProps) {
  const today = formatSlotDate(new Date());
  const { data: overrides = [], isLoading } = useScheduleOverrides(
    doctorId,
    today,
  );
  const saveMutation = useSaveScheduleOverride(doctorId);
  const deleteMutation = useDeleteScheduleOverride(doctorId);

  const [date, setDate] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const handleAdd = async () => {
    if (!date) return;
    await saveMutation.mutateAsync({
      date,
      isAvailable,
      startTime: isAvailable ? startTime : null,
      endTime: isAvailable ? endTime : null,
    });
    setDate("");
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">
          Исключения на конкретные даты
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Закройте день, в который вы обычно работаете (отпуск, больничный),
          или откройте дополнительный приём в свой обычный выходной.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 rounded-xl border border-dashed border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="override-date">Дата</Label>
            <Input
              id="override-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="override-status">Статус дня</Label>
            <div className="flex h-8 items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="override-status"
                  checked={!isAvailable}
                  onChange={() => setIsAvailable(false)}
                  className="cursor-pointer accent-primary"
                />
                Выходной
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="override-status"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(true)}
                  className="cursor-pointer accent-primary"
                />
                Приём
              </label>
            </div>
          </div>
          {isAvailable && (
            <>
              <div className="space-y-2">
                <Label htmlFor="override-start">С</Label>
                <Input
                  id="override-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="override-end">До</Label>
                <Input
                  id="override-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="flex items-end sm:col-span-2 lg:col-span-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={handleAdd}
              disabled={!date || saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <CalendarPlus className="mr-2 h-4 w-4" aria-hidden />
              )}
              Добавить исключение
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-24 w-full rounded-xl" />
        ) : overrides.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm text-muted-foreground">
            Исключений пока нет.
          </p>
        ) : (
          <ul className="space-y-2">
            {overrides.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between rounded-xl border border-slate-200/80 px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  {o.is_available ? (
                    <CalendarPlus className="h-4 w-4 text-emerald-600" aria-hidden />
                  ) : (
                    <CalendarOff className="h-4 w-4 text-red-500" aria-hidden />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {format(new Date(`${o.date}T00:00:00`), "d MMMM yyyy", {
                        locale: ru,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {o.is_available
                        ? o.start_time && o.end_time
                          ? `Приём ${o.start_time.slice(0, 5)}–${o.end_time.slice(0, 5)}`
                          : "Приём весь день"
                        : "Выходной"}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer text-muted-foreground hover:text-destructive"
                  onClick={() => deleteMutation.mutate(o.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  <span className="sr-only">Удалить</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
