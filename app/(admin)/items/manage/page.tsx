"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  MapPin,
  Star,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button, Card, CardContent, Badge, Alert, Modal, Skeleton } from "@/components/ui";
import { useAdminDestinations, useDeleteDestination, getAdminDestinationError } from "@/hooks/use-admin-destinations";
import type { Destination, AdminDestinationQueryParams } from "@/types";

const PAGE_SIZE = 10;

export default function ManageDestinationsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState<"draft" | "published" | "">("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);

  const queryParams: AdminDestinationQueryParams = {
    page,
    limit: PAGE_SIZE,
    ...(search && { search }),
    ...(category && { category }),
    ...(statusFilter && { status: statusFilter }),
  };

  const { data, isLoading, error } = useAdminDestinations(queryParams);
  const deleteMutation = useDeleteDestination();

  const destinations = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget._id);
      setDeleteTarget(null);
    } catch {
      // Error handled by mutation
    }
  }, [deleteTarget, deleteMutation]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setPage(1);
    },
    []
  );

  const errorText = error ? getAdminDestinationError(error) : null;
  const deleteError = deleteMutation.error ? getAdminDestinationError(deleteMutation.error) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Destinations</h1>
          <p className="mt-1 text-slate-600">
            {total} destination{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/items/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Destination
          </Button>
        </Link>
      </div>

      {errorText && (
        <Alert variant="error" className="mb-6">
          {errorText}
        </Alert>
      )}

      {deleteError && (
        <Alert variant="error" className="mb-6">
          Delete failed: {deleteError}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-10 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
              />
            </div>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="flex h-10 rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 sm:w-48"
            >
              <option value="">All Categories</option>
              <option value="Beach">Beach</option>
              <option value="Mountain">Mountain</option>
              <option value="City">City</option>
              <option value="Countryside">Countryside</option>
              <option value="Historical">Historical</option>
              <option value="Adventure">Adventure</option>
              <option value="Island">Island</option>
              <option value="Cultural">Cultural</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as "draft" | "published" | ""); setPage(1); }}
              className="flex h-10 rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 sm:w-40"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-slate-200 p-4">
              <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && destinations.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-slate-300 py-16 text-center">
          <MapPin className="h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No destinations found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {search || category ? "Try adjusting your filters." : "Get started by adding your first destination."}
          </p>
          {!search && !category && (
            <Link href="/items/add" className="mt-4">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Destination
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Desktop Table */}
      {!isLoading && destinations.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-[var(--radius-xl)] border border-slate-200 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Cost/Day</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {destinations.map((dest) => (
                  <tr key={dest._id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={dest.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='%23e2e8f0' width='40' height='40'/%3E%3C/svg%3E"}
                            alt={dest.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{dest.title}</p>
                          <p className="text-xs text-slate-500">{dest.city}, {dest.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={dest.status === "published" ? "success" : "accent"}>
                        {dest.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary">{dest.category || "N/A"}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {dest.currency || "$"}{dest.averageDailyCost}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                        <span className="text-slate-700">{dest.rating?.toFixed(1) ?? "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/destinations/${dest.slug}`}
                          className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          target="_blank"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <Link
                          href={`/items/${dest._id}/edit`}
                          className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(dest)}
                          className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {destinations.map((dest) => (
              <Card key={dest._id}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dest.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Crect fill='%23e2e8f0' width='56' height='56'/%3E%3C/svg%3E"}
                        alt={dest.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 truncate">{dest.title}</h3>
                      <p className="text-xs text-slate-500">{dest.city}, {dest.country}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant={dest.status === "published" ? "success" : "accent"}>{dest.status}</Badge>
                        <Badge variant="primary">{dest.category || "N/A"}</Badge>
                        <span className="flex items-center gap-1 text-xs text-slate-600">
                          <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
                          {dest.rating?.toFixed(1) ?? "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="flex-1"
                      target="_blank"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Button>
                    </Link>
                    <Link
                      href={`/items/${dest._id}/edit`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => setDeleteTarget(dest)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Destination"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-700">
                Are you sure you want to delete <strong>{deleteTarget?.title}</strong>?
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
