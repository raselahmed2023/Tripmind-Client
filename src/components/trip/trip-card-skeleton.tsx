import { Skeleton } from "@/components/ui";

export function TripCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-xl)] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
        <Skeleton className="h-8 w-16 rounded-[var(--radius-md)]" />
        <Skeleton className="h-8 w-16 rounded-[var(--radius-md)]" />
      </div>
    </div>
  );
}
