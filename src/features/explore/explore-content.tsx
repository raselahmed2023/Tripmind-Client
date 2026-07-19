"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { Search, X, Compass, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { useDestinations } from "@/hooks";
import { DestinationGrid } from "@/components/destination";
import { DestinationCardSkeleton } from "@/components/destination";
import { Pagination } from "@/components/ui";
import { FilterPanel } from "./filter-panel";
import { ActiveFilters } from "./active-filters";
import { DESTINATION_SORT_OPTIONS } from "@/types";
import type { DestinationSortOption } from "@/types";

function getSearchParams(params: URLSearchParams) {
  return {
    search: params.get("search") || "",
    category: params.get("category") || "",
    country: params.get("country") || "",
    bestSeason: params.get("bestSeason") || "",
    minRating: params.get("minRating") || "",
    minCost: params.get("minCost") || "",
    maxCost: params.get("maxCost") || "",
    sort: (params.get("sort") || "newest") as DestinationSortOption,
    page: parseInt(params.get("page") || "1", 10),
  };
}

export function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const resultsRef = useRef<HTMLDivElement>(null);

  const current = getSearchParams(searchParams);

  const [searchInput, setSearchInput] = useState(current.search);
  const [filterOpen, setFilterOpen] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === "" || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      if (updates.search !== undefined || updates.category !== undefined || updates.country !== undefined || updates.bestSeason !== undefined || updates.minRating !== undefined || updates.minCost !== undefined || updates.maxCost !== undefined || updates.sort !== undefined) {
        params.delete("page");
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(`/explore${qs ? `?${qs}` : ""}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateParams({ search: searchInput.trim() });
    },
    [searchInput, updateParams]
  );

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchInput("");
    updateParams({ search: "" });
  }, [updateParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      startTransition(() => {
        router.push(`/explore?${params.toString()}`, { scroll: false });
      });
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    },
    [router, searchParams, startTransition]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateParams({ sort: e.target.value });
    },
    [updateParams]
  );

  const resetAllFilters = useCallback(() => {
    setSearchInput("");
    startTransition(() => {
      router.push("/explore", { scroll: false });
    });
  }, [router, startTransition]);

  const removeFilter = useCallback(
    (key: string) => {
      updateParams({ [key]: "" });
    },
    [updateParams]
  );

  const queryParams = {
    page: current.page,
    limit: 12,
    ...(current.search && { search: current.search }),
    ...(current.category && { category: current.category }),
    ...(current.country && { country: current.country }),
    ...(current.bestSeason && { bestSeason: current.bestSeason }),
    ...(current.minRating && { minRating: Number(current.minRating) }),
    ...(current.minCost && { minCost: Number(current.minCost) }),
    ...(current.maxCost && { maxCost: Number(current.maxCost) }),
    ...(current.sort && { sort: current.sort }),
  };

  const { data, isLoading, error, refetch } = useDestinations(queryParams);

  const activeFilterChips: { key: string; label: string; onRemove: () => void }[] = [];

  if (current.search) {
    activeFilterChips.push({
      key: "search",
      label: `Search: ${current.search}`,
      onRemove: () => {
        setSearchInput("");
        removeFilter("search");
      },
    });
  }
  if (current.category) {
    activeFilterChips.push({
      key: "category",
      label: `Category: ${current.category}`,
      onRemove: () => removeFilter("category"),
    });
  }
  if (current.country) {
    activeFilterChips.push({
      key: "country",
      label: `Country: ${current.country}`,
      onRemove: () => removeFilter("country"),
    });
  }
  if (current.bestSeason) {
    activeFilterChips.push({
      key: "bestSeason",
      label: `Season: ${current.bestSeason}`,
      onRemove: () => removeFilter("bestSeason"),
    });
  }
  if (current.minRating) {
    activeFilterChips.push({
      key: "minRating",
      label: `Rating: ${current.minRating}+`,
      onRemove: () => removeFilter("minRating"),
    });
  }
  if (current.minCost) {
    activeFilterChips.push({
      key: "minCost",
      label: `Min cost: $${current.minCost}`,
      onRemove: () => removeFilter("minCost"),
    });
  }
  if (current.maxCost) {
    activeFilterChips.push({
      key: "maxCost",
      label: `Max cost: $${current.maxCost}`,
      onRemove: () => removeFilter("maxCost"),
    });
  }
  if (current.sort !== "newest") {
    const sortLabel = DESTINATION_SORT_OPTIONS.find(
      (o) => o.value === current.sort
    )?.label;
    if (sortLabel) {
      activeFilterChips.push({
        key: "sort",
        label: `Sort: ${sortLabel}`,
        onRemove: () => removeFilter("sort"),
      });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary-100 px-4 py-2 text-sm text-secondary-700">
          <Compass className="h-4 w-4" />
          Discover Amazing Places
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Explore Destinations
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
          Find your next adventure from our curated collection of incredible
          destinations around the world.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative mx-auto max-w-xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search destinations by name, city, or country..."
            aria-label="Search destinations"
            className="h-12 w-full rounded-[var(--radius-lg)] border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Filter and Sort Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FilterPanel
            isOpen={filterOpen}
            onToggle={() => setFilterOpen(!filterOpen)}
            category={current.category}
            country={current.country}
            bestSeason={current.bestSeason}
            minRating={current.minRating}
            minCost={current.minCost}
            maxCost={current.maxCost}
            onCategoryChange={(v) => updateParams({ category: v })}
            onCountryChange={(v) => updateParams({ country: v })}
            onBestSeasonChange={(v) => updateParams({ bestSeason: v })}
            onMinRatingChange={(v) => updateParams({ minRating: v })}
            onMinCostChange={(v) => updateParams({ minCost: v })}
            onMaxCostChange={(v) => updateParams({ maxCost: v })}
            onResetAll={resetAllFilters}
          />

          <ActiveFilters chips={activeFilterChips} onClearAll={resetAllFilters} />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-slate-600">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={current.sort}
            onChange={handleSortChange}
            className="h-9 rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {DESTINATION_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div ref={resultsRef}>
        {isLoading ? (
          <>
            <p className="mb-4 text-sm text-slate-500" aria-live="polite">
              Loading destinations...
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <DestinationCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Failed to load destinations
              </h2>
              <p className="mt-2 max-w-md text-slate-600">
                Something went wrong while fetching destinations. Please try
                again.
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Try Again
            </Button>
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Compass className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                No destinations found
              </h2>
              <p className="mt-2 max-w-md text-slate-600">
                We couldn&apos;t find any destinations matching your current
                filters. Try adjusting your search criteria.
              </p>
            </div>
            <Button
              onClick={resetAllFilters}
              variant="outline"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500" aria-live="polite">
              Showing {data.data.length} of {data.total} destination
              {data.total !== 1 ? "s" : ""}
            </p>
            <DestinationGrid destinations={data.data} />
            <div className="mt-8">
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
