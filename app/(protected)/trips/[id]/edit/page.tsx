"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { useTrip } from "@/hooks";
import { TripForm } from "@/features/trips";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function EditTripPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: trip, isLoading, error, refetch } = useTrip(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !trip) {
    const is403 = (error as { status?: number })?.status === 403;
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {is403 ? "Access Denied" : "Trip Not Found"}
          </h1>
          <p className="mt-2 max-w-md text-slate-600">
            {is403
              ? "You don't have permission to edit this trip."
              : "The trip you're trying to edit doesn't exist or has been removed."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
          <Link href="/trips">
            <Button variant="outline">Back to Trips</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href={`/trips/${trip._id}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trip
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Trip</h1>
        <p className="mt-1 text-slate-600">
          Update the details of &ldquo;{trip.title}&rdquo;.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-slate-200"
              />
            ))}
          </div>
        }
      >
        <TripForm mode="edit" initialData={trip} />
      </Suspense>
    </div>
  );
}
