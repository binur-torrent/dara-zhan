"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useDoctors,
  useDoctorProcedures,
} from "@/features/doctors/hooks/use-doctors";
import { useCreateAppointment } from "@/features/appointments/hooks/use-appointments";
import { SlotCalendar } from "@/features/appointments/components/slot-calendar";
import {
  bookingSchema,
  type BookingFormValues,
} from "@/features/appointments/schemas/booking-schema";
import { formatPriceKzt } from "@/lib/utils";

export function BookingForm() {
  const searchParams = useSearchParams();
  const preselectedDoctor = searchParams.get("doctor");

  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();
  const createMutation = useCreateAppointment();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      doctorId: preselectedDoctor ?? "",
      procedureId: "",
      scheduledAt: "",
      patientName: "",
      patientPhone: "",
    },
  });

  const doctorId = form.watch("doctorId");
  const procedureId = form.watch("procedureId");
  const scheduledAt = form.watch("scheduledAt");
  const { data: procedures = [], isLoading: proceduresLoading } =
    useDoctorProcedures(doctorId || null);

  const selectedDoctor = doctors.find((d) => d.id === doctorId);
  const selectedProcedure = procedures.find((p) => p.id === procedureId);

  useEffect(() => {
    if (preselectedDoctor) {
      form.setValue("doctorId", preselectedDoctor);
    }
  }, [preselectedDoctor, form]);

  useEffect(() => {
    form.setValue("procedureId", "");
    form.setValue("scheduledAt", "");
  }, [doctorId, form]);

  useEffect(() => {
    form.setValue("scheduledAt", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [procedureId]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!selectedProcedure) return;
    await createMutation.mutateAsync({
      ...values,
      durationMinutes: selectedProcedure.duration_minutes,
      priceKzt: selectedProcedure.price_kzt,
    });
  });

  if (createMutation.isSuccess) {
    return (
      <Card className="mx-auto max-w-lg border-emerald-200 bg-emerald-50/50">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-600" aria-hidden />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Заявка отправлена
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ваша заявка на приём в статусе ожидания. Наш администратор
              рассмотрит её и свяжется с вами для подтверждения.
            </p>
          </div>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => createMutation.reset()}
          >
            Записаться ещё раз
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">
          Запись на приём
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Регистрация не нужна. Заполните форму ниже.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {createMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Не удалось отправить заявку. Попробуйте ещё раз.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="doctorId">Врач</Label>
            <Select
              value={doctorId}
              onValueChange={(v) => v && form.setValue("doctorId", v)}
              disabled={doctorsLoading}
            >
              <SelectTrigger id="doctorId" className="w-full cursor-pointer">
                <SelectValue placeholder="Выберите врача">
                  {() =>
                    selectedDoctor
                      ? `${selectedDoctor.name} — ${selectedDoctor.specialty}`
                      : "Выберите врача"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="cursor-pointer">
                    {d.name} — {d.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.doctorId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.doctorId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="procedureId">Процедура</Label>
            <Select
              value={procedureId}
              onValueChange={(v) => v && form.setValue("procedureId", v)}
              disabled={!doctorId || proceduresLoading}
            >
              <SelectTrigger id="procedureId" className="w-full cursor-pointer">
                <SelectValue placeholder="Выберите процедуру">
                  {() =>
                    selectedProcedure
                      ? `${selectedProcedure.name} — ${formatPriceKzt(selectedProcedure.price_kzt)} · ${selectedProcedure.duration_minutes} мин`
                      : "Выберите процедуру"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {procedures.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                    {p.name} — {formatPriceKzt(p.price_kzt)} · {p.duration_minutes}{" "}
                    мин
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.procedureId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.procedureId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Дата и время</Label>
            {!doctorId || !procedureId ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center text-sm text-muted-foreground">
                Сначала выберите врача и процедуру
              </p>
            ) : (
              <SlotCalendar
                key={doctorId}
                doctorId={doctorId}
                durationMinutes={selectedProcedure?.duration_minutes ?? 30}
                value={scheduledAt}
                onChange={(iso) => form.setValue("scheduledAt", iso)}
              />
            )}
            {form.formState.errors.scheduledAt && (
              <p className="text-sm text-destructive">
                {form.formState.errors.scheduledAt.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientName">Ваше имя</Label>
            <Input
              id="patientName"
              placeholder="Имя и фамилия"
              {...form.register("patientName")}
            />
            {form.formState.errors.patientName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.patientName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientPhone">Номер телефона</Label>
            <Input
              id="patientPhone"
              type="tel"
              placeholder="+7 700 000 0000"
              {...form.register("patientPhone")}
            />
            {form.formState.errors.patientPhone && (
              <p className="text-sm text-destructive">
                {form.formState.errors.patientPhone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Отправка…
              </>
            ) : (
              "Отправить заявку"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Статус будет <strong>«в ожидании»</strong> до подтверждения нашим
            персоналом.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
