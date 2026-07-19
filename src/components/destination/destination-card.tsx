"use client";

import Link from "next/link";
import { MapPin, Star, Calendar, Compass } from "lucide-react";
import { Badge } from "@/components/ui";
import type { Destination } from "@/types";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e2e8f0' width='400' height='300'/%3E%3Ccircle cx='200' cy='120' r='40' fill='%2394a3b8' opacity='0.5'/%3E%3Cpath d='M180 160 L200 140 L220 160 L210 160 L210 200 L190 200 L190 160 Z' fill='%2394a3b8' opacity='0.4'/%3E%3Ctext x='200' y='260' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='16'%3E🌍 Explore this destination%3C/text%3E%3C/svg%3E";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const imageSrc =
    destination.images && destination.images.length > 0
      ? destination.images[0]
      : FALLBACK_IMAGE;

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={`${destination.title} - ${destination.city}, ${destination.country}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {destination.category && (
          <div className="absolute left-3 top-3">
            <Badge variant="primary">{destination.category}</Badge>
          </div>
        )}
        {destination.bestSeason && (
          <div className="absolute right-3 top-3">
            <Badge variant="secondary">
              <Calendar className="mr-1 inline h-3 w-3" />
              {destination.bestSeason}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {destination.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {destination.city}
            {destination.city && destination.country ? ", " : ""}
            {destination.country}
          </span>
        </div>

        {destination.shortDescription && (
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {destination.shortDescription}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-center gap-3">
              {destination.averageDailyCost !== undefined && (
                <span className="text-sm font-semibold text-slate-900">
                  {destination.currency || "$"}
                  {destination.averageDailyCost}
                  <span className="font-normal text-slate-500">/day</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
              <span className="text-sm font-medium text-slate-700">
                {destination.rating?.toFixed(1) ?? "N/A"}
              </span>
              {destination.reviewCount !== undefined && (
                <span className="text-xs text-slate-400">
                  ({destination.reviewCount})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors group-hover:border-primary-200 group-hover:bg-primary-50 group-hover:text-primary-600">
            <Compass className="h-4 w-4" />
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
