"use client";

import Link from "next/link";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Pencil,
  Trash2,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui";
import { TripStatusBadge } from "./trip-status-badge";
import type { Trip } from "@/types";

interface TripCardProps {
  trip: Trip;
  onDelete: (trip: Trip) => void;
  isDeleting?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDurationDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
}

export function TripCard({ trip, onDelete, isDeleting }: TripCardProps) {
  const destTitle = trip.destination?.title;
  const destCity = trip.destination?.city;
  const destCountry = trip.destination?.country;
  const duration = getDurationDays(trip.startDate, trip.endDate);

  return (
    <div className="group rounded-[var(--radius-xl)] border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/trips/${trip._id}`}
            className="text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors line-clamp-1"
          >
            {trip.title}
          </Link>
          {destTitle && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {destTitle}
                {destCity ? `, ${destCity}` : ""}
                {destCountry ? `, ${destCountry}` : ""}
              </span>
            </p>
          )}
        </div>
        <TripStatusBadge status={trip.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="text-slate-400">&middot;</span>
          <span>
            {duration} day{duration !== 1 ? "s" : ""}
          </span>
        </div>
        {trip.travelers > 0 && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              {trip.travelers} traveler{trip.travelers !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        {trip.budget > 0 && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <DollarSign className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              {trip.currency}
              {trip.budget.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
        {trip.itineraryId && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
            <Route className="h-3 w-3" />
            Itinerary
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Link href={`/trips/${trip._id}`}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Route className="h-3.5 w-3.5" />}
            >
              View
            </Button>
          </Link>
          {trip.status !== "completed" && trip.status !== "cancelled" && (
            <Link href={`/trips/${trip._id}/edit`}>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Pencil className="h-3.5 w-3.5" />}
              >
                Edit
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => onDelete(trip)}
            disabled={isDeleting}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
