"use client";

import { X } from "lucide-react";

interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  chips: FilterChip[];
  onClearAll: () => void;
}

export function ActiveFilters({ chips, onClearAll }: ActiveFiltersProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-500">Active:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-0.5 rounded-full p-0.5 hover:bg-primary-100"
            aria-label={`Remove filter: ${chip.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
