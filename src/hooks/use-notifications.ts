"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services";
import type { NotificationQueryParams, Notification } from "@/types";

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;
const UNREAD_COUNT_KEY = ["notifications", "unread-count"] as const;
const DASHBOARD_NOTIFICATIONS_KEY = ["dashboard", "notifications"] as const;
const DASHBOARD_UNREAD_KEY = ["dashboard", "unread-count"] as const;

export function useNotifications(params?: NotificationQueryParams) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => notificationService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export function useRecentNotifications(limit = 5) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, "recent", limit],
    queryFn: () =>
      notificationService.getAll({
        limit,
        sort: "newest",
      }),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: notificationService.getUnreadCount,
    staleTime: 30 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: UNREAD_COUNT_KEY });

      const previousNotifications = queryClient.getQueriesData({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previousUnread = queryClient.getQueryData<number>(UNREAD_COUNT_KEY);

      queryClient.setQueriesData(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (old: unknown) => {
          if (!old || typeof old !== "object") return old;
          const data = old as { data: Notification[] };
          if (!Array.isArray(data.data)) return old;
          return {
            ...data,
            data: data.data.map((n) =>
              n._id === id ? { ...n, isRead: true } : n
            ),
          };
        }
      );

      queryClient.setQueryData<number>(UNREAD_COUNT_KEY, (old) =>
        old !== undefined ? Math.max(0, old - 1) : old
      );

      return { previousNotifications, previousUnread };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        for (const [key, data] of context.previousNotifications) {
          queryClient.setQueryData(key, data);
        }
      }
      if (context?.previousUnread !== undefined) {
        queryClient.setQueryData(UNREAD_COUNT_KEY, context.previousUnread);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_UNREAD_KEY });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: UNREAD_COUNT_KEY });

      const previousUnread = queryClient.getQueryData<number>(UNREAD_COUNT_KEY);

      queryClient.setQueryData<number>(UNREAD_COUNT_KEY, 0);

      queryClient.setQueriesData(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (old: unknown) => {
          if (!old || typeof old !== "object") return old;
          const data = old as { data: Notification[] };
          if (!Array.isArray(data.data)) return old;
          return {
            ...data,
            data: data.data.map((n) => ({ ...n, isRead: true })),
          };
        }
      );

      return { previousUnread };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousUnread !== undefined) {
        queryClient.setQueryData(UNREAD_COUNT_KEY, context.previousUnread);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_UNREAD_KEY });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.deleteOne(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previousNotifications = queryClient.getQueriesData({ queryKey: NOTIFICATIONS_QUERY_KEY });

      queryClient.setQueriesData(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (old: unknown) => {
          if (!old || typeof old !== "object") return old;
          const data = old as { data: Notification[] };
          if (!Array.isArray(data.data)) return old;
          return {
            ...data,
            data: data.data.filter((n) => n._id !== id),
          };
        }
      );

      return { previousNotifications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        for (const [key, data] of context.previousNotifications) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_UNREAD_KEY });
    },
  });
}

export function useClearReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.clearRead(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_UNREAD_KEY });
    },
  });
}
