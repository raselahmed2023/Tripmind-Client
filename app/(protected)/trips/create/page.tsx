"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TripForm } from "@/features/trips";

function CreateFormFallback() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-slate-200"
        />
      ))}
    </div>
  );
}

function CreateTripContent() {
  const searchParams = useSearchParams();
  const destinationId = searchParams.get("destinationId") || undefined;
  const destinationSlug = searchParams.get("destination") || undefined;

  return (
    <TripForm
      mode="create"
      preselectedDestinationId={destinationId}
      preselectedDestinationSlug={destinationSlug}
    />
  );
}

export default function CreateTripPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/trips"
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Trips
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Create New Trip</h1>
        <p className="mt-1 text-slate-600">
          Fill in the details to plan your next adventure.
        </p>
      </div>

      <Suspense fallback={<CreateFormFallback />}>
        <CreateTripContent />
      </Suspense>
    </div>
  );
}
