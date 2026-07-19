"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services";

const SUBSCRIPTION_QUERY_KEY = ["subscription", "me"] as const;

export function useSubscription() {
  return useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: () => subscriptionService.getMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
