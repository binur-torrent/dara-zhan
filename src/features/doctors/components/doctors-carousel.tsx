"use client";

import Link from "next/link";
import { Stethoscope } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctors } from "@/features/doctors/hooks/use-doctors";

export function DoctorsCarousel() {
  const { data: doctors = [], isLoading, isError } = useDoctors();

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 px-2 sm:grid-cols-3 sm:px-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError || doctors.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{ align: "start", loop: doctors.length > 3 }}
      className="mx-auto w-full max-w-5xl px-2 sm:px-10"
    >
      <CarouselContent>
        {doctors.map((doctor) => (
          <CarouselItem
            key={doctor.id}
            className="basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <Link
              href={`/book?doctor=${doctor.id}`}
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-primary/10 text-primary">
                {doctor.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doctor.avatar_url}
                    alt={doctor.name}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <Stethoscope className="h-10 w-10" aria-hidden />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-5">
                <p className="font-semibold text-slate-900">{doctor.name}</p>
                <p className="text-sm font-medium text-primary">
                  {doctor.specialty}
                </p>
                {doctor.bio && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {doctor.bio}
                  </p>
                )}
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
