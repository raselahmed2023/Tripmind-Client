import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from "@/components/ui";
import { Skeleton } from "@/components/ui";
import { MapPin, Calendar, DollarSign, ArrowRight, Users } from "lucide-react";
import type { Trip } from "@/types";

interface RecentTripsProps {
  trips: Trip[];
  isLoading: boolean;
  error: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusVariant(
  status: Trip["status"]
): "success" | "primary" | "accent" | "default" | "destructive" {
  if (status === "completed") return "success";
  if (status === "planned") return "primary";
  if (status === "ongoing") return "accent";
  if (status === "cancelled") return "destructive";
  return "default";
}

function TripsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-slate-100 p-4"
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-[var(--radius-md)]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center">
      <MapPin className="mx-auto h-12 w-12 text-slate-300" />
      <p className="mt-4 text-lg font-medium text-slate-700">No trips yet</p>
      <p className="mt-1 text-sm text-slate-500">
        Create your first trip to start tracking your adventures.
      </p>
      <Link href="/trips/create" className="mt-4 inline-block">
        <Button leftIcon={<MapPin className="h-4 w-4" />}>Create Trip</Button>
      </Link>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-red-600">
        Failed to load trips. Please try again later.
      </p>
    </div>
  );
}

export function RecentTrips({ trips, isLoading, error }: RecentTripsProps) {
  const recentTrips = trips.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Trips</CardTitle>
        <Link href="/trips">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TripsSkeleton />
        ) : error ? (
          <ErrorState />
        ) : recentTrips.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div
                key={trip._id}
                className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-slate-100 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary-100">
                  <MapPin className="h-5 w-5 text-primary-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">
                    {trip.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {trip.destination?.title || trip.destinationId}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(trip.startDate)}
                    </span>
                  </div>
                </div>
                <div className="hidden items-center gap-3 sm:flex">
                  {trip.travelers > 1 && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Users className="h-3 w-3" />
                      {trip.travelers}
                    </span>
                  )}
                  {trip.budget > 0 && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <DollarSign className="h-3 w-3" />
                      {trip.budget.toLocaleString()}
                    </span>
                  )}
                  <Badge variant={getStatusVariant(trip.status)}>
                    {trip.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
