"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripService } from "@/services";
import type { ApiError, Trip, CreateTripRequest, UpdateTripRequest, TripQueryParams } from "@/types";

const TRIPS_QUERY_KEY = ["trips"] as const;
const DASHBOARD_TRIPS_KEY = ["dashboard", "trips"] as const;

function shouldRetry(failureCount: number, error: unknown): boolean {
  const status = (error as ApiError)?.status;
  if (status === 401 || status === 403 || status === 404) return false;
  return failureCount < 2;
}

function getFriendlyError(error: unknown): string {
  const apiError = error as ApiError;
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "You appear to be offline. Please check your connection.";
  }
  if (apiError?.status === 403) {
    return "You don't have permission to perform this action.";
  }
  if (apiError?.status === 404) {
    return "The trip could not be found.";
  }
  if (apiError?.status && apiError.status >= 500) {
    return "Something went wrong on our end. Please try again.";
  }
  if (apiError?.errors) {
    const firstError = Object.values(apiError.errors)[0];
    if (firstError && firstError.length > 0) return firstError[0];
  }
  return apiError?.message || "An unexpected error occurred. Please try again.";
}

export function useTrips(params?: TripQueryParams) {
  return useQuery({
    queryKey: [...TRIPS_QUERY_KEY, params],
    queryFn: () => tripService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
    retry: (failureCount, error) => shouldRetry(failureCount, error),
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: [...TRIPS_QUERY_KEY, id],
    queryFn: () => tripService.getById(id),
    enabled: !!id,
    retry: (failureCount, error) => shouldRetry(failureCount, error),
    staleTime: 60 * 1000,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation<Trip, ApiError, CreateTripRequest>({
    mutationFn: tripService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_TRIPS_KEY });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation<
    Trip,
    ApiError,
    { id: string; data: UpdateTripRequest }
  >({
    mutationFn: ({ id, data }) => tripService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...TRIPS_QUERY_KEY, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_TRIPS_KEY });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: tripService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_TRIPS_KEY });
    },
  });
}

export { getFriendlyError };
