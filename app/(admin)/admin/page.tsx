"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { useAuth } from "@/hooks";
import { Shield, Plus, Settings } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
        <p className="mt-2 text-slate-600">
          Manage destinations and system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/items/add" className="group">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-primary-100 group-hover:bg-primary-200 transition-colors">
                  <Plus className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Add Destination</h3>
                  <p className="text-sm text-slate-500">Create a new destination</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/items/manage" className="group">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-secondary-100 group-hover:bg-secondary-200 transition-colors">
                  <Settings className="h-6 w-6 text-secondary-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Manage Destinations</h3>
                  <p className="text-sm text-slate-500">View, edit, or remove destinations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-accent-100">
                <Shield className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Admin Access</h3>
                <p className="text-sm text-slate-500">
                  Logged in as <span className="font-medium text-slate-700">{user?.email}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
