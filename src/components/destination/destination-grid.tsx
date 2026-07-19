import type { Destination } from "@/types";
import { DestinationCard } from "./destination-card";

interface DestinationGridProps {
  destinations: Destination[];
}

export function DestinationGrid({ destinations }: DestinationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {destinations.map((destination) => (
        <DestinationCard key={destination._id} destination={destination} />
      ))}
    </div>
  );
}
