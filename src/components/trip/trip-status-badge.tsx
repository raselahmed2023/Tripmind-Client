import { Badge } from "@/components/ui";
import type { TripStatus } from "@/types";
import {
  FileEdit,
  CalendarCheck,
  Compass,
  CheckCircle,
  Ban,
} from "lucide-react";

const STATUS_CONFIG: Record<
  TripStatus,
  { variant: "default" | "primary" | "accent" | "success" | "destructive"; icon: React.ReactNode; label: string }
> = {
  draft: {
    variant: "default",
    icon: <FileEdit className="h-3 w-3" />,
    label: "Draft",
  },
  planned: {
    variant: "primary",
    icon: <CalendarCheck className="h-3 w-3" />,
    label: "Planned",
  },
  ongoing: {
    variant: "accent",
    icon: <Compass className="h-3 w-3" />,
    label: "Ongoing",
  },
  completed: {
    variant: "success",
    icon: <CheckCircle className="h-3 w-3" />,
    label: "Completed",
  },
  cancelled: {
    variant: "destructive",
    icon: <Ban className="h-3 w-3" />,
    label: "Cancelled",
  },
};

interface TripStatusBadgeProps {
  status: TripStatus;
}

export function TripStatusBadge({ status }: TripStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}
