import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreContent } from "@/features/explore";

export const metadata: Metadata = {
  title: "Explore Destinations | TripMind",
  description:
    "Discover amazing travel destinations around the world. Search by location, category, budget, and season to find your perfect trip.",
  openGraph: {
    title: "Explore Destinations | TripMind",
    description:
      "Discover amazing travel destinations around the world.",
  },
};

function ExploreFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-9 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="mx-auto h-10 w-64 animate-pulse rounded bg-slate-200" />
        <div className="mx-auto mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
      </div>
      <div className="mx-auto mb-6 h-12 max-w-xl animate-pulse rounded-[var(--radius-lg)] bg-slate-200" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[var(--radius-xl)] border border-slate-200 bg-white shadow-sm"
          >
            <div className="aspect-[4/3] w-full animate-pulse bg-slate-200" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <ExploreContent />
    </Suspense>
  );
}
