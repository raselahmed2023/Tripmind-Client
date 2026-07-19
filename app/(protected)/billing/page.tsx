"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CreditCard,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button, Card, CardContent, Badge, Alert } from "@/components/ui";
import {
  useSubscription,
  usePayments,
  useCreatePortalSession,
} from "@/hooks";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return <Badge variant="success"><CheckCircle className="mr-1 h-3 w-3" />Paid</Badge>;
    case "pending":
      return <Badge variant="accent"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
    case "failed":
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Failed</Badge>;
    case "cancelled":
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
    case "refunded":
      return <Badge variant="accent"><RefreshCw className="mr-1 h-3 w-3" />Refunded</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function BillingPage() {
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const { data: paymentsResult, isLoading: paymentsLoading, refetch: refetchPayments } = usePayments();
  const payments = paymentsResult?.data ?? [];
  const createPortal = useCreatePortalSession();
  const [portalError, setPortalError] = useState<string | null>(null);

  const handleManageBilling = async () => {
    setPortalError(null);
    try {
      const result = await createPortal.mutateAsync();
      if (result.url) {
        window.location.assign(result.url);
      }
    } catch (err) {
      const apiError = err as { message?: string };
      setPortalError(apiError?.message || "Failed to open billing portal. Please try again.");
    }
  };

  if (subLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
          <div className="h-60 animate-pulse rounded-[var(--radius-xl)] bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Billing & Subscription</h1>
      </div>

      {portalError && (
        <Alert variant="error" className="mb-6">{portalError}</Alert>
      )}

      {/* Current Plan */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Current Plan</h2>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-900 capitalize">
                  {subscription?.plan || "Free"}
                </span>
                <Badge variant={subscription?.status === "active" ? "success" : "default"}>
                  {subscription?.status || "active"}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleManageBilling}
              disabled={createPortal.isPending}
              leftIcon={createPortal.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
            >
              Manage Billing
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">AI Credits</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                <Sparkles className="mr-1 inline h-4 w-4 text-primary-500" />
                {subscription?.aiCredits ?? 0}
              </p>
            </div>
            {subscription?.currentPeriodEnd && (
              <div className="rounded-[var(--radius-md)] bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-500">
                  {subscription?.cancelAtPeriodEnd ? "Cancels On" : "Renews On"}
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            )}
            {subscription?.cancelAtPeriodEnd && (
              <div className="rounded-[var(--radius-md)] bg-amber-50 p-4">
                <p className="text-xs font-medium uppercase text-amber-700">Status</p>
                <p className="mt-1 text-sm font-semibold text-amber-800">
                  Your plan will cancel at the end of the current period. You can resubscribe anytime.
                </p>
              </div>
            )}
          </div>

          {subscription?.plan === "free" && (
            <div className="mt-4">
              <Link href="/pricing">
                <Button leftIcon={<CreditCard className="h-4 w-4" />}>
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchPayments()}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
          </div>

          {paymentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-[var(--radius-md)] bg-slate-100" />
              ))}
            </div>
          ) : !payments || payments.length === 0 ? (
            <div className="py-12 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 font-medium text-slate-700">No payments yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Your payment history will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {payment.productType === "subscription" ? "Pro Subscription" : "AI Credits Pack"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatDate(payment.createdAt)}
                      {payment.paidAt && (
                        <span className="ml-2">
                          · Paid {formatDate(payment.paidAt)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(payment.status)}
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
