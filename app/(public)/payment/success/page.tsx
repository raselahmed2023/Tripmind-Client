"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Loader2,
  ArrowRight,
  LayoutDashboard,
  CreditCard,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { usePaymentSuccessPoll } from "@/hooks";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const { refetch: refetchPayments } = usePaymentSuccessPoll(sessionId, true);
  const [displayStatus, setDisplayStatus] = useState<"loading" | "confirmed" | "timeout">("loading");
  const attemptsRef = useRef(0);
  const mountedRef = useRef(true);

  const MAX_ATTEMPTS = 6;
  const POLL_INTERVAL = 2000;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (displayStatus !== "loading") return;

    const poll = async () => {
      try {
        await refetchPayments();
      } catch {
        // continue polling
      }
      if (!mountedRef.current) return;

      attemptsRef.current += 1;
      if (attemptsRef.current >= 2) {
        setDisplayStatus("confirmed");
      } else if (attemptsRef.current >= MAX_ATTEMPTS) {
        setDisplayStatus("timeout");
      }
    };

    poll();
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [displayStatus, refetchPayments]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="pt-8 text-center">
          {displayStatus === "loading" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Confirming your payment...
              </h1>
              <p className="mt-2 text-slate-600">
                We&apos;re verifying your payment with our secure backend. This may take a moment.
              </p>
              <p className="mt-4 text-xs text-slate-400">
                Please don&apos;t close this page.
              </p>
            </>
          )}

          {displayStatus === "confirmed" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Payment confirmed!
              </h1>
              <p className="mt-2 text-slate-600">
                Your payment has been processed securely. Your credits and subscription
                have been updated.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <Link href="/dashboard">
                  <Button className="w-full" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/billing">
                  <Button variant="outline" className="w-full" leftIcon={<CreditCard className="h-4 w-4" />}>
                    View Billing
                  </Button>
                </Link>
                <Link href="/trips/create">
                  <Button variant="ghost" className="w-full" leftIcon={<Sparkles className="h-4 w-4" />}>
                    Create a Trip
                  </Button>
                </Link>
              </div>
            </>
          )}

          {displayStatus === "timeout" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Payment processing
              </h1>
              <p className="mt-2 text-slate-600">
                Your payment is being processed securely. It may take a few minutes
                to reflect in your account. If you were charged, your credits will
                be added shortly.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <Link href="/dashboard">
                  <Button className="w-full" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/billing">
                  <Button variant="outline" className="w-full" leftIcon={<CreditCard className="h-4 w-4" />}>
                    Check Billing Status
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      }
    >
      <PaymentSuccessInner />
    </Suspense>
  );
}
