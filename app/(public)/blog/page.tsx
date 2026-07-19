import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui";

const articles = [
  {
    slug: "ultimate-budget-travel-southeast-asia",
    title: "Ultimate Guide to Budget Travel in Southeast Asia",
    category: "Budget Travel",
    readTime: "8 min read",
    date: "January 15, 2025",
    excerpt: "Southeast Asia remains one of the most affordable and rewarding regions for travelers. From the floating markets of Bangkok to the temples of Angkor Wat, here is how to explore the region without breaking the bank.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23dbeafe' width='800' height='400'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='%233b82f6' font-family='sans-serif' font-size='24'%3E🌏 Southeast Asia%3C/text%3E%3C/svg%3E",
  },
  {
    slug: "solo-travel-safety-tips-2025",
    title: "Solo Travel Safety Tips for 2025",
    category: "Safety",
    readTime: "6 min read",
    date: "February 3, 2025",
    excerpt: "Traveling alone is one of the most rewarding experiences, but safety should always come first. These practical tips will help you stay secure while enjoying the freedom of solo travel.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23fef3c7' width='800' height='400'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='%23d97706' font-family='sans-serif' font-size='24'%3E🎒 Solo Travel%3C/text%3E%3C/svg%3E",
  },
  {
    slug: "how-ai-transforming-travel-planning",
    title: "How AI is Transforming Travel Planning",
    category: "Technology",
    readTime: "5 min read",
    date: "March 12, 2025",
    excerpt: "Artificial intelligence is reshaping how we plan and experience travel. From personalized itineraries to real-time budget optimization, discover the AI tools that are making travel smarter.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23ede9fe' width='800' height='400'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='%237c3aed' font-family='sans-serif' font-size='24'%3E🤖 AI Travel%3C/text%3E%3C/svg%3E",
  },
];

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
          <article
            key={article.slug}
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
              <div className="mt-4 flex items-center justify-between">
                <time className="text-xs text-slate-400">{article.date}</time>
                <span className="flex items-center gap-1 text-sm font-medium text-primary-500 group-hover:text-primary-600">
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
