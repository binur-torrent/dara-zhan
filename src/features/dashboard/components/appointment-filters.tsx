"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useDoctors } from "@/features/doctors/hooks/use-doctors";

interface AppointmentFiltersProps {
  status: string;
  doctorId: string;
  date: string;
  onStatusChange: (value: string) => void;
  onDoctorChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export function AppointmentFilters({
  status,
  doctorId,
  date,
  onStatusChange,
  onDoctorChange,
  onDateChange,
}: AppointmentFiltersProps) {
  const { data: doctors = [] } = useDoctors();

  const statusLabels: Record<string, string> = {
    all: "Все статусы",
    pending: "В ожидании",
    confirmed: "Подтверждено",
    rejected: "Отклонено",
  };
  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  return (
    <Card className="mb-6 border-slate-200/80 shadow-sm">
      <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="filter-status">Статус</Label>
          <Select
            value={status}
            onValueChange={(v) => v && onStatusChange(v)}
          >
            <SelectTrigger id="filter-status" className="cursor-pointer">
              <SelectValue>
                {() => statusLabels[status] ?? statusLabels.all}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Все статусы
              </SelectItem>
              <SelectItem value="pending" className="cursor-pointer">
                В ожидании
              </SelectItem>
              <SelectItem value="confirmed" className="cursor-pointer">
                Подтверждено
              </SelectItem>
              <SelectItem value="rejected" className="cursor-pointer">
                Отклонено
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-doctor">Врач</Label>
          <Select
            value={doctorId || "all"}
            onValueChange={(v) => v && onDoctorChange(v)}
          >
            <SelectTrigger id="filter-doctor" className="cursor-pointer">
              <SelectValue>
                {() => (selectedDoctor ? selectedDoctor.name : "Все врачи")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Все врачи
              </SelectItem>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id} className="cursor-pointer">
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-date">Дата</Label>
          <Input
            id="filter-date"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
