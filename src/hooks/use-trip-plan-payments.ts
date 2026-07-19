"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripPlanPaymentService } from "@/services";
import type { ApiError } from "@/types";

const TRIP_PLAN_STATUS_KEY = "trip-plan-status" as const;

export function useTripPlanStatus(tripId: string | undefined) {
  return useQuery({
    queryKey: [TRIP_PLAN_STATUS_KEY, tripId],
    queryFn: () => tripPlanPaymentService.getStatus(tripId!),
    enabled: !!tripId,
    staleTime: 10 * 1000,
  });
}

export function useCreateTripPlanCheckout() {
  return useMutation({
    mutationFn: (tripId: string) => tripPlanPaymentService.createCheckout(tripId),
  });
}

export function useVerifyTripPlanPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => tripPlanPaymentService.verifyPayment(sessionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [TRIP_PLAN_STATUS_KEY, data.tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function getTripPlanPaymentError(error: unknown): string {
  const apiError = error as ApiError;
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "You appear to be offline. Please check your connection.";
  }
  if (apiError?.status === 409) {
    return "A checkout session is already in progress.";
  }
  if (apiError?.status === 402) {
    return "Payment processing failed. Please try again.";
  }
  if (apiError?.status === 404) {
    return "Trip not found.";
  }
  if (apiError?.status && apiError.status >= 500) {
    return "Server error. Please try again later.";
  }
  return apiError?.message || "Something went wrong. Please try again.";
}
