"use client";

import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { DoctorSchedule } from "@/features/appointments/components/doctor-schedule";
import { WorkingHoursEditor } from "@/features/schedule/components/working-hours-editor";
import { ScheduleOverrides } from "@/features/schedule/components/schedule-overrides";
import { DoctorProfileForm } from "@/features/doctors/components/doctor-profile-form";
import { useUserProfile } from "@/features/auth/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function DoctorDashboardPage() {
  const { data: profile, isLoading } = useUserProfile();

  return (
    <DashboardShell
      title="Моё расписание"
      description="Подтверждённые приёмы и настройка часов работы."
    >
      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments" className="cursor-pointer">
            Приёмы
          </TabsTrigger>
          <TabsTrigger value="hours" className="cursor-pointer">
            Часы работы
          </TabsTrigger>
          <TabsTrigger value="profile" className="cursor-pointer">
            Профиль
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-4">
          <DoctorSchedule />
        </TabsContent>

        <TabsContent value="hours" className="mt-4 space-y-6">
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : profile?.doctor_id ? (
            <>
              <WorkingHoursEditor doctorId={profile.doctor_id} />
              <ScheduleOverrides doctorId={profile.doctor_id} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Профиль врача не найден.
            </p>
          )}
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : profile?.doctor_id ? (
            <DoctorProfileForm doctorId={profile.doctor_id} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Профиль врача не найден.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
