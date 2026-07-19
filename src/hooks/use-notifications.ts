"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services";
import type { Notification, NotificationQueryParams, ApiError } from "@/types";

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;
const UNREAD_COUNT_QUERY_KEY = ["notifications", "unread-count"] as const;
const DASHBOARD_NOTIFICATIONS_KEY = ["dashboard", "notifications"] as const;
const DASHBOARD_UNREAD_KEY = ["dashboard", "unread-count"] as const;

export function useNotifications(params?: NotificationQueryParams) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params] as const,
    queryFn: () => notificationService.getAll(params),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useRecentNotifications(limit = 5) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, "recent", limit] as const,
    queryFn: () => notificationService.getAll({ limit }),
    staleTime: 30 * 1000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

interface MutationContext {
  previousNotifications: [unknown, unknown][];
  previousUnread: number | undefined;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string, MutationContext>({
    mutationFn: (id) => notificationService.markAsRead(id),
    onMutate: async (id): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });

      const previousNotifications = queryClient.getQueriesData({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      });
      const previousUnread = queryClient.getQueryData<number>(UNREAD_COUNT_QUERY_KEY);

      queryClient.setQueriesData(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (old: unknown) => {
          if (!old) return old;
          const data = (old as { data: Notification[] }).data;
          if (!data) return old;
          return {
            ...old,
            data: data.map((n) =>
              n._id === id ? { ...n, read: true } : n
            ),
          };
        }
      );

      queryClient.setQueryData(UNREAD_COUNT_QUERY_KEY, (old: number | undefined) => {
        return Math.max(0, (old || 1) - 1);
      });

      return { previousNotifications, previousUnread };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([key, data]) => {
          queryClient.setQueryData(key as readonly unknown[], data);
        });
      }
      if (context?.previousUnread !== undefined) {
        queryClient.setQueryData(UNREAD_COUNT_QUERY_KEY, context.previousUnread);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_UNREAD_KEY });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void, MutationContext>({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async (): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });

      const previousNotifications = queryClient.getQueriesData({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      });
      const previousUnread = queryClient.getQueryData<number>(UNREAD_COUNT_QUERY_KEY);

      queryClient.setQueriesData(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (old: unknown) => {
          if (!old) return old;
          const data = (old as { data: Notification[] }).data;
          if (!data) return old;
          return {
            ...old,
            data: data.map((n) => ({ ...n, read: true })),
          };
        }
      );

      queryClient.setQueryData(UNREAD_COUNT_QUERY_KEY, 0);

      return { previousNotifications, previousUnread };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([key, data]) => {
          queryClient.setQueryData(key as readonly unknown[], data);
        });
      }
      if (context?.previousUnread !== undefined) {
        queryClient.setQueryData(UNREAD_COUNT_QUERY_KEY, context.previousUnread);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_UNREAD_KEY });
    },
  });
}

interface DeleteContext {
  previousNotifications: [unknown, unknown][];
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string, DeleteContext>({
    mutationFn: (id) => notificationService.deleteOne(id),
    onMutate: async (id): Promise<DeleteContext> => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previousNotifications = queryClient.getQueriesData({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      });

      queryClient.setQueriesData(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (old: unknown) => {
          if (!old) return old;
          const data = (old as { data: Notification[] }).data;
          if (!data) return old;
          return {
            ...old,
            data: data.filter((n) => n._id !== id),
            total: (old as { total: number }).total - 1,
          };
        }
      );

      return { previousNotifications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([key, data]) => {
          queryClient.setQueryData(key as readonly unknown[], data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_UNREAD_KEY });
    },
  });
}

export function useClearReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError>({
    mutationFn: () => notificationService.clearRead(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_UNREAD_KEY });
    },
  });
}

export type { Notification };
