"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Globe,
  Compass,
  Sparkles,
  Route,
  ChevronDown,
  Star,
  ArrowRight,
  MessageSquare,
  Bot,
  Target,
  TrendingUp,
  Users,
  Plane,
  Mountain,
  Building2,
  Waves,
  TreePalm,
  Landmark,
  BookOpen,
} from "lucide-react";
import { Button, Card, CardContent, Badge, Skeleton } from "@/components/ui";
import { useDestinations } from "@/hooks";
import { cn } from "@/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const categories = [
  { icon: Waves, label: "Beach", count: "200+" },
  { icon: Mountain, label: "Mountain", count: "150+" },
  { icon: Building2, label: "City", count: "300+" },
  { icon: TreePalm, label: "Island", count: "80+" },
  { icon: Landmark, label: "Historical", count: "120+" },
  { icon: Compass, label: "Adventure", count: "100+" },
];

const steps = [
  {
    step: 1,
    title: "Choose Your Destination",
    description: "Browse our curated collection of destinations or let our AI suggest the perfect place based on your interests.",
    icon: MapPin,
  },
  {
    step: 2,
    title: "Set Your Preferences",
    description: "Tell us your travel style, budget, dates, and interests. The more we know, the better your itinerary.",
    icon: Settings,
  },
  {
    step: 3,
    title: "Generate Your Itinerary",
    description: "Our AI creates a day-by-day plan with activities, restaurants, hotels, and transportation — all within your budget.",
    icon: Sparkles,
  },
  {
    step: 4,
    title: "Travel with Confidence",
    description: "Follow your personalized itinerary, track expenses in real-time, and adjust on the fly with AI assistance.",
    icon: Plane,
  },
];

const aiFeatures = [
  {
    icon: Bot,
    title: "Agentic AI Planning",
    description: "Our AI agent autonomously researches destinations, compares options, and builds itineraries that match your exact preferences.",
  },
  {
    icon: MessageSquare,
    title: "Conversational Assistant",
    description: "Chat with your AI travel assistant to refine plans, ask questions, and get real-time recommendations during your trip.",
  },
  {
    icon: Target,
    title: "Budget Optimization",
    description: "AI continuously optimizes your spending across accommodation, food, transport, and activities to maximize value.",
  },
  {
    icon: TrendingUp,
    title: "Smart Adaptation",
    description: "Weather changes, closures, or new interests? Your AI itinerary adapts in real-time to keep your trip on track.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Solo Traveler",
    content: "TripMind saved me hours of planning. The AI itinerary was spot-on — it found hidden gems I never would have discovered on my own.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Family Vacation",
    content: "Planning a family trip with three kids used to be stressful. TripMind balanced everyone's interests and kept us under budget.",
    rating: 5,
    avatar: "MJ",
  },
  {
    name: "Elena Rodriguez",
    role: "Digital Nomad",
    content: "As someone who travels constantly, the AI assistant feature is a game-changer. It feels like having a local guide in every city.",
    rating: 5,
    avatar: "ER",
  },
];

const travelGuides = [
  {
    title: "Ultimate Guide to Budget Travel in Southeast Asia",
    category: "Budget Travel",
    readTime: "8 min read",
    description: "Discover how to explore Thailand, Vietnam, and Bali without breaking the bank.",
  },
  {
    title: "Solo Travel Safety Tips for 2025",
    category: "Safety",
    readTime: "6 min read",
    description: "Essential safety advice for solo travelers, from packing to navigation.",
  },
  {
    title: "How AI is Transforming Travel Planning",
    category: "Technology",
    readTime: "5 min read",
    description: "See how artificial intelligence is making travel planning faster, smarter, and more personalized.",
  },
];

const faqItems = [
  {
    question: "How does the AI itinerary generation work?",
    answer: "Our AI analyzes your destination, preferences, budget, and travel dates to create a personalized day-by-day itinerary. It considers factors like opening hours, distances, weather forecasts, and local events to optimize your schedule.",
  },
  {
    question: "Is TripMind free to use?",
    answer: "Yes! TripMind offers a free plan with 3 AI itinerary generations, basic trip planning, and destination exploration. For more features, check out our Pro plan at $19/month.",
  },
  {
    question: "Can I modify the AI-generated itinerary?",
    answer: "Absolutely. Your itinerary is fully editable. You can rearrange activities, swap restaurants, adjust budgets, and the AI will adapt the rest of your plan accordingly.",
  },
  {
    question: "Does TripMind work offline?",
    answer: "Your generated itineraries are accessible offline through your trip dashboard. However, real-time features like AI chat assistance and live updates require an internet connection.",
  },
  {
    question: "What destinations does TripMind support?",
    answer: "TripMind covers destinations worldwide across every continent. Our database includes detailed information for hundreds of cities, beaches, mountains, and cultural sites.",
  },
];

function Settings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold text-slate-900 hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
        aria-expanded={open}
      >
        {question}
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-slate-600">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { data: destinationsData, isLoading: destinationsLoading } = useDestinations({ limit: 4, sort: "highest_rating" });
  const featuredDestinations = destinationsData?.data ?? [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0">
          <motion.div
            className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/5"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5"
            animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-accent-400/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
            >
              <MapPin className="h-4 w-4" />
              AI-Powered Trip Planning
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl"
            >
              Plan your perfect trip with{" "}
              <span className="text-accent-400">artificial intelligence</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-primary-100"
            >
              TripMind uses advanced AI to create personalized travel
              itineraries, optimize your budget, and discover hidden gems at
              every destination.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <Link href="/register">
                <Button size="lg" variant="accent">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Explore Destinations
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Featured Destinations
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Top-rated destinations chosen by our community of travelers.
            </motion.p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinationsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-[var(--radius-xl)] border border-slate-200">
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              : featuredDestinations.map((dest) => (
                  <Link
                    key={dest._id}
                    href={`/destinations/${dest.slug}`}
                    className="group overflow-hidden rounded-[var(--radius-xl)] border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dest.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e2e8f0' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='14'%3E🌍 Explore%3C/text%3E%3C/svg%3E"}
                        alt={dest.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {dest.category && (
                        <div className="absolute left-3 top-3">
                          <Badge variant="primary">{dest.category}</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {dest.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {dest.city}{dest.city && dest.country ? ", " : ""}{dest.country}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">
                          {dest.currency || "$"}{dest.averageDailyCost}/day
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                          <span className="text-sm font-medium text-slate-700">{dest.rating?.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/explore">
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Categories */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Explore by Category
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Find your next adventure from our curated collection of destinations.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {categories.map((cat) => (
              <motion.div key={cat.label} variants={fadeUp}>
                <Link
                  href={`/explore?category=${cat.label}`}
                  className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-slate-200 bg-white p-6 text-center transition-all hover:border-primary-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                    <cat.icon className="h-6 w-6 text-primary-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{cat.label}</span>
                  <span className="text-xs text-slate-500">{cat.count} destinations</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How It Works
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Four simple steps to your perfect trip.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((step) => (
              <motion.div key={step.step} variants={fadeUp} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white text-lg font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agentic AI Features */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-accent-400 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Powered by AI
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Agentic AI That Plans For You
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Not just a template generator — our AI agent actively researches, reasons, and adapts to create truly personalized travel plans.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {aiFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-accent-400/10">
                  <feature.icon className="h-6 w-6 text-accent-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {[
              { icon: Globe, value: "500+", label: "Destinations" },
              { icon: Users, value: "10,000+", label: "Travelers" },
              { icon: Route, value: "25,000+", label: "Itineraries Generated" },
              { icon: Star, value: "4.9", label: "Average Rating" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                  <stat.icon className="h-6 w-6 text-primary-500" />
                </div>
                <div className="text-3xl font-bold text-slate-900 sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What Travelers Say
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Join thousands of happy travelers who plan their trips with TripMind.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">&ldquo;{t.content}&rdquo;</p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Travel Guides */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Travel Guides
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Tips, insights, and inspiration for your next adventure.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {travelGuides.map((guide) => (
              <motion.div key={guide.title} variants={fadeUp}>
                <Link
                  href="/blog"
                  className="group block overflow-hidden rounded-[var(--radius-xl)] border border-slate-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary-300" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">{guide.category}</Badge>
                      <span className="text-xs text-slate-400">{guide.readTime}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">{guide.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 text-center">
            <Link href="/blog">
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Read More Guides
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Everything you need to know about TripMind.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mt-12"
          >
            {faqItems.map((item) => (
              <motion.div key={item.question} variants={fadeUp}>
                <FAQItem question={item.question} answer={item.answer} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Plan Your Next Adventure?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
              Join thousands of travelers who trust TripMind to create their perfect itineraries. Start free today.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" variant="accent">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Explore Destinations
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
