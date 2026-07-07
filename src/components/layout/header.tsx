import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-900 transition-colors duration-200 hover:text-primary"
        >
          <HeartPulse className="h-7 w-7 text-primary" aria-hidden />
          <span className="text-lg font-semibold tracking-tight">
            Dara-Zhan
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Основное">
          <Link
            href="/doctors"
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-slate-900 cursor-pointer"
          >
            Врачи
          </Link>
          <Link
            href="/book"
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-slate-900 cursor-pointer"
          >
            Запись
          </Link>
        </nav>

        <div className="flex items-center gap-2">
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
