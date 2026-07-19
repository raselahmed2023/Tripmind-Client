import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from "@/components/ui";
import { Skeleton } from "@/components/ui";
import { Sparkles, CreditCard, AlertTriangle } from "lucide-react";
import type { Subscription } from "@/types";

interface SubscriptionCardProps {
  subscription?: Subscription;
  isLoading: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SubscriptionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-10 w-32 rounded-[var(--radius-md)]" />
    </div>
  );
}

function FreePlanCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-accent-100">
          <Sparkles className="h-5 w-5 text-accent-600" />
        </div>
        <div>
          <p className="font-medium text-slate-900">Free Plan</p>
          <p className="text-xs text-slate-500">Limited AI credits</p>
        </div>
      </div>
      <p className="text-sm text-slate-600">
        Upgrade to Pro for more AI-powered trip planning and priority support.
      </p>
      <Link href="/pricing">
        <Button leftIcon={<CreditCard className="h-4 w-4" />}>
          View Plans
        </Button>
      </Link>
    </div>
  );
}

function ActivePlanCard({ subscription }: { subscription: Subscription }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-secondary-100">
            <Sparkles className="h-5 w-5 text-secondary-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">
              {subscription.plan === "pro_monthly" ? "Pro" : "Free"} Plan
            </p>
            <Badge variant={subscription.status === "active" ? "success" : "accent"}>
              {subscription.status}
            </Badge>
          </div>
        </div>
        {subscription.stripeCustomerId && (
          <Link href="/billing">
            <Button variant="outline" size="sm">
              Manage Billing
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">AI Credits</span>
          <span className="font-medium text-slate-900">
            {subscription.aiCredits}
          </span>
        </div>
      </div>

      {subscription.currentPeriodEnd && (
        <p className="text-xs text-slate-500">
          {subscription.cancelAtPeriodEnd
            ? `Cancels on ${formatDate(subscription.currentPeriodEnd)}`
            : `Renews on ${formatDate(subscription.currentPeriodEnd)}`}
        </p>
      )}

      {subscription.cancelAtPeriodEnd && (
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-amber-50 p-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Your subscription will cancel at the end of the billing period.
        </div>
      )}
    </div>
  );
}

export function SubscriptionCard({ subscription, isLoading }: SubscriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SubscriptionSkeleton />
        ) : !subscription || subscription.plan === "free" ? (
          <FreePlanCard />
        ) : (
          <ActivePlanCard subscription={subscription} />
        )}
      </CardContent>
    </Card>
  );
}
