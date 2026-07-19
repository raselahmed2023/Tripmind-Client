"use client";

import { useAuth } from "@/hooks";
import { useDashboardData } from "@/hooks";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui";
import { RefreshCw } from "lucide-react";
import {
  WelcomeHeader,
  StatCards,
  RecentTrips,
  UpcomingTrip,
  NotificationsPreview,
  QuickActions,
  TripsChart,
  BudgetChart,
} from "@/features/dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    trips: tripsResult,
    notifications: notificationsResult,
    unreadCount: unreadCountResult,
    isError: hasError,
  } = useDashboardData();

  const tripList = tripsResult.data?.data ?? [];
  const notifications = notificationsResult.data?.data ?? [];
  const unreadCount = unreadCountResult.data ?? 0;
  const tripsLoading = tripsResult.isLoading;
  const tripsError = tripsResult.error;
  const notificationsLoading = notificationsResult.isLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {hasError && (
        <Alert variant="error" className="mb-6">
          <div className="flex items-center justify-between">
            <span>Some data could not be loaded. You can retry or continue with partial data.</span>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      <section aria-label="Welcome">
        <WelcomeHeader userName={user?.name ?? "Traveler"} />
      </section>

      <section aria-label="Statistics" className="mt-6">
        <StatCards
          trips={tripList}
          unreadCount={unreadCount}
          isLoading={tripsLoading}
        />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section aria-label="Recent trips">
            <RecentTrips
              trips={tripList}
              isLoading={tripsLoading}
              error={!!tripsError}
            />
          </section>
        </div>
        <div className="space-y-6">
          <section aria-label="Upcoming trip">
            <UpcomingTrip trips={tripList} isLoading={tripsLoading} />
          </section>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-label="Notifications">
          <NotificationsPreview
            notifications={notifications}
            unreadCount={unreadCount}
            isLoading={notificationsLoading}
          />
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-label="Trips by status chart">
          <TripsChart trips={tripList} isLoading={tripsLoading} />
        </section>
        <section aria-label="Budget overview chart">
          <BudgetChart trips={tripList} isLoading={tripsLoading} />
        </section>
      </div>

      <section aria-label="Quick actions" className="mt-6">
        <QuickActions />
      </section>
    </div>
  );
}
