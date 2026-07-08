"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Check, MessageSquare, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/appointments/components/status-badge";
import { AppointmentActionsDialog } from "@/features/appointments/components/appointment-actions-dialog";
import { useAppointmentActions } from "@/features/appointments/hooks/use-appointment-actions";
import { useNurseAppointments } from "@/features/appointments/hooks/use-appointments";
import type { NurseAppointmentFilters } from "@/features/appointments/api/appointments";
import { formatPriceKzt } from "@/lib/utils";

interface NurseAppointmentTableProps {
  filters: NurseAppointmentFilters;
}

export function NurseAppointmentTable({ filters }: NurseAppointmentTableProps) {
  const { data: appointments = [], isLoading } =
    useNurseAppointments(filters);

  const actions = useAppointmentActions();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
        <p className="text-sm text-muted-foreground">Заявки не найдены.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead>Пациент</TableHead>
              <TableHead>Врач</TableHead>
              <TableHead>Процедура</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Дата и время</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-900">
                      {apt.patient_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {apt.patient_phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{apt.doctors?.name ?? "—"}</TableCell>
                <TableCell>
                  <div>
                    <p>{apt.procedures?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {apt.duration_minutes} мин
                    </p>
                  </div>
                </TableCell>
                <TableCell>{formatPriceKzt(apt.price_kzt)}</TableCell>
                <TableCell>
                  {format(new Date(apt.scheduled_at), "PPp", { locale: ru })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={apt.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {apt.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-emerald-700 hover:bg-emerald-50"
                          onClick={() => actions.openEdit(apt)}
                        >
                          <Check className="h-4 w-4" aria-hidden />
                          <span className="sr-only">Подтвердить</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-red-600 hover:bg-red-50"
                          onClick={() => actions.reject(apt.id)}
                          disabled={actions.updateMutation.isPending}
                        >
                          <X className="h-4 w-4" aria-hidden />
                          <span className="sr-only">Отклонить</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer"
                          onClick={() => actions.openEdit(apt)}
                          title="Изменить время"
                        >
                          <Clock className="h-4 w-4" aria-hidden />
                        </Button>
                      </>
                    )}
                    {apt.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => actions.sendMessage(apt)}
                        title="Отправить сообщение с подтверждением"
                      >
                        <MessageSquare className="h-4 w-4" aria-hidden />
                        {actions.messageSent === apt.id ? " Отправлено" : ""}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AppointmentActionsDialog actions={actions} />
    </>
  );
}
