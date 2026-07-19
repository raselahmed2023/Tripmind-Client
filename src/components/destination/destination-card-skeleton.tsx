import { Skeleton } from "@/components/ui";

export function DestinationCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-slate-200 bg-white shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="mt-3 h-10 w-full rounded-[var(--radius-md)]" />
      </div>
    </div>
  );
}
