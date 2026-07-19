"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";

export default function PlannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(`/trips/create${qs ? `?${qs}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
        <MapPin className="h-8 w-8 text-primary-500" />
      </div>
      <p className="text-sm text-slate-500">Redirecting to trip creation...</p>
    </div>
  );
}
