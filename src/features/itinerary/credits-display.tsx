"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/utils";

interface CreditsDisplayProps {
  remaining: number;
  total: number;
  size?: "sm" | "md";
}

export function CreditsDisplay({ remaining, total, size = "md" }: CreditsDisplayProps) {
  const ratio = total > 0 ? remaining / total : 0;
  const isLow = ratio < 0.2;
  const isEmpty = remaining === 0;

  return (
    <div className={cn("flex items-center gap-2", size === "sm" && "text-xs")}>
      <Sparkles className={cn(
        "shrink-0",
        size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
        isEmpty ? "text-red-400" : isLow ? "text-amber-400" : "text-primary-500"
      )} />
      <span className={cn(
        "font-medium",
        isEmpty ? "text-red-600" : isLow ? "text-amber-600" : "text-slate-700"
      )}>
        {remaining}
      </span>
      <span className="text-slate-400">/</span>
      <span className="text-slate-500">{total}</span>
    </div>
  );
}
