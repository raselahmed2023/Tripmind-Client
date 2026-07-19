import { Sparkles } from "lucide-react";
import { cn } from "@/utils";

interface CreditsDisplayProps {
  remaining: number;
  total: number;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function CreditsDisplay({
  remaining,
  total,
  size = "sm",
  showLabel = true,
}: CreditsDisplayProps) {
  const pct = total > 0 ? Math.round((remaining / total) * 100) : 0;
  const isLow = pct <= 20;
  const isEmpty = remaining === 0;

  return (
    <div className={cn("flex items-center gap-2", size === "sm" && "text-sm", size === "md" && "text-base")}>
      <Sparkles
        className={cn(
          "shrink-0",
          size === "sm" && "h-3.5 w-3.5",
          size === "md" && "h-4 w-4",
          isEmpty ? "text-red-500" : isLow ? "text-amber-500" : "text-primary-500"
        )}
      />
      {showLabel && (
        <span className="text-slate-600">Credits:</span>
      )}
      <span
        className={cn(
          "font-medium",
          isEmpty ? "text-red-600" : isLow ? "text-amber-600" : "text-slate-900"
        )}
      >
        {remaining}
      </span>
      {total > 0 && (
        <span className="text-slate-400">/ {total}</span>
      )}
    </div>
  );
}
