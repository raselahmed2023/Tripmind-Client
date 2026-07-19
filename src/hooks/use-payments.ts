"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services";
import type { CreateCheckoutSessionRequest } from "@/types";

const PAYMENTS_QUERY_KEY = ["payments"] as const;

export function usePayments(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, params],
    queryFn: () => paymentService.getAll(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (data: CreateCheckoutSessionRequest) =>
      paymentService.createCheckoutSession(data),
  });
}

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: () => paymentService.createPortalSession(),
  });
}

export function usePaymentSuccessPoll(sessionId: string, enabled = false) {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, "success", sessionId],
    queryFn: () => paymentService.getAll({ page: 1, limit: 1 }),
    enabled,
    refetchInterval: 2000,
    refetchIntervalInBackground: false,
    retry: 10,
    staleTime: 0,
  });
}
