import Link from "next/link";
import { Button } from "@/components/ui";
import { MapPin, Brain, Globe, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Planning",
    description:
      "Let our AI create personalized itineraries based on your preferences and travel style.",
  },
  {
    icon: Globe,
    title: "Global Destinations",
    description:
      "Explore thousands of destinations with local insights and recommendations.",
  },
  {
    icon: Shield,
    title: "Smart Budgeting",
    description:
      "Track expenses and get real-time budget recommendations throughout your trip.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <MapPin className="h-4 w-4" />
              AI-Powered Trip Planning
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Plan your perfect trip with{" "}
              <span className="text-accent-400">artificial intelligence</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-primary-100">
              TripMind uses advanced AI to create personalized travel
              itineraries, optimize your budget, and discover hidden gems at
              every destination.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="accent">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need for smarter travel
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              From planning to packing, TripMind handles every aspect of your
              journey.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative rounded-[var(--radius-xl)] border border-slate-200 p-8 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-primary-100">
                  <feature.icon className="h-6 w-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
