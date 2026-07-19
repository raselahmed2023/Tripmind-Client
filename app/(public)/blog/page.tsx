"use client";

import { useState } from "react";
import { BookOpen, Clock, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/utils";

const articles = [
  {
    slug: "ultimate-budget-travel-southeast-asia",
    title: "Ultimate Guide to Budget Travel in Southeast Asia",
    category: "Budget Travel",
    readTime: "8 min read",
    date: "June 10, 2026",
    excerpt: "Southeast Asia remains one of the most affordable and rewarding regions for travelers. From the floating markets of Bangkok to the temples of Angkor Wat, here is how to explore the region without breaking the bank.",
    content: `Southeast Asia offers an incredible range of experiences at a fraction of the cost of many Western destinations. Whether you are drawn to the bustling street markets of Bangkok, the serene rice terraces of Bali, or the ancient temples of Angkor Wat, the region rewards budget-conscious travelers with unforgettable adventures.

**Choose the Right Time to Visit**
Shoulder seasons (just before or after peak) offer lower prices on flights and accommodation while still providing good weather. Avoid major holidays like Chinese New Year when prices spike across the region.

**Transportation Tips**
Overnight buses and trains are excellent for both saving money on accommodation and covering long distances. Budget airlines like AirAsia and VietJet offer flash sales if you book a few weeks in advance. Within cities, tuk-tuks, Grab, and local buses cost a fraction of what taxis cost in Western countries.

**Food on a Budget**
Street food is not just cheaper — it is often the most authentic culinary experience. A full meal from a street vendor in Vietnam or Thailand typically costs between $1 and $3. Night markets are great for sampling a variety of dishes in one place.

**Accommodation**
Hostels in Southeast Asia range from $3 to $10 per night for dorms. Guesthouses and budget hotels are available for $15 to $30. Booking directly at walk-in rates often gives you a better deal than online platforms.

**Money-Saving Activities**
Many temples and natural attractions have very low entrance fees or are free. Hiking, beach days, and exploring local neighborhoods cost nothing. Cooking classes and guided tours offer great value at local prices.

**Sample Daily Budget**
A comfortable budget traveler in Southeast Asia can expect to spend $25 to $50 per day, covering accommodation, food, transport, and activities.`,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23dbeafe' width='800' height='400'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='%233b82f6' font-family='sans-serif' font-size='24'%3E🌏 Southeast Asia%3C/text%3E%3C/svg%3E",
  },
  {
    slug: "solo-travel-safety-tips",
    title: "Solo Travel Safety Tips",
    category: "Safety",
    readTime: "6 min read",
    date: "May 22, 2026",
    excerpt: "Traveling alone is one of the most rewarding experiences, but safety should always come first. These practical tips will help you stay secure while enjoying the freedom of solo travel.",
    content: `Solo travel opens the door to self-discovery, flexibility, and freedom. But going it alone means you are solely responsible for your own safety. Here are practical strategies to stay secure on the road.

**Share Your Itinerary**
Always leave a copy of your travel plans with a trusted friend or family member. Share your accommodation details, flight numbers, and rough daily schedule. Check in regularly so someone always knows your approximate location.

**Stay Connected**
Buy a local SIM card or ensure your phone has international roaming. Download offline maps for your destination before you arrive. Save emergency numbers, your embassy contact, and your accommodation address in your phone.

**Trust Your Instincts**
If a situation or person feels off, remove yourself. Your gut feeling is your best safety tool. Avoid walking alone at night in unfamiliar areas, and stick to well-lit, populated streets.

**Secure Your Belongings**
Use a money belt or hidden pouch for your passport and backup cards. Carry only what you need for the day. Use hotel safes or lockers in hostels for valuables.

**Research Your Destination**
Learn about common scams, unsafe neighborhoods, and local customs before you arrive. Understanding the local context helps you avoid situations that might put you at risk.

**Health Precautions**
Carry a basic first aid kit with essentials like pain relievers, band-aids, and any prescription medications. Stay hydrated and be cautious with street food if you have a sensitive stomach.`,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23fef3c7' width='800' height='400'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='%23d97706' font-family='sans-serif' font-size='24'%3E🎒 Solo Travel%3C/text%3E%3C/svg%3E",
  },
  {
    slug: "how-ai-transforming-travel-planning",
    title: "How AI is Transforming Travel Planning",
    category: "Technology",
    readTime: "5 min read",
    date: "April 15, 2026",
    excerpt: "Artificial intelligence is reshaping how we plan and experience travel. From personalized itineraries to budget optimization, discover the AI tools that are making travel planning smarter.",
    content: `Travel planning has traditionally involved hours of browsing blogs, comparing prices on multiple sites, and trying to piece together a coherent itinerary. AI tools are changing that by automating the most time-consuming parts of the process.

**What AI Can Do for Travel Planning**
AI models can process your preferences — destination, budget, travel dates, interests, and group size — and generate a structured day-by-day itinerary in seconds. This includes suggesting activities, estimating costs, and accounting for practical logistics like travel distances between locations.

**Budget Optimization**
AI can allocate your total budget across categories like accommodation, food, transportation, and activities. Rather than guessing how much to spend on each, the system balances your priorities to maximize value within your stated limits.

**Personalization at Scale**
Unlike generic travel guides, AI-generated itineraries adapt to your specific situation. A solo backpacker and a family with young children planning the same destination will receive very different recommendations and schedules.

**The Human Element**
AI is a powerful starting point, but the best trips still benefit from human judgment. Use AI-generated plans as a foundation, then layer in your own research and local recommendations. Verify critical details like opening hours, prices, and visa requirements before you travel.

**What to Expect Going Forward**
AI travel tools will continue to improve as language models become more capable. Expect better integration with booking platforms, more nuanced personalization, and real-time adaptation as conditions change during your trip.`,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23ede9fe' width='800' height='400'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='%237c3aed' font-family='sans-serif' font-size='24'%3E🤖 AI Travel%3C/text%3E%3C/svg%3E",
  },
];

function ArticleCard({ article }: { article: typeof articles[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="group overflow-hidden rounded-[var(--radius-xl)] border border-slate-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="aspect-[2/1] w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Badge variant="primary">{article.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            {article.readTime}
          </span>
        </div>
        <h2 className="mt-3 text-xl font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
          {article.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {article.excerpt}
        </p>

        {expanded && (
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
            {article.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <h3 key={i} className="text-base font-semibold text-slate-900 mt-4">
                    {paragraph.replace(/\*\*/g, "")}
                  </h3>
                );
              }
              return <p key={i}>{paragraph}</p>;
            })}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <time className="text-xs text-slate-400">{article.date}</time>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Read more"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
          <BookOpen className="h-8 w-8 text-accent-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Travel Blog</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Tips, guides, and stories to inspire your next adventure.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
