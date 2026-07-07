import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Вход для персонала",
};

function LoginFallback() {
  return <Skeleton className="mx-auto h-80 max-w-md rounded-xl" />;
}

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </SiteShell>
  );
}
