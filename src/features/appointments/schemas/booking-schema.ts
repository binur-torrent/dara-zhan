import { z } from "zod";

export const bookingSchema = z.object({
  doctorId: z.string().uuid("Пожалуйста, выберите врача"),
  procedureId: z.string().uuid("Пожалуйста, выберите процедуру"),
  scheduledAt: z.string().min(1, "Пожалуйста, выберите время"),
  patientName: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя слишком длинное"),
  patientPhone: z
    .string()
    .min(10, "Введите корректный номер телефона")
    .max(20, "Номер телефона слишком длинный")
    .regex(/^[\d\s+\-()]+$/, "Неверный формат номера телефона"),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
