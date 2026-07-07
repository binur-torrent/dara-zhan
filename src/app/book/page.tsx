import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { BookingForm } from "@/features/appointments/components/booking-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Запись на приём",
  description: "Запишитесь на визит в клинику — регистрация не требуется.",
};

function BookingFormFallback() {
  return <Skeleton className="mx-auto h-[520px] max-w-lg rounded-xl" />;
}

export default function BookPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Запись на приём
          </h1>
          <p className="mt-2 text-muted-foreground">
            Три простых шага — врач, процедура, время.
          </p>
        </div>
        <Suspense fallback={<BookingFormFallback />}>
          <BookingForm />
        </Suspense>
      </div>
    </SiteShell>
  );
}
