"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SavedPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
    </div>
  );
}
