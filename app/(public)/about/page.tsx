import { MapPin, Brain, Users, Globe } from "lucide-react";

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

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {[
          { icon: Brain, title: "AI-First", desc: "Every feature powered by intelligent algorithms" },
          { icon: Users, title: "Traveler-Focused", desc: "Built by travelers, for travelers" },
          { icon: Globe, title: "Global Reach", desc: "Destinations across every continent" },
        ].map((item) => (
          <div key={item.title} className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <item.icon className="h-6 w-6 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
