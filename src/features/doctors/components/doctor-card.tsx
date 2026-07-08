import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/types";

interface DoctorCardProps {
  doctor: Doctor;
  showBookLink?: boolean;
}

export function DoctorCard({ doctor, showBookLink = true }: DoctorCardProps) {
  return (
    <Card className="h-full border-slate-200/80 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
          {doctor.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doctor.avatar_url}
              alt={doctor.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Stethoscope className="h-6 w-6" aria-hidden />
          )}
        </div>
        <CardTitle className="text-lg font-semibold text-slate-900">
          {doctor.name}
        </CardTitle>
        <p className="text-sm font-medium text-primary">{doctor.specialty}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {doctor.bio && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {doctor.bio}
          </p>
        )}
        {showBookLink && (
          <Link
            href={`/book?doctor=${doctor.id}`}
            className={cn(buttonVariants(), "w-full cursor-pointer")}
          >
            Записаться на приём
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
