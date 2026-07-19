"use client";

import { useDestinations } from "@/hooks";
import { DestinationCard } from "@/components/destination";
import { DestinationCardSkeleton } from "@/components/destination";

interface RelatedDestinationsProps {
  category: string;
  currentSlug: string;
}

export function RelatedDestinations({
  category,
  currentSlug,
}: RelatedDestinationsProps) {
  const { data, isLoading } = useDestinations({
    category,
    limit: 5,
    sort: "rating_desc",
  });

  const destinations = data?.data.filter((d) => d.slug !== currentSlug).slice(0, 4);

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Similar Destinations
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!destinations || destinations.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Similar Destinations
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination) => (
          <DestinationCard key={destination._id} destination={destination} />
        ))}
      </div>
    </section>
  );
}
