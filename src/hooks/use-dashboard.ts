"use client";

import { useQueries } from "@tanstack/react-query";
import { tripService, notificationService, subscriptionService } from "@/services";

const DASHBOARD_TRIPS_KEY = ["dashboard", "trips"] as const;
const DASHBOARD_NOTIFICATIONS_KEY = ["dashboard", "notifications"] as const;
const DASHBOARD_UNREAD_KEY = ["dashboard", "unread-count"] as const;
const DASHBOARD_SUBSCRIPTION_KEY = ["dashboard", "subscription"] as const;

export function useDashboardData() {
  const results = useQueries({
    queries: [
      {
        queryKey: DASHBOARD_TRIPS_KEY,
        queryFn: () => tripService.getAll({ limit: 20 }),
        staleTime: 30 * 1000,
      },
      {
        queryKey: DASHBOARD_NOTIFICATIONS_KEY,
        queryFn: () => notificationService.getAll({ limit: 5, sort: "-createdAt" }),
        staleTime: 30 * 1000,
      },
      {
        queryKey: DASHBOARD_UNREAD_KEY,
        queryFn: () => notificationService.getUnreadCount(),
        staleTime: 30 * 1000,
      },
      {
        queryKey: DASHBOARD_SUBSCRIPTION_KEY,
        queryFn: () => subscriptionService.getMe(),
        staleTime: 30 * 1000,
      },
    ],
  });

  return {
    trips: results[0],
    notifications: results[1],
    unreadCount: results[2],
    subscription: results[3],
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
  };
}
