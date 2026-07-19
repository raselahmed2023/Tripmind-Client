"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Loader2,
  ArrowRight,
  AlertTriangle,
  Map,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { useVerifyTripPlanPayment } from "@/hooks";

type VerifyStatus = "idle" | "verifying" | "confirmed" | "not-completed" | "invalid" | "failed" | "already-verified";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const verifyMutation = useVerifyTripPlanPayment();
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [tripId, setTripId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || status !== "idle") return;

    const verify = async () => {
      setStatus("verifying");
      try {
        const result = await verifyMutation.mutateAsync(sessionId);
        setTripId(result.tripId);
        if (result.isPlanPurchased && result.paymentStatus === "paid") {
          setStatus("confirmed");
          if (typeof window !== "undefined" && window.history) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, "", cleanUrl);
          }
        } else if (result.paymentStatus === "pending") {
          setStatus("not-completed");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        const apiError = err as { status?: number; message?: string };
        if (apiError?.status === 409) {
          setStatus("already-verified");
          const errData = (err as { data?: { tripId?: string } })?.data;
          if (errData?.tripId) setTripId(errData.tripId);
        } else if (apiError?.status === 400 || apiError?.status === 404) {
          setStatus("invalid");
        } else {
          setStatus("failed");
        }
      }
    };

    verify();
  }, [sessionId, status, verifyMutation]);

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Invalid Session</h1>
            <p className="mt-2 text-slate-600">
              No payment session found. Please try again from your trip page.
            </p>
            <div className="mt-8">
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="pt-8 text-center">
          {status === "verifying" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Verifying your payment...
              </h1>
              <p className="mt-2 text-slate-600">
                We&apos;re confirming your payment with our secure backend. This may take a moment.
              </p>
              <p className="mt-4 text-xs text-slate-400">
                Please don&apos;t close this page.
              </p>
            </>
          )}

          {(status === "confirmed" || status === "already-verified") && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Payment confirmed!
              </h1>
              <p className="mt-2 text-slate-600">
                Your AI Trip Plan has been purchased. You can now generate your personalized itinerary.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {tripId ? (
                  <Link href={`/trips/${tripId}`}>
                    <Button className="w-full" leftIcon={<Map className="h-4 w-4" />}>
                      View Trip
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/trips">
                    <Button className="w-full" leftIcon={<Map className="h-4 w-4" />}>
                      View My Trips
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </>
          )}

          {status === "not-completed" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Payment not completed
              </h1>
              <p className="mt-2 text-slate-600">
                Your payment has not yet been completed. If you were charged, please contact support.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                {tripId ? (
                  <Link href={`/trips/${tripId}`}>
                    <Button className="w-full">Return to Trip</Button>
                  </Link>
                ) : (
                  <Link href="/trips">
                    <Button className="w-full">View My Trips</Button>
                  </Link>
                )}
              </div>
            </>
          )}

          {status === "invalid" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Invalid session
              </h1>
              <p className="mt-2 text-slate-600">
                This payment session is invalid or has expired.
              </p>
              <div className="mt-8">
                <Link href="/trips">
                  <Button>View My Trips</Button>
                </Link>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Verification failed
              </h1>
              <p className="mt-2 text-slate-600">
                We couldn&apos;t verify your payment. If you were charged, please contact support.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                {tripId ? (
                  <Link href={`/trips/${tripId}`}>
                    <Button className="w-full">Return to Trip</Button>
                  </Link>
                ) : (
                  <Link href="/trips">
                    <Button className="w-full">View My Trips</Button>
                  </Link>
                )}
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
