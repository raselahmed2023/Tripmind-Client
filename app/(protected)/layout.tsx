"use client";

import { PageLayout } from "@/components/layout";
import { AuthGuard } from "@/components/auth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <PageLayout>{children}</PageLayout>
    </AuthGuard>
  );
}
