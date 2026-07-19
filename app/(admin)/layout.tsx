"use client";

import { PageLayout } from "@/components/layout";
import { AuthGuard } from "@/components/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAdmin>
      <PageLayout>{children}</PageLayout>
    </AuthGuard>
  );
}
