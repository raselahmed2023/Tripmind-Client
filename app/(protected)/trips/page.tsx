"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { TripList } from "@/features/trips";

function TripsFallback() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-slate-200"
        />
      ))}
    </div>
  );
}

export default function TripsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Trips</h1>
          <p className="mt-1 text-slate-600">
            View and manage all your trips.
          </p>
        </div>
        <Link href="/trips/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Create Trip</Button>
        </Link>
      </div>

      <Suspense fallback={<TripsFallback />}>
        <TripList />
      </Suspense>
    </div>
  );
}
