"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/features/appointments/components/status-badge";
import type { AppointmentActions } from "@/features/appointments/hooks/use-appointment-actions";
import { formatPriceKzt } from "@/lib/utils";

interface AppointmentActionsDialogProps {
  actions: AppointmentActions;
}

export function AppointmentActionsDialog({
  actions,
}: AppointmentActionsDialogProps) {
  const {
    editing,
    newTime,
    setNewTime,
    notes,
    setNotes,
    closeEdit,
    confirm,
    reject,
    sendMessage,
    updateMutation,
  } = actions;

  return (
    <Dialog open={!!editing} onOpenChange={(open) => !open && closeEdit()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing?.status === "pending"
              ? "Подтверждение приёма"
              : "Приём"}
          </DialogTitle>
        </DialogHeader>
        {editing && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Пациент: <strong>{editing.patient_name}</strong> ·{" "}
                {editing.patient_phone}
              </p>
              <StatusBadge status={editing.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {editing.doctors?.name ?? "—"} · {editing.procedures?.name ?? "—"}{" "}
              · {formatPriceKzt(editing.price_kzt)} · {editing.duration_minutes}{" "}
              мин
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
          {editing?.status === "pending" ? (
            <>
              <Button
                variant="outline"
                className="cursor-pointer text-red-600 hover:bg-red-50"
                onClick={() => editing && reject(editing.id)}
                disabled={updateMutation.isPending}
              >
                Отклонить
              </Button>
              <Button
                className="cursor-pointer"
                onClick={confirm}
                disabled={updateMutation.isPending}
              >
                Подтвердить приём
              </Button>
            </>
          ) : (
            <>
              {editing?.status === "confirmed" && (
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => editing && sendMessage(editing)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" aria-hidden />
                  Сообщение
                </Button>
              )}
              <Button
                className="cursor-pointer"
                onClick={confirm}
                disabled={updateMutation.isPending}
              >
                Сохранить
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
