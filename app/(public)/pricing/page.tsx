"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Check,
  Sparkles,
  CreditCard,
  Zap,
  Shield,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button, Card, CardContent, Alert } from "@/components/ui";
import { useAuth, useSubscription, useCreateCheckoutSession } from "@/hooks";
import { cn } from "@/utils";
import type { CreateCheckoutSessionRequest } from "@/types";

const plans = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic trip planning",
    features: [
      "3 AI itinerary generations",
      "Basic trip planning",
      "Destination exploration",
      "Up to 3 active trips",
      "Standard support",
    ],
    cta: "Get Started",
    href: "/register",
    popular: false,
    productType: null,
  },
  {
    id: "pro" as const,
    name: "Pro Monthly",
    price: "$19",
    period: "/month",
    description: "For serious travelers who want more",
    features: [
      "50 AI generations per billing period",
      "Itinerary regeneration",
      "Advanced budget analysis",
      "Premium travel assistant access",
      "Unlimited active trips",
      "Priority support",
    ],
    cta: "Start Pro Plan",
    href: null,
    popular: true,
    productType: "pro_monthly" as const,
  },
  {
    id: "credits" as const,
    name: "AI Credits Pack",
    price: "$9",
    period: "one-time",
    description: "Need just a few more generations?",
    features: [
      "10 additional AI generations",
      "One-time purchase",
      "No subscription required",
      "Never expires",
      "Instant activation",
    ],
    cta: "Buy Credits",
    href: null,
    popular: false,
    productType: "credits_pack" as const,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: subscription } = useSubscription();
  const createCheckout = useCreateCheckoutSession();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async (productType: CreateCheckoutSessionRequest["productType"]) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setCheckoutError(null);

    try {
      const result = await createCheckout.mutateAsync({
        productType,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      });

      if (result.url) {
        window.location.assign(result.url);
      }
    } catch (err) {
      const apiError = err as { message?: string; status?: number };
      if (apiError?.status === 409) {
        setCheckoutError("You already have an active subscription. Manage it from your billing page.");
      } else if (apiError?.status === 402) {
        setCheckoutError("Payment processing failed. Please try again or contact support.");
      } else {
        setCheckoutError(apiError?.message || "Failed to start checkout. Please try again.");
      }
    }
  };

  const currentPlan = subscription?.plan || "free";

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Choose the plan that fits your travel style. Upgrade or downgrade anytime.
        </p>
      </div>

      {checkoutError && (
        <div className="mx-auto mt-8 max-w-2xl">
          <Alert variant="error">{checkoutError}</Alert>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative flex flex-col",
              plan.popular && "border-primary-500 shadow-lg ring-1 ring-primary-500"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-500 px-4 py-1 text-xs font-semibold text-white">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}
            <CardContent className="flex flex-1 flex-col pt-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {currentPlan === plan.id || (plan.id === "free" && currentPlan === "free") ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : plan.href ? (
                <Link href={plan.href}>
                  <Button variant={plan.popular ? "primary" : "outline"} className="w-full">
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full"
                  onClick={() => handleCheckout(plan.productType!)}
                  disabled={createCheckout.isPending}
                  isLoading={createCheckout.isPending}
                >
                  {createCheckout.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-slate-500">
          All paid plans include a 7-day free trial. Cancel anytime.
        </p>
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            Secure payments via Stripe
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4" />
            No hidden fees
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            Instant activation
          </span>
        </div>
      </div>
    </div>
  );
}
