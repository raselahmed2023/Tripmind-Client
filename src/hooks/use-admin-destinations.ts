"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { destinationService } from "@/services";
import type { AdminDestinationQueryParams, CreateDestinationRequest, UpdateDestinationRequest, ApiError } from "@/types";

const DESTINATIONS_QUERY_KEY = ["destinations"] as const;

export function useAdminDestinations(params?: AdminDestinationQueryParams) {
  return useQuery({
    queryKey: [...DESTINATIONS_QUERY_KEY, "admin", params],
    queryFn: () => destinationService.getAdminAll(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDestinationRequest) => destinationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESTINATIONS_QUERY_KEY });
    },
  });
}

export function useUpdateDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDestinationRequest }) =>
      destinationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESTINATIONS_QUERY_KEY });
    },
  });
}

export function useDeleteDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => destinationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESTINATIONS_QUERY_KEY });
    },
  });
}

export function getAdminDestinationError(error: unknown): string {
  const apiError = error as ApiError;
  if (apiError?.errors) {
    const firstError = Object.values(apiError.errors)[0];
    if (firstError && firstError.length > 0) return firstError[0];
  }
  return apiError?.message || "An unexpected error occurred.";
}
