"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  MapPin,
  Calendar,
  DollarSign,
  Route,
  Pencil,
  Trash2,
  Tag,
  StickyNote,
  AlertTriangle,
  RefreshCw,
  Ban,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { TripStatusBadge } from "@/components/trip";
import { useTrip, useUpdateTrip, useSubscription, useItinerary, useGenerateItinerary, getAiFriendlyError } from "@/hooks";
import { ItineraryViewer, GenerationDialog, CreditsDisplay } from "@/features/itinerary";
import { DeleteTripModal } from "./delete-trip-modal";
import type { TripStatus } from "@/types";

interface TripDetailProps {
  tripId: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
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

export function TripDetail({ tripId }: TripDetailProps) {
  const router = useRouter();
  const { data: trip, isLoading, error, refetch } = useTrip(tripId);
  const updateTrip = useUpdateTrip();
  const { data: subscription } = useSubscription();
  const { data: itinerary } = useItinerary(trip?.itineraryId);
  const generateMutation = useGenerateItinerary();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);

  const creditsRemaining = subscription?.aiCreditsRemaining ?? 0;
  const creditsRequired = 1;

  const handleCancel = useCallback(async () => {
    if (!trip) return;
    try {
      await updateTrip.mutateAsync({
        id: trip._id,
        data: { status: "cancelled" as TripStatus },
      });
    } catch {
      // Error handled by mutation
    }
  }, [trip, updateTrip]);

  const handleGenerate = useCallback(async () => {
    if (!trip) return;
    try {
      await generateMutation.mutateAsync({ tripId: trip._id });
      setShowGenerateDialog(false);
      setShowItinerary(true);
    } catch {
      // Error handled by mutation
    }
  }, [trip, generateMutation]);

  const handleRetry = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
              <div className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
            </div>
            <div className="h-48 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    const is403 = (error as { status?: number })?.status === 403;
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {is403 ? "Access Denied" : "Trip Not Found"}
          </h1>
          <p className="mt-2 max-w-md text-slate-600">
            {is403
              ? "You don't have permission to view this trip."
              : "The trip you're looking for doesn't exist or has been removed."}
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
          <Link href="/trips">
            <Button variant="outline">Back to Trips</Button>
          </Link>
        </div>
      </div>
    );
  }

  const dest = trip.destination;
  const duration = getDurationDays(trip.startDate, trip.endDate);
  const dailyBudget =
    duration > 0 && trip.budget > 0
      ? Math.round(trip.budget / duration)
      : 0;
  const isEditable = trip.status !== "completed" && trip.status !== "cancelled";
  const hasItinerary = !!trip.itineraryId || !!itinerary;
  const isGenerating = generateMutation.isPending;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/trips" className="hover:text-primary-500 transition-colors">
          My Trips
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-900">{trip.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <TripStatusBadge status={trip.status} />
          {hasItinerary && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
              <Route className="h-3 w-3" />
              Itinerary Ready
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {trip.title}
        </h1>
        {dest && (
          <p className="mt-2 flex items-center gap-2 text-lg text-slate-600">
            <MapPin className="h-5 w-5" />
            {dest.title}
            {dest.city ? `, ${dest.city}` : ""}
            {dest.country ? `, ${dest.country}` : ""}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itinerary Viewer */}
          {showItinerary && itinerary && (
            <section>
              <ItineraryViewer itinerary={itinerary} />
            </section>
          )}

          {/* Itinerary Loading */}
          {isGenerating && (
            <Card>
              <CardContent className="flex items-center gap-3 py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500" />
                <span className="text-sm text-slate-600">
                  Generating your personalized itinerary...
                </span>
              </CardContent>
            </Card>
          )}

          {/* Itinerary placeholder when not showing viewer */}
          {!showItinerary && !isGenerating && (
            <>
              {/* Travel Dates */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    Travel Dates
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase text-slate-500">Start</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDate(trip.startDate)}
                      </p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase text-slate-500">End</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDate(trip.endDate)}
                      </p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase text-slate-500">Duration</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {duration} day{duration !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Overview */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary-500" />
                    Budget Overview
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase text-slate-500">Total Budget</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {trip.currency}{trip.budget.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase text-slate-500">Daily Budget</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {dailyBudget > 0
                          ? `${trip.currency}${dailyBudget.toLocaleString()}/day`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase text-slate-500">Estimated Cost</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {trip.estimatedCost > 0
                          ? `${trip.currency}${trip.estimatedCost.toLocaleString()}`
                          : "Not estimated"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary-500" />
                    Preferences
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase text-slate-500">Travel Style</p>
                      <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
                        {trip.travelStyle}
                      </p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase text-slate-500">Travelers</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {trip.travelers} traveler{trip.travelers !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {trip.accommodationPreference && (
                      <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase text-slate-500">Accommodation</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {trip.accommodationPreference}
                        </p>
                      </div>
                    )}
                    {trip.transportPreference && (
                      <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase text-slate-500">Transport</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {trip.transportPreference}
                        </p>
                      </div>
                    )}
                  </div>
                  {trip.interests.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium uppercase text-slate-500">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {trip.interests.map((interest) => (
                          <span
                            key={interest}
                            className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              {trip.notes && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <StickyNote className="h-5 w-5 text-primary-500" />
                      Notes
                    </h2>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                      {trip.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Itinerary Status */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary-500" />
                    Itinerary
                  </h2>
                  {hasItinerary ? (
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                        <Route className="h-4 w-4" />
                        Itinerary is ready
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowItinerary(true)}
                        leftIcon={<BookOpen className="h-4 w-4" />}
                      >
                        View Itinerary
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">
                      <p>No itinerary generated yet.</p>
                      <Button
                        className="mt-3"
                        onClick={() => setShowGenerateDialog(true)}
                        disabled={creditsRemaining < creditsRequired}
                        leftIcon={<Sparkles className="h-4 w-4" />}
                      >
                        Generate AI Itinerary
                      </Button>
                      {creditsRemaining < creditsRequired && (
                        <p className="mt-2 text-xs text-red-600">
                          You don&apos;t have enough AI credits.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Show "Back to trip details" when itinerary is shown */}
          {showItinerary && itinerary && (
            <Button
              variant="ghost"
              onClick={() => setShowItinerary(false)}
              leftIcon={<ChevronRight className="h-4 w-4 rotate-180" />}
            >
              Back to Trip Details
            </Button>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Actions</h3>
              <div className="space-y-2">
                {isEditable && (
                  <Link href={`/trips/${trip._id}/edit`} className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      leftIcon={<Pencil className="h-4 w-4" />}
                    >
                      Edit Trip
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<Sparkles className="h-4 w-4" />}
                  onClick={() => setShowGenerateDialog(true)}
                  disabled={isGenerating || creditsRemaining < creditsRequired}
                  isLoading={isGenerating}
                >
                  {hasItinerary ? "Regenerate Itinerary" : "Generate AI Itinerary"}
                </Button>
                <CreditsDisplay remaining={creditsRemaining} total={subscription?.aiCreditsTotal ?? 0} />
                {isEditable && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                    leftIcon={<Ban className="h-4 w-4" />}
                    onClick={handleCancel}
                    isLoading={updateTrip.isPending}
                  >
                    Cancel Trip
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Trip
                </Button>
                <Link href="/trips" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Back to My Trips
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Facts */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <TripStatusBadge status={trip.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Travelers</span>
                  <span className="font-medium text-slate-900">{trip.travelers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Budget</span>
                  <span className="font-medium text-slate-900">
                    {trip.currency}{trip.budget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Style</span>
                  <span className="font-medium capitalize text-slate-900">
                    {trip.travelStyle}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generation Dialog */}
      <GenerationDialog
        isOpen={showGenerateDialog}
        onClose={() => setShowGenerateDialog(false)}
        onConfirm={handleGenerate}
        isGenerating={isGenerating}
        error={generateMutation.error ? getAiFriendlyError(generateMutation.error) : null}
        onRetry={handleRetry}
        creditsRemaining={creditsRemaining}
        creditsRequired={creditsRequired}
        tripTitle={trip.title}
      />

      <DeleteTripModal
        trip={trip}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={() => router.push("/trips")}
      />
    </div>
  );
}
