import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-500" />
              <span className="text-lg font-bold text-slate-900">TripMind</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500">
              AI-powered trip planning for the modern traveler.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Product</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/explore" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Account</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  My Trips
                </Link>
              </li>
              <li>
                <Link href="/billing" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Billing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} TripMind. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
