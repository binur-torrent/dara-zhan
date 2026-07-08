"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface PhotoCarouselItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

interface PhotoCarouselProps {
  items: PhotoCarouselItem[];
  /** Controls how many slides are visible per breakpoint. */
  itemClassName?: string;
  /** Aspect ratio classes applied to the image wrapper. */
  imageAspectClassName?: string;
}

export function PhotoCarousel({
  items,
  itemClassName = "basis-full sm:basis-1/2 lg:basis-1/3",
  imageAspectClassName = "aspect-4/3",
}: PhotoCarouselProps) {
  return (
    <Carousel
      opts={{ align: "start", loop: items.length > 1 }}
      className="mx-auto w-full max-w-5xl px-2 sm:px-10"
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id} className={itemClassName}>
            <figure className="h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className={cn("w-full overflow-hidden bg-slate-100", imageAspectClassName)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              {(item.title || item.subtitle) && (
                <figcaption className="p-4">
                  {item.title && (
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                  )}
                  {item.subtitle && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  )}
                </figcaption>
              )}
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
