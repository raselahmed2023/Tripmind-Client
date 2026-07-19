"use client";

import { useCallback, useEffect, useRef } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui";
import { DESTINATION_CATEGORIES, DESTINATION_SEASONS } from "@/types";

interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  category: string;
  country: string;
  bestSeason: string;
  minRating: string;
  minCost: string;
  maxCost: string;
  onCategoryChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onBestSeasonChange: (value: string) => void;
  onMinRatingChange: (value: string) => void;
  onMinCostChange: (value: string) => void;
  onMaxCostChange: (value: string) => void;
  onResetAll: () => void;
}

const RATING_OPTIONS = ["1", "2", "3", "4", "4.5"];
const DEBOUNCE_MS = 400;

function useDebouncedCallback(
  callback: (value: string) => void,
  delay: number
): (value: string) => void {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(value), delay);
    },
    [delay]
  );
}

function FilterContent({
  category,
  country,
  bestSeason,
  minRating,
  minCost,
  maxCost,
  onCategoryChange,
  onCountryChange,
  onBestSeasonChange,
  onMinRatingChange,
  onMinCostChange,
  onMaxCostChange,
  onResetAll,
}: Omit<FilterPanelProps, "isOpen" | "onToggle">) {
  const hasFilters =
    category || country || bestSeason || minRating || minCost || maxCost;

  const debouncedCountry = useDebouncedCallback(onCountryChange, DEBOUNCE_MS);
  const debouncedMinCost = useDebouncedCallback(onMinCostChange, DEBOUNCE_MS);
  const debouncedMaxCost = useDebouncedCallback(onMaxCostChange, DEBOUNCE_MS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        {hasFilters && (
          <button
            onClick={onResetAll}
            className="text-xs text-primary-500 hover:text-primary-600 font-medium"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <option value="">All Categories</option>
          {DESTINATION_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Country */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Country
        </label>
        <input
          type="text"
          value={country}
          onChange={(e) => debouncedCountry(e.target.value)}
          placeholder="e.g. France, Japan..."
          className="h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        />
      </div>

      {/* Best Season */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Best Season
        </label>
        <select
          value={bestSeason}
          onChange={(e) => onBestSeasonChange(e.target.value)}
          className="h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <option value="">Any Season</option>
          {DESTINATION_SEASONS.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Minimum Rating
        </label>
        <select
          value={minRating}
          onChange={(e) => onMinRatingChange(e.target.value)}
          className="h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <option value="">Any Rating</option>
          {RATING_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}+ Stars
            </option>
          ))}
        </select>
      </div>

      {/* Cost Range */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Daily Cost Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minCost}
            onChange={(e) => debouncedMinCost(e.target.value)}
            placeholder="Min"
            min="0"
            className="h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            value={maxCost}
            onChange={(e) => debouncedMaxCost(e.target.value)}
            placeholder="Max"
            min="0"
            className="h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );
}

export function FilterPanel(props: FilterPanelProps) {
  const { isOpen, onToggle } = props;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-[var(--radius-md)] border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 lg:hidden"
        aria-expanded={isOpen}
        aria-controls="filter-panel"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onToggle}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <button
                onClick={onToggle}
                className="rounded-[var(--radius-sm)] p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterContent {...props} />
            <div className="mt-6">
              <Button onClick={onToggle} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <FilterContent {...props} />
      </div>
    </>
  );
}
