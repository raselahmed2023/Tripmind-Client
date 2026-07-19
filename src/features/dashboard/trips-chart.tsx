"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import { Skeleton } from "@/components/ui";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Trip } from "@/types";

interface TripsChartProps {
  trips: Trip[];
  isLoading: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8",
  planned: "#3b82f6",
  ongoing: "#10b981",
  completed: "#1e40af",
  cancelled: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  planned: "Planned",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

function getChartData(trips: Trip[]) {
  const counts: Record<string, number> = {};
  trips.forEach((t) => {
    counts[t.status] = (counts[t.status] || 0) + 1;
  });

  return Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: STATUS_LABELS[key] || key,
      value,
      color: STATUS_COLORS[key] || "#94a3b8",
    }));
}

function ChartSkeleton() {
  return (
    <div className="flex h-[250px] items-center justify-center">
      <Skeleton className="h-[200px] w-[200px] rounded-full" />
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[250px] items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">No trip data</p>
        <p className="mt-1 text-xs text-slate-400">
          Create trips to see your breakdown.
        </p>
      </div>
    </div>
  );
}

export function TripsChart({ trips, isLoading }: TripsChartProps) {
  const data = getChartData(trips);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trips by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-[250px]" role="img" aria-label="Trips by status chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
