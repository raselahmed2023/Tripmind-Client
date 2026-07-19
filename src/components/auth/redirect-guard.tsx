"use client";

import { useAuth } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { sanitizeRedirect } from "@/utils";
import { MapPin } from "lucide-react";

export function RedirectGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirecting = useRef(false);

  useEffect(() => {
    if (isLoading || redirecting.current || !isAuthenticated) return;

    const redirectTo = sanitizeRedirect(searchParams.get("redirect"));
    redirecting.current = true;
    router.push(redirectTo);
  }, [isAuthenticated, isLoading, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
            <MapPin className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-primary-500" />
          </div>
          <p className="text-sm text-slate-500">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
