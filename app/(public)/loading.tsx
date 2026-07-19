import { MapPin } from "lucide-react";

export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
        <MapPin className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-primary-500" />
      </div>
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  );
}
