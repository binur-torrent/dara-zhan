"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Check, MessageSquare, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/appointments/components/status-badge";
import {
  useNurseAppointments,
  useUpdateAppointment,
} from "@/features/appointments/hooks/use-appointments";
import type { AppointmentWithRelations } from "@/types";
import { formatPriceKzt } from "@/lib/utils";

interface NurseAppointmentTableProps {
  statusFilter: string;
  doctorFilter: string;
  dateFilter: string;
}

export function NurseAppointmentTable({
  statusFilter,
  doctorFilter,
  dateFilter,
}: NurseAppointmentTableProps) {
  const { data: appointments = [], isLoading } = useNurseAppointments({
    status: statusFilter as "pending" | "confirmed" | "rejected" | "all",
    doctorId: doctorFilter || undefined,
    date: dateFilter || undefined,
  });

  const updateMutation = useUpdateAppointment();
  const [editing, setEditing] = useState<AppointmentWithRelations | null>(null);
  const [newTime, setNewTime] = useState("");
  const [notes, setNotes] = useState("");
  const [messageSent, setMessageSent] = useState<string | null>(null);

  const openEdit = (appointment: AppointmentWithRelations) => {
    setEditing(appointment);
    const dt = new Date(appointment.scheduled_at);
    setNewTime(format(dt, "yyyy-MM-dd'T'HH:mm"));
    setNotes(appointment.notes ?? "");
  };

  const handleConfirm = async () => {
    if (!editing) return;
    await updateMutation.mutateAsync({
      id: editing.id,
      status: "confirmed",
      scheduledAt: new Date(newTime).toISOString(),
      notes,
    });
    setEditing(null);
  };

  const handleReject = async (id: string) => {
    await updateMutation.mutateAsync({ id, status: "rejected" });
  };

  const handleSendMessage = (appointment: AppointmentWithRelations) => {
    const phone = appointment.patient_phone;
    const message = encodeURIComponent(
      `Здравствуйте, ${appointment.patient_name}! Ваш приём ${format(new Date(appointment.scheduled_at), "PPp", { locale: ru })} к врачу ${appointment.doctors?.name} подтверждён.`,
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
    setMessageSent(appointment.id);
  };

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
                          onClick={() => openEdit(apt)}
                        >
                          <Check className="h-4 w-4" aria-hidden />
                          <span className="sr-only">Подтвердить</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-red-600 hover:bg-red-50"
                          onClick={() => handleReject(apt.id)}
                          disabled={updateMutation.isPending}
                        >
                          <X className="h-4 w-4" aria-hidden />
                          <span className="sr-only">Отклонить</span>
                        </Button>
                      </>
                    )}
                    {apt.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleSendMessage(apt)}
                        title="Отправить сообщение с подтверждением"
                      >
                        <MessageSquare className="h-4 w-4" aria-hidden />
                        {messageSent === apt.id ? " Отправлено" : ""}
                      </Button>
                    )}
                    {apt.status === "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer"
                        onClick={() => openEdit(apt)}
                        title="Изменить время"
                      >
                        <Clock className="h-4 w-4" aria-hidden />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение приёма</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Пациент: <strong>{editing.patient_name}</strong> ·{" "}
                {editing.patient_phone}
              </p>
              <div className="space-y-2">
                <Label htmlFor="newTime">Время приёма</Label>
                <Input
                  id="newTime"
                  type="datetime-local"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Заметки (необязательно)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Внутренние заметки для персонала…"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setEditing(null)}
            >
              Отмена
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleConfirm}
              disabled={updateMutation.isPending}
            >
              Подтвердить приём
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
