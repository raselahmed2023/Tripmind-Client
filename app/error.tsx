"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Something went wrong
        </h2>
        <p className="mt-2 text-slate-600">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-slate-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <Button
        onClick={reset}
        variant="outline"
        leftIcon={<RefreshCw className="h-4 w-4" />}
      >
        Try again
      </Button>
    </div>
  );
}
