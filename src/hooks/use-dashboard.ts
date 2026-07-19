"use client";

import { useQueries } from "@tanstack/react-query";
import { tripService, notificationService, subscriptionService } from "@/services";

export function useDashboardData() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "trips"] as const,
        queryFn: () => tripService.getAll({ page: 1, limit: 50 }),
        staleTime: 60 * 1000,
      },
      {
        queryKey: ["dashboard", "notifications"] as const,
        queryFn: () => notificationService.getAll({ limit: 5 }),
        staleTime: 30 * 1000,
      },
      {
        queryKey: ["dashboard", "unread-count"] as const,
        queryFn: () => notificationService.getUnreadCount(),
        staleTime: 30 * 1000,
      },
      {
        queryKey: ["dashboard", "subscription"] as const,
        queryFn: () => subscriptionService.getMe(),
        staleTime: 5 * 60 * 1000,
        retry: false,
      },
    ],
  });

  const [tripsResult, notificationsResult, unreadCountResult, subscriptionResult] = results;

  return {
    trips: tripsResult.data,
    tripsLoading: tripsResult.isLoading,
    tripsError: tripsResult.error,

    notifications: notificationsResult.data?.data ?? [],
    notificationsLoading: notificationsResult.isLoading,

    unreadCount: unreadCountResult.data ?? 0,
    unreadCountLoading: unreadCountResult.isLoading,

    subscription: subscriptionResult.data,
    subscriptionLoading: subscriptionResult.isLoading,

    isLoading: results.some((r) => r.isLoading),
    hasError: results.some((r) => r.isError),
  };
}
