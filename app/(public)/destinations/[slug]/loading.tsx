import { Skeleton } from "@/components/ui";

export default function DestinationLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Image skeleton */}
      <Skeleton className="mb-8 aspect-[16/10] w-full rounded-[var(--radius-xl)]" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content skeleton */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <div className="mb-2 flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="mt-2 h-5 w-1/2" />
            <Skeleton className="mt-2 h-5 w-1/3" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-[var(--radius-xl)]" />
          <Skeleton className="h-14 w-full rounded-[var(--radius-xl)]" />
          <Skeleton className="h-48 w-full rounded-[var(--radius-xl)]" />
        </div>
      </div>
    </div>
  );
}
