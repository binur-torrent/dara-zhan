import { z } from "zod";

export const doctorProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя слишком длинное"),
  specialty: z
    .string()
    .min(2, "Укажите специализацию")
    .max(100, "Специализация слишком длинная"),
  bio: z
    .string()
    .max(1000, "Описание слишком длинное")
    .optional()
    .or(z.literal("")),
});

export type DoctorProfileFormValues = z.infer<typeof doctorProfileSchema>;
