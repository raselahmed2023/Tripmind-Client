"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, AlertTriangle, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui";
import { Pagination } from "@/components/ui";
import { TripCard, TripCardSkeleton } from "@/components/trip";
import { useTrips, useDeleteTrip } from "@/hooks";
import { DeleteTripModal } from "./delete-trip-modal";
import { TRIP_STATUS_OPTIONS } from "@/types";
import type { Trip, TripQueryParams } from "@/types";

function getSearchParams(params: URLSearchParams) {
  return {
    search: params.get("search") || "",
    status: params.get("status") || "",
    sort: params.get("sort") || "newest",
    page: parseInt(params.get("page") || "1", 10),
  };
}

export function TripList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = getSearchParams(searchParams);

  const [searchInput, setSearchInput] = useState(current.search);
  const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null);

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
      if (updates.search !== undefined || updates.status !== undefined || updates.sort !== undefined) {
        params.delete("page");
      }
      const qs = params.toString();
      router.push(`/trips${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateParams({ search: searchInput.trim() });
    },
    [searchInput, updateParams]
  );

  const clearSearch = useCallback(() => {
    setSearchInput("");
    updateParams({ search: "" });
  }, [updateParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`/trips?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateParams({ status: e.target.value });
    },
    [updateParams]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateParams({ sort: e.target.value });
    },
    [updateParams]
  );

  const queryParams: TripQueryParams = {
    page: current.page,
    limit: 10,
    ...(current.search && { search: current.search }),
    ...(current.status && { status: current.status }),
    ...(current.sort && { sort: current.sort }),
  };

  const { data, isLoading, error, refetch } = useTrips(queryParams);
  const deleteTrip = useDeleteTrip();

  const trips = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  const clientTrips = trips.filter((trip) => {
    if (!current.search) return true;
    const q = current.search.toLowerCase();
    return (
      trip.title.toLowerCase().includes(q) ||
      trip.destination?.title?.toLowerCase().includes(q) ||
      trip.destination?.city?.toLowerCase().includes(q) ||
      trip.destination?.country?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="w-full min-w-0 sm:flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search trips..."
              aria-label="Search trips"
              className="h-9 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        <select
          value={current.status}
          onChange={handleStatusChange}
          className="h-9 rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {TRIP_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={current.sort}
          onChange={handleSortChange}
          className="h-9 rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="Sort trips"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="start_date">Start Date</option>
          <option value="budget_desc">Highest Budget</option>
          <option value="budget_asc">Lowest Budget</option>
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Failed to load trips
            </h2>
            <p className="mt-2 max-w-md text-slate-600">
              Something went wrong while fetching your trips. Please try again.
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
      ) : clientTrips.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Compass className="h-8 w-8 text-slate-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {current.search || current.status
                ? "No matching trips"
                : "No trips yet"}
            </h2>
            <p className="mt-2 max-w-md text-slate-600">
              {current.search || current.status
                ? "Try adjusting your search or filters."
                : "Create your first trip to start planning your adventures."}
            </p>
          </div>
          {!current.search && !current.status && (
            <Button onClick={() => router.push("/trips/create")}>
              Create Your First Trip
            </Button>
          )}
          {(current.search || current.status) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchInput("");
                updateParams({ search: "", status: "" });
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500" aria-live="polite">
            {clientTrips.length} trip{clientTrips.length !== 1 ? "s" : ""}
            {current.search ? ` matching "${current.search}"` : ""}
          </p>
          <div className="space-y-4">
            {clientTrips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDelete={setDeleteTarget}
                isDeleting={deleteTrip.isPending && deleteTrip.variables === trip._id}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={current.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <DeleteTripModal
        trip={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={() => setDeleteTarget(null)}
      />
    </div>
  );
}
