import Link from "next/link";
import { XCircle, ArrowRight, CreditCard, LayoutDashboard } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="pt-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <XCircle className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Payment not completed
          </h1>
          <p className="mt-2 text-slate-600">
            No charges were made. Your account remains unchanged.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/pricing">
              <Button className="w-full" leftIcon={<CreditCard className="h-4 w-4" />}>
                View Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
