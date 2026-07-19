import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
        <Mail className="h-8 w-8 text-primary-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Have questions or feedback? We would love to hear from you.
      </p>
      <p className="mt-6 text-sm text-slate-400">Coming soon</p>
    </div>
  );
}
