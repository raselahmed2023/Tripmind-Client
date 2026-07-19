import { Card, CardContent } from "@/components/ui";
import { Skeleton } from "@/components/ui";
import { cn } from "@/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  description?: string;
  accent?: "primary" | "secondary" | "accent";
  isLoading?: boolean;
}

const accentStyles = {
  primary: "bg-primary-100 text-primary-600",
  secondary: "bg-secondary-100 text-secondary-600",
  accent: "bg-accent-100 text-accent-600",
};

export function StatCard({
  icon,
  label,
  value,
  description,
  accent = "primary",
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-[var(--radius-lg)]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)]",
              accentStyles[accent]
            )}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            {description && (
              <p className="mt-0.5 text-xs text-slate-400">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
