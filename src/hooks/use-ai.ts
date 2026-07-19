"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiService } from "@/services";
import type { ApiError, GenerateItineraryRequest } from "@/types";

const ITINERARY_QUERY_KEY = ["itinerary"] as const;
const TRIPS_QUERY_KEY = ["trips"] as const;
const DASHBOARD_TRIPS_KEY = ["dashboard", "trips"] as const;
const DASHBOARD_NOTIFICATIONS_KEY = ["dashboard", "notifications"] as const;
const DASHBOARD_UNREAD_KEY = ["dashboard", "unread-count"] as const;
const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

function getAiFriendlyError(error: unknown): string {
  const apiError = error as ApiError;
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "You appear to be offline. Please check your connection and try again.";
  }
  if (apiError?.status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (apiError?.status === 402) {
    return "Please purchase the AI Trip Plan for this trip before generating an itinerary.";
  }
  if (apiError?.status === 409) {
    return "An itinerary is already being generated for this trip. Please wait.";
  }
  if (apiError?.status === 403) {
    return "You don't have permission to generate itineraries.";
  }
  if (apiError?.status === 404) {
    return "Trip not found. Please make sure the trip exists.";
  }
  if (apiError?.status && apiError.status >= 500) {
    return "The AI planning service is temporarily busy. Please try again shortly.";
  }
  if (apiError?.errors) {
    const firstError = Object.values(apiError.errors)[0];
    if (firstError && firstError.length > 0) return firstError[0];
  }
  return apiError?.message || "Generation failed. Please try again.";
}

export function useItinerary(itineraryId?: string | null) {
  return useQuery({
    queryKey: [...ITINERARY_QUERY_KEY, itineraryId],
    queryFn: () => aiService.getItinerary(itineraryId!),
    enabled: !!itineraryId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      const status = (error as unknown as ApiError)?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useGenerateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateItineraryRequest) => aiService.generateItinerary(data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [...ITINERARY_QUERY_KEY, data.itinerary._id],
        data.itinerary
      );
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TRIPS_QUERY_KEY, variables.tripId] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_TRIPS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_UNREAD_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}

export { getAiFriendlyError };
