"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, Phone, Stethoscope, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AppointmentWithRelations } from "@/types";
import { formatPriceKzt } from "@/lib/utils";

interface AppointmentDetailsDialogProps {
  appointment: AppointmentWithRelations | null;
  onClose: () => void;
}

export function AppointmentDetailsDialog({
  appointment,
  onClose,
}: AppointmentDetailsDialogProps) {
  return (
    <Dialog open={!!appointment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Детали приёма</DialogTitle>
        </DialogHeader>
        {appointment && (
          <div className="space-y-3 py-2 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" aria-hidden />
              <span className="font-medium text-slate-900">
                {appointment.patient_name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" aria-hidden />
              {appointment.patient_phone}
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope
                className="h-4 w-4 text-muted-foreground"
                aria-hidden
              />
              {appointment.procedures?.name ?? "—"} ·{" "}
              {formatPriceKzt(appointment.price_kzt)}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden />
              {format(new Date(appointment.scheduled_at), "EEEE, d MMMM yyyy", {
                locale: ru,
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
              {format(new Date(appointment.scheduled_at), "HH:mm")} ·{" "}
              {appointment.duration_minutes} мин
            </div>
            {appointment.notes && (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                {appointment.notes}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
