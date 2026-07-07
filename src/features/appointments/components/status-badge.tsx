import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "В ожидании",
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  },
  confirmed: {
    label: "Подтверждено",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  },
  rejected: {
    label: "Отклонено",
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  },
};

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
