"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { useAuth } from "@/hooks";
import { Shield } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
        <p className="mt-2 text-slate-600">
          Manage users, trips, and system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600">
              Admin Access
            </CardTitle>
            <Shield className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Logged in as <span className="font-medium text-slate-900">{user?.email}</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Admin features will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
