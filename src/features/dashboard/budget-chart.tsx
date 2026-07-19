"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import { Skeleton } from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Trip } from "@/types";

interface BudgetChartProps {
  trips: Trip[];
  isLoading: boolean;
}

function getChartData(trips: Trip[]) {
  const sorted = [...trips]
    .filter((t) => t.budget > 0)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .slice(-8);

  return sorted.map((t) => ({
    name:
      t.title.length > 12 ? t.title.slice(0, 12) + "..." : t.title,
    budget: t.budget,
    fullTitle: t.title,
  }));
}

function ChartSkeleton() {
  return (
    <div className="flex h-[250px] items-end justify-center gap-2 pb-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          className="w-8"
          style={{ height: `${40 + i * 30}px` }}
        />
      ))}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[250px] items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">No budget data</p>
        <p className="mt-1 text-xs text-slate-400">
          Add budgets to your trips to see spending overview.
        </p>
      </div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { fullTitle: string; budget: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-[var(--radius-lg)] border border-slate-200 bg-white p-3 shadow-md">
      <p className="text-sm font-medium text-slate-900">{item.fullTitle}</p>
      <p className="mt-1 text-sm text-slate-600">
        Budget: ${item.budget.toLocaleString()}
      </p>
    </div>
  );
}

export function BudgetChart({ trips, isLoading }: BudgetChartProps) {
  const data = getChartData(trips);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planned Budget</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-[250px]" role="img" aria-label="Planned budget by trip chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="budget"
                  fill="#1e40af"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
