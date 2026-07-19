"use client";

import { useQuery } from "@tanstack/react-query";
import { destinationService } from "@/services";
import type { DestinationQueryParams, ApiError } from "@/types";

const DESTINATIONS_QUERY_KEY = ["destinations"] as const;

export function useDestinations(params?: DestinationQueryParams) {
  return useQuery({
    queryKey: [...DESTINATIONS_QUERY_KEY, params],
    queryFn: () => destinationService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDestinationBySlug(slug: string) {
  return useQuery({
    queryKey: [...DESTINATIONS_QUERY_KEY, "slug", slug],
    queryFn: () => destinationService.getBySlug(slug),
    enabled: !!slug,
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError;
      if (apiError?.status === 404) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });
}
