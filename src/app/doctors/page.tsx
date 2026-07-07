import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { DoctorsList } from "@/features/doctors/components/doctors-list";

export const metadata: Metadata = {
  title: "Наши врачи",
  description: "Ознакомьтесь со специалистами клиники и запишитесь на приём.",
};

export default function DoctorsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Наши врачи
          </h1>
          <p className="mt-2 text-muted-foreground">
            Выберите специалиста и запишитесь на приём онлайн.
          </p>
        </div>
        <DoctorsList />
      </div>
    </SiteShell>
  );
}
