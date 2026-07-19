import { BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
        <BookOpen className="h-8 w-8 text-accent-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Travel Blog</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Tips, guides, and stories from the world of AI-powered travel planning.
      </p>
      <p className="mt-6 text-sm text-slate-400">Coming soon</p>
    </div>
  );
}
