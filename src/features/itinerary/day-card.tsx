"use client";

import { useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  Sun,
  CloudSun,
  Moon,
  Clock,
  DollarSign,
  MapPin,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/utils";
import type { ItineraryDay, ItineraryActivity } from "@/types";

interface DayCardProps {
  day: ItineraryDay;
  defaultExpanded?: boolean;
}

function ActivitySection({
  title,
  icon,
  activities,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  activities: ItineraryActivity[];
  color: string;
}) {
  if (activities.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full", color)}>
          {icon}
        </span>
        {title}
      </div>
      <div className="ml-8 space-y-2">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-md)] border border-slate-100 bg-slate-50 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {activity.time && (
                    <span className="text-xs font-medium text-slate-500">
                      {activity.time}
                    </span>
                  )}
                  <span className="font-medium text-slate-900">
                    {activity.title}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {activity.description}
                </p>
                {activity.location && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    {activity.location}
                  </p>
                )}
                {activity.tips && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                    <Lightbulb className="h-3 w-3" />
                    {activity.tips}
                  </p>
                )}
              </div>
              {activity.cost !== undefined && activity.cost > 0 && (
                <span className="shrink-0 text-sm font-medium text-slate-700">
                  ${activity.cost}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DayCard({ day, defaultExpanded = false }: DayCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
            {day.day}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{day.title}</h3>
            <p className="text-xs text-slate-500">{day.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1 text-sm text-slate-600 sm:flex">
            <DollarSign className="h-3.5 w-3.5" />
            {day.estimatedCost}
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <CardContent className="border-t border-slate-100 pt-4 space-y-4">
          <ActivitySection
            title="Morning"
            icon={<Sun className="h-3.5 w-3.5 text-amber-600" />}
            activities={day.morning}
            color="bg-amber-100"
          />
          <ActivitySection
            title="Afternoon"
            icon={<CloudSun className="h-3.5 w-3.5 text-orange-600" />}
            activities={day.afternoon}
            color="bg-orange-100"
          />
          <ActivitySection
            title="Evening"
            icon={<Moon className="h-3.5 w-3.5 text-indigo-600" />}
            activities={day.evening}
            color="bg-indigo-100"
          />

          <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
            {day.travelTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {day.travelTime} travel
              </span>
            )}
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              Est. ${day.estimatedCost}
            </span>
          </div>

          {day.notes && (
            <p className="text-sm italic text-slate-500">{day.notes}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
