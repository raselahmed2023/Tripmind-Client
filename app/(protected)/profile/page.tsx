"use client";

import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Map,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import { useAuth, useTrips } from "@/hooks";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: tripsData } = useTrips({ limit: 100 });

  if (!user) return null;

  const trips = tripsData?.data ?? [];
  const totalTrips = trips.length;
  const completedTrips = trips.filter((t) => t.status === "completed").length;
  const upcomingTrips = trips.filter((t) => {
    const start = new Date(t.startDate);
    return (t.status === "planned" || t.status === "draft") && start >= new Date();
  }).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Profile</h1>

      {/* User Card */}
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-white">
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={user.role === "admin" ? "primary" : "default"}>
                    {user.role === "admin" && (
                      <Shield className="mr-1 h-3 w-3" />
                    )}
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-slate-100 p-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Full Name</p>
                  <p className="text-sm text-slate-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-slate-100 p-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Email</p>
                  <p className="text-sm text-slate-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-slate-100 p-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Member Since</p>
                  <p className="text-sm text-slate-900">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Map className="h-5 w-5 text-primary-500" />
              Trip Statistics
            </h3>
            <Link href="/trips">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[var(--radius-md)] bg-slate-50 p-3 text-center">
              <p className="text-2xl font-bold text-slate-900">{totalTrips}</p>
              <p className="text-xs text-slate-500">Total Trips</p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-slate-50 p-3 text-center">
              <p className="text-2xl font-bold text-slate-900">{upcomingTrips}</p>
              <p className="text-xs text-slate-500">Upcoming</p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-slate-50 p-3 text-center">
              <p className="text-2xl font-bold text-slate-900">{completedTrips}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
