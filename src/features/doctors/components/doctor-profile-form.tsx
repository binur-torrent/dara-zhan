"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Loader2,
  Save,
  Stethoscope,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDoctor,
  useUpdateDoctorProfile,
  useUploadDoctorAvatar,
} from "@/features/doctors/hooks/use-doctors";
import {
  doctorProfileSchema,
  type DoctorProfileFormValues,
} from "@/features/doctors/schemas/doctor-profile-schema";
import type { Doctor } from "@/types";

interface DoctorProfileFormProps {
  doctorId: string;
}

export function DoctorProfileForm({ doctorId }: DoctorProfileFormProps) {
  const { data: doctor, isLoading } = useDoctor(doctorId);

  if (isLoading || !doctor) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  return <DoctorProfileFormInner key={doctor.id} doctor={doctor} />;
}

function DoctorProfileFormInner({ doctor }: { doctor: Doctor }) {
  const updateMutation = useUpdateDoctorProfile(doctor.id);
  const uploadMutation = useUploadDoctorAvatar(doctor.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(doctor.avatar_url);

  const form = useForm<DoctorProfileFormValues>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      name: doctor.name,
      specialty: doctor.specialty,
      bio: doctor.bio ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await updateMutation.mutateAsync({
      name: values.name,
      specialty: values.specialty,
      bio: values.bio?.trim() ? values.bio.trim() : null,
    });
  });

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadMutation.mutateAsync(file);
      setAvatarUrl(url);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">
          Профиль врача
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Эти данные видят пациенты на странице «Врачи». Измените их в любой
          момент — сохранять вручную больше не нужно просить администратора.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={doctor.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Stethoscope className="h-10 w-10" aria-hidden />
            )}
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Загрузка…
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" aria-hidden />
                  {avatarUrl ? "Заменить фото" : "Загрузить фото"}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG или PNG, квадратное фото смотрится лучше всего.
            </p>
          </div>
        </div>

        {uploadMutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              Не удалось загрузить фото. Попробуйте ещё раз.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {updateMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Не удалось сохранить профиль. Попробуйте ещё раз.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Имя и фамилия</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Специализация</Label>
            <Input
              id="specialty"
              placeholder="Например: Кардиолог"
              {...form.register("specialty")}
            />
            {form.formState.errors.specialty && (
              <p className="text-sm text-destructive">
                {form.formState.errors.specialty.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Textarea
              id="bio"
              rows={5}
              placeholder="Расскажите пациентам об опыте, подходе к работе и специализации…"
              {...form.register("bio")}
            />
            {form.formState.errors.bio && (
              <p className="text-sm text-destructive">
                {form.formState.errors.bio.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Сохранение…
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" aria-hidden />
                  Сохранить профиль
                </>
              )}
            </Button>
            {updateMutation.isSuccess && !form.formState.isDirty && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Сохранено
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
