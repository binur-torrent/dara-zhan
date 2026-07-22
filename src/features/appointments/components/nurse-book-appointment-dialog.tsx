"use client";

import { Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "@/features/appointments/components/booking-form";

export function NurseBookAppointmentDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" aria-hidden />
            <span className="ml-2">Записать клиента</span>
          </Button>
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Новая запись</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<Skeleton className="h-[520px] w-full rounded-xl" />}>
          <BookingForm variant="nurse" />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
