"use client";

import { useState } from "react";
import {
  Calendar,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Clock,
  MapPin,
  ChevronDown,
  ChevronRight,
  Tag,
} from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";
import { cn } from "@/utils";
import type { Itinerary, ItineraryActivity } from "@/types";

interface ItineraryViewerProps {
  itinerary: Itinerary;
}

const categoryColors: Record<string, string> = {
  food: "bg-orange-100 text-orange-700",
  transport: "bg-blue-100 text-blue-700",
  accommodation: "bg-purple-100 text-purple-700",
  activity: "bg-green-100 text-green-700",
  sightseeing: "bg-teal-100 text-teal-700",
  shopping: "bg-pink-100 text-pink-700",
  default: "bg-slate-100 text-slate-700",
};

function ActivityCard({ activity }: { activity: ItineraryActivity }) {
  return (
    <div className="flex gap-3 rounded-[var(--radius-lg)] border border-slate-100 bg-slate-50 p-3">
      <div className="flex flex-col items-center gap-1 text-xs text-slate-500">
        <Clock className="h-3.5 w-3.5" />
        <span className="font-medium">{activity.startTime}</span>
        <span>{activity.endTime}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
          {activity.estimatedCost > 0 && (
            <span className="shrink-0 text-xs font-medium text-slate-600">
              ${activity.estimatedCost}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{activity.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px]", categoryColors[activity.category] || categoryColors.default)}>
            {activity.category}
          </Badge>
          {activity.location && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <MapPin className="h-3 w-3" />
              {activity.location}
            </span>
          )}
        </div>
        {activity.notes && (
          <p className="mt-1.5 text-[11px] italic text-slate-500">{activity.notes}</p>
        )}
      </div>
    </div>
  );
}

function DayCard({ day, defaultOpen = false }: { day: Itinerary["days"][0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const dayCost = day.activities.reduce((sum, a) => sum + a.estimatedCost, 0);

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
            {day.dayNumber}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{day.title}</h3>
            <p className="text-xs text-slate-500">
              {day.date} &middot; {day.activities.length} activities
              {dayCost > 0 && ` · ~$${dayCost}`}
            </p>
          </div>
        </div>
        {open ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
      </button>
      {open && (
        <div className="space-y-2 border-t border-slate-100 p-4">
          {day.activities.length === 0 ? (
            <p className="text-center text-sm text-slate-400">No activities planned.</p>
          ) : (
            day.activities.map((activity, idx) => (
              <ActivityCard key={idx} activity={activity} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function ItineraryViewer({ itinerary }: ItineraryViewerProps) {
  const totalCost = Object.values(itinerary.costBreakdown).reduce((sum, v) => sum + v, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold text-slate-900">Itinerary Summary</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{itinerary.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {itinerary.days.length} days
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              ~${totalCost} total
            </span>
            <Badge variant={itinerary.status === "draft" ? "accent" : itinerary.status === "finalized" ? "success" : "default"}>
              {itinerary.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      {Object.keys(itinerary.costBreakdown).length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary-500" />
              Cost Breakdown
            </h2>
            <div className="space-y-3">
              {Object.entries(itinerary.costBreakdown).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-600 capitalize">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-medium text-slate-900">${value}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Total</span>
                  <span className="text-sm font-bold text-slate-900">${totalCost}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Days */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Day-by-Day Plan</h2>
        <div className="space-y-3">
          {itinerary.days.map((day) => (
            <DayCard key={day.dayNumber} day={day} defaultOpen={day.dayNumber === 1} />
          ))}
        </div>
      </div>

      {/* Warnings */}
      {itinerary.warnings.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Warnings
            </h2>
            <ul className="space-y-2">
              {itinerary.warnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {itinerary.recommendations.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary-500" />
              Recommendations
            </h2>
            <ul className="space-y-2">
              {itinerary.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-400" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
