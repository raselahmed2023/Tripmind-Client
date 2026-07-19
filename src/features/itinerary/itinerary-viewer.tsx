"use client";

import { useState, useCallback } from "react";
import {
  Calendar,
  DollarSign,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Luggage,
  Cloud,
  Utensils,
  Building,
  Car,
  ChevronDown,
  ChevronUp,
  List,
  Grid,
} from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { cn } from "@/utils";
import { DayCard } from "./day-card";
import type { Itinerary } from "@/types";

interface ItineraryViewerProps {
  itinerary: Itinerary;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>
      {open && <CardContent className="border-t border-slate-100 pt-4">{children}</CardContent>}
    </Card>
  );
}

function BudgetBar({
  label,
  amount,
  total,
  color,
}: {
  label: string;
  amount: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">${amount.toLocaleString()}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ItineraryViewer({ itinerary }: ItineraryViewerProps) {
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleAll = useCallback(() => setAllExpanded((prev) => !prev), []);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-2 text-xl font-bold text-slate-900">{itinerary.title}</h2>
          <p className="text-sm leading-relaxed text-slate-600">{itinerary.overview}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {itinerary.days.length} days
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              ${itinerary.budget.total.toLocaleString()} total
            </span>
            {itinerary.generatedAt && (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Generated {new Date(itinerary.generatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget Breakdown */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <DollarSign className="h-5 w-5 text-primary-500" />
            Budget Breakdown
          </h3>
          <div className="space-y-3">
            <BudgetBar label="Accommodation" amount={itinerary.budget.accommodation} total={itinerary.budget.total} color="bg-blue-500" />
            <BudgetBar label="Transportation" amount={itinerary.budget.transportation} total={itinerary.budget.total} color="bg-green-500" />
            <BudgetBar label="Food & Drinks" amount={itinerary.budget.food} total={itinerary.budget.total} color="bg-orange-500" />
            <BudgetBar label="Activities" amount={itinerary.budget.activities} total={itinerary.budget.total} color="bg-purple-500" />
            <BudgetBar label="Miscellaneous" amount={itinerary.budget.miscellaneous} total={itinerary.budget.total} color="bg-slate-400" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="font-semibold text-slate-900">Total Estimated</span>
            <span className="text-lg font-bold text-slate-900">
              {itinerary.budget.currency}{itinerary.budget.total.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Weather */}
      {itinerary.weather && itinerary.weather.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Cloud className="h-5 w-5 text-primary-500" />
              Weather Forecast
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {itinerary.weather.map((w) => (
                <div key={w.day} className="rounded-[var(--radius-md)] bg-slate-50 p-3 text-center">
                  <p className="text-xs font-medium text-slate-500">Day {w.day}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {w.temperature.high}° / {w.temperature.low}°
                  </p>
                  <p className="text-xs text-slate-500">{w.condition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Days Timeline */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Daily Timeline</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAll}
            leftIcon={allExpanded ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </Button>
        </div>
        <div className="space-y-3">
          {itinerary.days.map((day) => (
            <DayCard key={day.day} day={day} defaultExpanded={allExpanded} />
          ))}
        </div>
      </div>

      {/* Hotels */}
      {itinerary.hotels.length > 0 && (
        <CollapsibleSection
          title="Recommended Hotels"
          icon={<Building className="h-5 w-5 text-primary-500" />}
        >
          <div className="space-y-3">
            {itinerary.hotels.map((hotel, i) => (
              <div key={i} className="rounded-[var(--radius-md)] border border-slate-100 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{hotel.name}</p>
                    <p className="text-sm text-slate-500">{hotel.description}</p>
                    {hotel.location && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {hotel.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">${hotel.pricePerNight}/night</p>
                    <p className="text-xs text-slate-500">★ {hotel.rating}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Restaurants */}
      {itinerary.restaurants.length > 0 && (
        <CollapsibleSection
          title="Restaurant Recommendations"
          icon={<Utensils className="h-5 w-5 text-primary-500" />}
        >
          <div className="space-y-3">
            {itinerary.restaurants.map((r, i) => (
              <div key={i} className="rounded-[var(--radius-md)] border border-slate-100 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{r.name}</p>
                    <p className="text-sm text-slate-500">{r.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {r.cuisine} · {r.priceRange}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Transportation */}
      {itinerary.transportation.length > 0 && (
        <CollapsibleSection
          title="Transportation"
          icon={<Car className="h-5 w-5 text-primary-500" />}
        >
          <div className="space-y-3">
            {itinerary.transportation.map((t, i) => (
              <div key={i} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-slate-100 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <Car className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {t.from} → {t.to}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t.mode} · {t.duration}
                  </p>
                </div>
                <span className="text-sm font-medium text-slate-700">${t.cost}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Tips */}
      {itinerary.tips.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Travel Tips
            </h3>
            <ul className="space-y-2">
              {itinerary.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {itinerary.warnings.length > 0 && (
        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Important Warnings
            </h3>
            <ul className="space-y-2">
              {itinerary.warnings.map((warning, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Packing Suggestions */}
      {itinerary.packingSuggestions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Luggage className="h-5 w-5 text-primary-500" />
              Packing Suggestions
            </h3>
            <div className="flex flex-wrap gap-2">
              {itinerary.packingSuggestions.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
