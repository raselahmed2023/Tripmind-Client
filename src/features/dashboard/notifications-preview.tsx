import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "@/components/ui";
import { Skeleton } from "@/components/ui";
import {
  Bell,
  Info,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { Notification } from "@/types";

interface NotificationsPreviewProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

function formatTimestamp(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "ai_generation_completed":
    case "trip_updated":
    case "itinerary_finalized":
    case "payment_completed":
    case "ai_credits_added":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "ai_generation_failed":
    case "payment_failed":
    case "budget_warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "ai_generation_started":
    case "trip_starting_soon":
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <Info className="h-4 w-4 text-slate-400" />;
  }
}

function NotificationsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-3 w-8 shrink-0" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-8 text-center">
      <Bell className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 font-medium text-slate-700">No notifications</p>
      <p className="mt-1 text-sm text-slate-500">
        You are all caught up. New updates will appear here.
      </p>
    </div>
  );
}

export function NotificationsPreview({
  notifications,
  unreadCount,
  isLoading,
}: NotificationsPreviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <Link href="/notifications">
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <NotificationsSkeleton />
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-3 rounded-[var(--radius-md)] p-2 transition-colors ${
                  !notification.isRead ? "bg-primary-50/50" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${
                      !notification.isRead
                        ? "font-medium text-slate-900"
                        : "text-slate-700"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    {notification.message}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">
                  {formatTimestamp(notification.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
