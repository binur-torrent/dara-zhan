"use client";

import { DoctorCard } from "@/features/doctors/components/doctor-card";
import { useDoctors } from "@/features/doctors/hooks/use-doctors";
import { Skeleton } from "@/components/ui/skeleton";

export function DoctorsList() {
  const { data: doctors = [], isLoading, isError } = useDoctors();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Не удалось загрузить врачей. Проверьте подключение к Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
