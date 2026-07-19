"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Button, Card, CardContent, Alert } from "@/components/ui";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useClearReadNotifications,
  useUnreadNotificationCount,
} from "@/hooks";
import type { Notification } from "@/types";

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getNotificationIcon(type: string) {
  if (type.includes("ai_generation")) return "🤖";
  if (type.includes("trip")) return "✈️";
  if (type.includes("payment")) return "💳";
  if (type.includes("subscription")) return "⭐";
  if (type.includes("budget")) return "💰";
  return "📌";
}

function getNotificationLink(notification: Notification): string | null {
  if (notification.link) return notification.link;
  if (notification.relatedTripId) return `/trips/${notification.relatedTripId}`;
  return null;
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const limit = 20;

  const { data, isLoading, error, refetch } = useNotifications({
    page,
    limit,
    unreadOnly: filter === "unread" ? true : undefined,
  });

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const clearRead = useClearReadNotifications();
  const { data: unreadCount } = useUnreadNotificationCount();

  const notifications = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleMarkRead = useCallback(
    (id: string) => {
      markRead.mutate(id);
    },
    [markRead]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteNotification.mutate(id);
    },
    [deleteNotification]
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Alert variant="error">
          <div className="flex items-center justify-between">
            <span>Failed to load notifications.</span>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          {unreadCount !== undefined && unreadCount > 0 && (
            <p className="mt-1 text-sm text-slate-500">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending || !unreadCount}
            leftIcon={<CheckCheck className="h-4 w-4" />}
          >
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearRead.mutate()}
            disabled={clearRead.isPending}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Clear Read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        <button
          onClick={() => { setFilter("all"); setPage(1); }}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-primary-100 text-primary-700"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          All
        </button>
        <button
          onClick={() => { setFilter("unread"); setPage(1); }}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            filter === "unread"
              ? "bg-primary-100 text-primary-700"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          Unread {unreadCount ? `(${unreadCount})` : ""}
        </button>
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-700">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {filter === "unread"
                ? "You're all caught up!"
                : "When you get notifications, they'll appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const link = getNotificationLink(notification);
            const notifId = notification._id;

            return (
              <Card
                key={notifId}
                className={`transition-colors ${
                  !notification.read ? "border-primary-200 bg-primary-50/30" : ""
                }`}
              >
                <CardContent className="flex items-start gap-3 py-4">
                  <span className="mt-0.5 text-lg">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${!notification.read ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                      <span>{formatTimeAgo(notification.createdAt)}</span>
                      {link && (
                        <Link
                          href={link}
                          className="text-primary-500 hover:text-primary-600 font-medium"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkRead(notifId)}
                        disabled={markRead.isPending}
                        aria-label="Mark as read"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notifId)}
                      disabled={deleteNotification.isPending}
                      aria-label="Delete notification"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages} ({total} notification{total !== 1 ? "s" : ""})
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
