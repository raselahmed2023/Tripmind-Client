"use client";

import { useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Lightbulb,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import type { ItineraryDay, ItineraryActivity } from "@/types";

interface DayCardProps {
  day: ItineraryDay;
  defaultExpanded?: boolean;
}

function ActivityItem({ activity }: { activity: ItineraryActivity }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {(activity.startTime || activity.endTime) && (
              <span className="text-xs font-medium text-slate-500">
                {activity.startTime}{activity.endTime ? ` – ${activity.endTime}` : ""}
              </span>
            )}
            <span className="font-medium text-slate-900">
              {activity.title}
            </span>
          </div>
          {activity.description && (
            <p className="mt-1 text-sm text-slate-600">
              {activity.description}
            </p>
          )}
          {activity.location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              {activity.location}
            </p>
          )}
          {activity.notes && (
            <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
              <Lightbulb className="h-3 w-3" />
              {activity.notes}
            </p>
          )}
          {activity.category && (
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <Tag className="h-3 w-3" />
              {activity.category}
            </p>
          )}
        </div>
        {activity.estimatedCost !== undefined && activity.estimatedCost > 0 && (
          <span className="shrink-0 text-sm font-medium text-slate-700">
            ${activity.estimatedCost}
          </span>
        )}
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
            {day.dayNumber}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{day.title}</h3>
            <p className="text-xs text-slate-500">{day.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1 text-sm text-slate-600 sm:flex">
            <Clock className="h-3.5 w-3.5" />
            {day.activities.length} activit{day.activities.length !== 1 ? "ies" : "y"}
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <CardContent className="border-t border-slate-100 pt-4 space-y-3">
          {day.activities.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No activities planned for this day.</p>
          ) : (
            day.activities.map((activity, i) => (
              <ActivityItem key={i} activity={activity} />
            ))
          )}
        </CardContent>
      )}
    </Card>
  );
}
