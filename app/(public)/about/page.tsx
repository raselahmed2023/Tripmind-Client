import Link from "next/link";
import { MapPin, Brain, Users, Globe, Heart, Target, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <MapPin className="h-8 w-8 text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">About TripMind</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          We are building the future of travel planning, combining artificial
          intelligence with deep destination knowledge to create perfect trips.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            TripMind was created to solve a real problem: planning a trip is time-consuming,
            overwhelming, and often results in generic itineraries that miss what makes each
            traveler unique. We believe that everyone deserves a personalized travel experience
            without the hours of research and coordination.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Our AI-powered platform handles the heavy lifting — researching destinations,
            comparing options, optimizing budgets, and building day-by-day itineraries — so
            you can focus on the excitement of your upcoming adventure.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900">What We Believe</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              { icon: Brain, title: "AI-First Approach", description: "Every feature is built with intelligent automation at its core, not as an afterthought." },
              { icon: Users, title: "Traveler-Focused", description: "Built by travelers, for travelers. We understand the pain points because we have experienced them." },
              { icon: Globe, title: "Growing Destination Database", description: "A curated and expanding collection of destinations, with local insights that generic platforms miss." },
              { icon: Shield, title: "Privacy & Security", description: "Your data is encrypted and never sold. We only use it to improve your experience." },
              { icon: Heart, title: "Honest Recommendations", description: "No paid placements or sponsored content. Our AI recommends what is genuinely best for you." },
              { icon: Target, title: "Budget Transparency", description: "Real cost estimates based on current data, so there are no surprises when you arrive." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-[var(--radius-xl)] border border-slate-200 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-primary-50">
                  <item.icon className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Started */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900">How It Started</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            TripMind began as a frustration shared between friends: spending more time planning
            a vacation than actually enjoying it. We noticed that existing tools were either too
            generic (cookie-cutter itineraries) or too complex (spreadsheets and hours of research).
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            The breakthrough came when we realized that large language models could understand
            not just what a traveler wants, but how to balance competing priorities — budget
            constraints, time limitations, personal interests, and practical logistics — into
            a cohesive, actionable plan.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Today, TripMind helps travelers trust our AI to create itineraries
            that feel hand-crafted by a local expert. We are continuously improving our models
            and expanding our destination database to serve you better.
          </p>
        </section>

        {/* Technology */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900">Our Technology</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            TripMind uses agentic AI that goes beyond simple template filling. Our system:
          </p>
          <ul className="mt-4 space-y-3 text-base text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              Generates personalized day-by-day itineraries based on your destination, budget, and preferences
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              Allocates budgets across accommodation, food, transport, and activities
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              Accounts for practical constraints like travel distances and scheduling
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              Adapts recommendations based on seasonal factors and your stated preferences
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              Maintains conversation context across your planning session for coherent, evolving plans
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="rounded-[var(--radius-xl)] bg-gradient-to-br from-primary-500 to-primary-600 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white">Ready to Plan Your Trip?</h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-100">
            Join travelers who plan smarter with TripMind. Start free today.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button variant="accent" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Get Started Free
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Explore Destinations
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
