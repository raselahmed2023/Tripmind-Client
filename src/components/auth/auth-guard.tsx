"use client";

import {
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

import { useAuth } from "@/hooks";
import { sanitizeRedirect } from "@/utils";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const subscribe = () => () => undefined;

function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />

          <MapPin className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-primary-500" />
        </div>

        <p className="text-sm text-slate-500">
          Verifying your session...
        </p>
      </div>
    </div>
  );
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
}: AuthGuardProps) {
  const hasMounted = useHasMounted();

  const {
    user,
    isLoadingUser: isLoading,
    isAuthenticated,
  } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const redirecting = useRef(false);

  useEffect(() => {
    if (!hasMounted || isLoading || redirecting.current) {
      return;
    }

    if (requireAuth && !isAuthenticated) {
      redirecting.current = true;

      const safePath = sanitizeRedirect(pathname);

      router.replace(
        `/login?redirect=${encodeURIComponent(safePath)}`,
      );

      return;
    }

    if (requireAdmin && user?.role !== "admin") {
      redirecting.current = true;
      router.replace("/dashboard");
    }
  }, [
    hasMounted,
    isLoading,
    isAuthenticated,
    requireAuth,
    requireAdmin,
    user?.role,
    router,
    pathname,
  ]);

  if (!hasMounted || isLoading) {
    return <AuthLoadingScreen />;
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAdmin && user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}