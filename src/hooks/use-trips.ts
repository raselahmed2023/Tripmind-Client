"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripService } from "@/services";
import type { TripQueryParams, CreateTripRequest, UpdateTripRequest, ApiError } from "@/types";

const TRIPS_QUERY_KEY = ["trips"] as const;
const DASHBOARD_TRIPS_KEY = ["dashboard", "trips"] as const;

export function useTrips(params?: TripQueryParams) {
  return useQuery({
    queryKey: [...TRIPS_QUERY_KEY, params],
    queryFn: () => tripService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: [...TRIPS_QUERY_KEY, id],
    queryFn: () => tripService.getById(id),
    enabled: !!id,
    retry: (failureCount, error) => {
      const status = (error as unknown as ApiError)?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTripRequest) => tripService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_TRIPS_KEY });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTripRequest }) =>
      tripService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TRIPS_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_TRIPS_KEY });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tripService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_TRIPS_KEY });
    },
  });
}

export function getFriendlyError(error: unknown): string {
  if (!error) {
    return "";
  }

  const apiError = error as ApiError;

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "You appear to be offline. Please check your connection.";
  }

  if (apiError?.status === 401) {
    return "Please log in again.";
  }

  if (apiError?.status === 403) {
    return "You don't have permission to perform this action.";
  }

  if (apiError?.status === 404) {
    return "The requested resource was not found.";
  }

  if (apiError?.status === 429) {
    return "Too many requests. Please wait a moment.";
  }

  if (apiError?.status && apiError.status >= 500) {
    return "Server error. Please try again later.";
  }

  if (apiError?.errors) {
    const firstError = Object.values(apiError.errors)[0];

    if (firstError?.length) {
      return firstError[0];
    }
  }

  return apiError?.message || "An unexpected error occurred.";
}