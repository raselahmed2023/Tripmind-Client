import {
  MapPin,
  DollarSign,
  Globe,
  Star,
  Sun,
  Calendar,
} from "lucide-react";
import type { Destination } from "@/types";

interface KeyInfoCardsProps {
  destination: Destination;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor?: string;
  iconColor?: string;
}

function InfoCard({
  icon,
  label,
  value,
  bgColor = "bg-primary-50",
  iconColor = "text-primary-500",
}: InfoCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-slate-100 bg-white p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgColor}`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export function KeyInfoCards({ destination }: KeyInfoCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {destination.category && (
        <InfoCard
          icon={<MapPin className="h-5 w-5" />}
          label="Category"
          value={destination.category}
        />
      )}
      {destination.averageDailyCost !== undefined && (
        <InfoCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Daily Cost"
          value={`${destination.currency || "$"}${destination.averageDailyCost}`}
          bgColor="bg-green-50"
          iconColor="text-green-500"
        />
      )}
      {destination.currency && (
        <InfoCard
          icon={<Globe className="h-5 w-5" />}
          label="Currency"
          value={destination.currency}
          bgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
      )}
      {destination.rating !== undefined && (
        <InfoCard
          icon={<Star className="h-5 w-5" />}
          label="Rating"
          value={`${destination.rating.toFixed(1)}${destination.reviewCount !== undefined ? ` (${destination.reviewCount} reviews)` : ""}`}
          bgColor="bg-accent-50"
          iconColor="text-accent-500"
        />
      )}
      {destination.bestSeason && (
        <InfoCard
          icon={<Sun className="h-5 w-5" />}
          label="Best Season"
          value={destination.bestSeason}
          bgColor="bg-orange-50"
          iconColor="text-orange-500"
        />
      )}
      {destination.recommendedDays !== undefined && (
        <InfoCard
          icon={<Calendar className="h-5 w-5" />}
          label="Recommended"
          value={`${destination.recommendedDays} day${destination.recommendedDays !== 1 ? "s" : ""}`}
          bgColor="bg-purple-50"
          iconColor="text-purple-500"
        />
      )}
    </div>
  );
}
