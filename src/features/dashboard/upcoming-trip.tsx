import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from "@/components/ui";
import { Skeleton } from "@/components/ui";
import {
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { Trip } from "@/types";

interface UpcomingTripProps {
  trips: Trip[];
  isLoading: boolean;
}

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getUpcomingTrip(trips: Trip[]): Trip | null {
  const now = new Date();
  const future = trips
    .filter((t) => {
      const start = new Date(t.startDate);
      return (t.status === "planned" || t.status === "ongoing" || t.status === "draft") && start >= now;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  return future[0] ?? null;
}

function UpcomingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-60" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-10 w-32 rounded-[var(--radius-md)]" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-8 text-center">
      <Clock className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 font-medium text-slate-700">No upcoming trips</p>
      <p className="mt-1 text-sm text-slate-500">
        Plan your next adventure to see it here.
      </p>
      <Link href="/trips/create" className="mt-4 inline-block">
        <Button size="sm" leftIcon={<MapPin className="h-4 w-4" />}>
          Plan a Trip
        </Button>
      </Link>
    </div>
  );
}

export function UpcomingTrip({ trips, isLoading }: UpcomingTripProps) {
  const trip = getUpcomingTrip(trips);
  const days = trip ? getDaysUntil(trip.startDate) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Trip</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <UpcomingSkeleton />
        ) : !trip ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {trip.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {trip.destination?.title || trip.destinationId}
                </p>
              </div>
              <Badge
                variant={days <= 7 ? "destructive" : "accent"}
                className="shrink-0"
              >
                {days === 0
                  ? "Today"
                  : days === 1
                    ? "Tomorrow"
                    : `${days} days`}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[var(--radius-md)] bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Travel Dates</p>
                <p className="mt-0.5 font-medium text-slate-900">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </p>
              </div>
              {trip.budget > 0 && (
                <div className="rounded-[var(--radius-md)] bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Budget</p>
                  <p className="mt-0.5 font-medium text-slate-900">
                    {trip.currency ?? "$"}
                    {trip.budget.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {trip.itineraryId && (
                <Badge variant="success">
                  Itinerary Ready
                </Badge>
              )}
              <Badge variant="outline">{trip.status}</Badge>
            </div>

            <Link href={`/trips`}>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue Planning
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
