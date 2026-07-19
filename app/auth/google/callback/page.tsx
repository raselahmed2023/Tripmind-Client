"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks";
import { sanitizeRedirect } from "@/utils";

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const { googleExchange, isGoogleExchanging, googleExchangeError } = useAuth();
  const exchangedRef = useRef(false);

  useEffect(() => {
    if (error || !code || exchangedRef.current || isGoogleExchanging) {
      return;
    }

    exchangedRef.current = true;
    googleExchange.mutate(code, {
      onSuccess: () => {
        const raw = sessionStorage.getItem("post_login_redirect");
        sessionStorage.removeItem("post_login_redirect");
        const redirect = sanitizeRedirect(raw);
        window.history.replaceState({}, "", redirect);
        router.push(redirect);
      },
    });
  }, [code, error, isGoogleExchanging, googleExchange, router]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Authentication Failed</h1>
        <p className="max-w-md text-slate-600">
          Google authentication was cancelled or encountered an error. Please try again.
        </p>
        <Button onClick={() => router.push("/login")}>Back to Login</Button>
      </div>
    );
  }

  if (googleExchangeError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Exchange Failed</h1>
        <p className="max-w-md text-slate-600">
          {googleExchangeError}
        </p>
        <Button onClick={() => router.push("/login")}>Back to Login</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      <p className="text-sm text-slate-600">Completing authentication...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  );
}
