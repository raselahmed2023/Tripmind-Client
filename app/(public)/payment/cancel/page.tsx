"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { XCircle, ArrowRight, Map } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

function PaymentCancelInner() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="pt-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <XCircle className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Payment cancelled
          </h1>
          <p className="mt-2 text-slate-600">
            No charge was completed. Your account remains unchanged.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {tripId ? (
              <Link href={`/trips/${tripId}`}>
                <Button className="w-full" leftIcon={<Map className="h-4 w-4" />}>
                  Return to Trip
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
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
        </div>
      }
    >
      <PaymentCancelInner />
    </Suspense>
  );
}
