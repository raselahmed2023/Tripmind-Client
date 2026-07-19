"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Compass, Route, Calendar } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <div className="rounded-[var(--radius-xl)] bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 p-6 text-white sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary-100">
            <Calendar className="mr-1 inline h-4 w-4" />
            {getFormattedDate()}
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            {getGreeting()}, {userName}
          </h1>
          <p className="mt-2 max-w-lg text-primary-100">
            Your next adventure is just a plan away. Let AI help you craft the
            perfect itinerary.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link href="/planner">
            <Button variant="accent" leftIcon={<Route className="h-4 w-4" />}>
              Plan a Trip
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              leftIcon={<Compass className="h-4 w-4" />}
            >
              Explore
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
