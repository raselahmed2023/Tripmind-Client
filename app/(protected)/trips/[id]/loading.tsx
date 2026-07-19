export default function TripDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-slate-200" />
      <div className="mb-8">
        <div className="mb-2 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-6 w-48 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-48 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
          <div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
          <div className="h-36 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
        </div>
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
          <div className="h-36 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
