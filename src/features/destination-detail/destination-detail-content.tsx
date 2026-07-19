"use client";

import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Star,
  Calendar,
  Route,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { useDestinationBySlug, useAuth } from "@/hooks";
import { ImageGallery } from "./image-gallery";
import { KeyInfoCards } from "./key-info-cards";
import { RelatedDestinations } from "./related-destinations";

interface DestinationDetailContentProps {
  slug: string;
}

export function DestinationDetailContent({ slug }: DestinationDetailContentProps) {
  const { data: destination, isLoading, error, refetch } = useDestinationBySlug(slug);
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 h-4 w-64 rounded bg-slate-200 animate-pulse" />

        {/* Image skeleton */}
        <div className="mb-8 aspect-[16/10] w-full animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />

        {/* Content skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-3/4 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
            <div className="h-32 rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-48 rounded bg-slate-200 animate-pulse" />
            <div className="h-12 rounded bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Destination Not Found
          </h1>
          <p className="mt-2 max-w-md text-slate-600">
            The destination you&apos;re looking for doesn&apos;t exist or has been
            removed.
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
          <Link href="/explore">
            <Button variant="outline">Browse Destinations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const plannerUrl = `/trips/create?destinationId=${encodeURIComponent(destination._id)}&destination=${encodeURIComponent(destination.slug)}`;
  const loginRedirect = `/login?redirect=${encodeURIComponent(`/destinations/${destination.slug}`)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary-500 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/explore" className="hover:text-primary-500 transition-colors">
          Explore
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-900">{destination.title}</span>
      </nav>

      {/* Image Gallery */}
      <div className="mb-8">
        <ImageGallery
          images={destination.images}
          title={destination.title}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Heading */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {destination.category && (
                <Badge variant="primary">{destination.category}</Badge>
              )}
              {destination.bestSeason && (
                <Badge variant="secondary">
                  <Calendar className="mr-1 inline h-3 w-3" />
                  {destination.bestSeason}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {destination.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-slate-600">
              <MapPin className="h-4 w-4" />
              <span>
                {destination.city}
                {destination.city && destination.country ? ", " : ""}
                {destination.country}
              </span>
            </div>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                <span className="font-semibold text-slate-900">
                  {destination.rating?.toFixed(1) ?? "N/A"}
                </span>
              </div>
              {destination.reviewCount !== undefined && (
                <span className="text-sm text-slate-500">
                  ({destination.reviewCount} review{destination.reviewCount !== 1 ? "s" : ""})
                </span>
              )}
            </div>
          </div>

          {/* Overview */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">
              Overview
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
              {destination.fullDescription || destination.shortDescription}
            </div>
          </section>

          {/* Highlights */}
          {destination.highlights && destination.highlights.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                Highlights
              </h2>
              <ul className="space-y-2">
                {destination.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Key Information */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">
              Key Information
            </h2>
            <KeyInfoCards destination={destination} />
          </section>

          {/* Map/Location */}
          {destination.latitude && destination.longitude && (
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                Location
              </h2>
              <div className="rounded-[var(--radius-lg)] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {destination.city}, {destination.country}
                  </span>
                  <span className="text-sm text-slate-400">
                    ({destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)})
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Start Planning CTA */}
          <div className="rounded-[var(--radius-xl)] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Start Planning
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Let AI create a personalized itinerary for{" "}
              {destination.title}.
            </p>
            {isAuthenticated ? (
              <Link href={plannerUrl}>
                <Button className="mt-4 w-full" leftIcon={<Route className="h-4 w-4" />}>
                  Plan Your Trip
                </Button>
              </Link>
            ) : (
              <Link href={loginRedirect}>
                <Button className="mt-4 w-full" leftIcon={<Route className="h-4 w-4" />}>
                  Sign In to Plan
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Stats */}
          <div className="rounded-[var(--radius-xl)] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Quick Facts
            </h3>
            <div className="space-y-3">
              {destination.averageDailyCost !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Avg. Daily Cost</span>
                  <span className="font-semibold text-slate-900">
                    {destination.currency || "$"}
                    {destination.averageDailyCost}
                  </span>
                </div>
              )}
              {destination.recommendedDays !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-slate-900">
                    {destination.recommendedDays} day
                    {destination.recommendedDays !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {destination.bestSeason && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Best Season</span>
                  <span className="font-semibold text-slate-900">
                    {destination.bestSeason}
                  </span>
                </div>
              )}
              {destination.rating !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Rating</span>
                  <span className="font-semibold text-slate-900">
                    {destination.rating.toFixed(1)} / 5
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Destinations */}
      {destination.category && (
        <div className="mt-16">
          <RelatedDestinations
            category={destination.category}
            currentSlug={destination.slug}
          />
        </div>
      )}
    </div>
  );
}
