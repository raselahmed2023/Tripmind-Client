import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="TripMind home">
              <MapPin className="h-5 w-5 text-primary-500" />
              <span className="text-lg font-bold text-slate-900">TripMind</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500">
              AI-powered trip planning for the modern traveler.
            </p>
            <ul className="mt-4 space-y-1.5">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-500 transition-colors"
                  aria-label={`Email us at ${CONTACT_EMAIL}`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-primary-500 transition-colors"
                  aria-label="TripMind on GitHub (opens in a new tab)"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-primary-500 transition-colors"
                  aria-label="TripMind on LinkedIn (opens in a new tab)"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Product</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Company</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Contact
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
            <h3 className="mt-6 text-sm font-semibold text-slate-900">Account</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/login" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-slate-500 hover:text-primary-500 transition-colors">
                  Create Account
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
