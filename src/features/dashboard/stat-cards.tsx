import {
  MapPin,
  Calendar,
  CheckCircle,
  Bell,
} from "lucide-react";
import type { Trip } from "@/types";
import { StatCard } from "./stat-card";

interface StatCardsProps {
  trips: Trip[];
  unreadCount: number;
  isLoading: boolean;
}

function getUpcomingCount(trips: Trip[]): number {
  const now = new Date();
  return trips.filter((t) => {
    const start = new Date(t.startDate);
    return (t.status === "planned" || t.status === "ongoing" || t.status === "draft") && start >= now;
  }).length;
}

function getCompletedCount(trips: Trip[]): number {
  return trips.filter((t) => t.status === "completed").length;
}

export function StatCards({
  trips,
  unreadCount,
  isLoading,
}: StatCardsProps) {
  const totalTrips = trips.length;
  const upcoming = getUpcomingCount(trips);
  const completed = getCompletedCount(trips);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={<MapPin className="h-5 w-5" />}
        label="Total Trips"
        value={totalTrips}
        description="Across all destinations"
        accent="primary"
        isLoading={isLoading}
      />
      <StatCard
        icon={<Calendar className="h-5 w-5" />}
        label="Upcoming"
        value={upcoming}
        description="Trips yet to start"
        accent="secondary"
        isLoading={isLoading}
      />
      <StatCard
        icon={<CheckCircle className="h-5 w-5" />}
        label="Completed"
        value={completed}
        description="Trips finished"
        accent="accent"
        isLoading={isLoading}
      />
      <StatCard
        icon={<Bell className="h-5 w-5" />}
        label="Unread"
        value={unreadCount}
        description="New notifications"
        accent="secondary"
        isLoading={isLoading}
      />
    </div>
  );
}
