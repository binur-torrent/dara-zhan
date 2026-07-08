import Link from "next/link";
import { HeartPulse, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CLINIC_PHONE = "+7 777 763 54 44";
const CLINIC_PHONE_HREF = "tel:+77777635444";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 justify-self-start text-slate-900 transition-colors duration-200 hover:text-primary"
        >
          <HeartPulse className="h-7 w-7 text-primary" aria-hidden />
          <span className="text-lg font-semibold tracking-tight">
            Dara-Zhan
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 justify-self-center md:flex"
          aria-label="Основное"
        >
          <Link
            href="/doctors"
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-slate-900 cursor-pointer"
          >
            Врачи
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-slate-900 cursor-pointer"
          >
            О нас
          </Link>
        </nav>

        <div className="flex items-center gap-2 justify-self-end sm:gap-4">
          <a
            href={CLINIC_PHONE_HREF}
            className="hidden items-center gap-2 text-sm font-medium text-slate-900 transition-colors duration-200 hover:text-primary lg:flex"
          >
            <Phone className="h-4 w-4 text-primary" aria-hidden />
            {CLINIC_PHONE}
          </a>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex cursor-pointer",
            )}
          >
            Вход для персонала
          </Link>
          <Link
            href="/book"
            className={cn(buttonVariants({ size: "sm" }), "cursor-pointer")}
          >
            Записаться
          </Link>
        </div>
      </div>
    </header>
  );
}
