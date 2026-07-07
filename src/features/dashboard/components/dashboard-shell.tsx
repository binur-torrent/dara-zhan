"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignOut, useUserProfile } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: profile } = useUserProfile();
  const signOutMutation = useSignOut();

  const handleSignOut = async () => {
    await signOutMutation.mutateAsync();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-900 transition-colors hover:text-primary"
            >
              <HeartPulse className="h-6 w-6 text-primary" aria-hidden />
              <span className="font-semibold">Dara-Zhan</span>
            </Link>
            <span className="hidden text-slate-300 sm:inline">|</span>
            <nav className="hidden gap-1 sm:flex">
              {profile?.role === "nurse" && (
                <Link
                  href="/dashboard/nurse"
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                    pathname === "/dashboard/nurse"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-slate-900",
                  )}
                >
                  Медсестра
                </Link>
              )}
              {profile?.role === "doctor" && (
                <Link
                  href="/dashboard/doctor"
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                    pathname === "/dashboard/doctor"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-slate-900",
                  )}
                >
                  Расписание
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {profile && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {profile.full_name}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleSignOut}
              disabled={signOutMutation.isPending}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="ml-2 hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
