import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import {
  Route,
  Compass,
  Map,
  Bell,
  CreditCard,
  MapPin,
} from "lucide-react";

const actions = [
  {
    label: "Create Trip",
    href: "/trips/create",
    icon: Route,
    color: "bg-primary-100 text-primary-600",
  },
  {
    label: "AI Trip Planner",
    href: "/trips/create",
    icon: MapPin,
    color: "bg-secondary-100 text-secondary-600",
  },
  {
    label: "Explore",
    href: "/explore",
    icon: Compass,
    color: "bg-accent-100 text-accent-600",
  },
  {
    label: "My Trips",
    href: "/trips",
    icon: Map,
    color: "bg-primary-100 text-primary-600",
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    color: "bg-secondary-100 text-secondary-600",
  },
  {
    label: "Subscription",
    href: "/settings",
    icon: CreditCard,
    color: "bg-accent-100 text-accent-600",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center gap-3 rounded-[var(--radius-lg)] border border-slate-100 p-3 transition-colors hover:border-primary-200 hover:bg-primary-50/50"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-colors group-hover:scale-105 ${action.color}`}
              >
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-primary-700">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
