"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services";
import type { ApiError, CreateCheckoutSessionRequest } from "@/types";

const PAYMENTS_QUERY_KEY = ["payments"] as const;
const SUBSCRIPTION_QUERY_KEY = ["subscription", "me"] as const;
const DASHBOARD_SUBSCRIPTION_KEY = ["dashboard", "subscription"] as const;

export function usePayments() {
  return useQuery({
    queryKey: PAYMENTS_QUERY_KEY,
    queryFn: () => paymentService.getMe(),
    staleTime: 60 * 1000,
    retry: (failureCount, error) => {
      const status = (error as unknown as ApiError)?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation<
    { sessionId: string; url: string },
    ApiError,
    CreateCheckoutSessionRequest
  >({
    mutationFn: paymentService.createCheckoutSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_SUBSCRIPTION_KEY });
    },
  });
}

export function useCreatePortalSession() {
  return useMutation<{ url: string }, ApiError, void>({
    mutationFn: () => paymentService.createPortalSession(),
  });
}

export function usePaymentSuccessPoll() {
  const queryClient = useQueryClient();

  return {
    refetchAll: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_SUBSCRIPTION_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "trips"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "unread-count"] });
    },
  };
}
