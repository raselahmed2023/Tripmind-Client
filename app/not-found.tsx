import Link from "next/link";
import { Button } from "@/components/ui";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
        <MapPin className="h-8 w-8 text-primary-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Page not found
        </h2>
        <p className="mt-2 text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <p className="font-mono text-sm text-slate-400">404</p>
      <Link href="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  );
}
