"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, MapPin, Clock } from "lucide-react";
import { Button, Card, CardContent, Alert } from "@/components/ui";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = useCallback(
    (data: ContactFormData) => {
      const mailtoLink = `mailto:hello@tripmind.ai?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
      )}`;
      window.location.href = mailtoLink;
      setSubmitted(true);
      reset();
    },
    [reset]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <Mail className="h-8 w-8 text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Have questions, feedback, or need help? We would love to hear from you.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              {submitted && (
                <Alert variant="success" className="mb-6">
                  Your email client should have opened with the message pre-filled. If it did not, please send your message directly to{" "}
                  <a href="mailto:hello@tripmind.ai" className="font-medium underline">
                    hello@tripmind.ai
                  </a>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                        errors.name ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                      }`}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                        errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                      }`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500" role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                      errors.subject ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                    }`}
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500" role="alert">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us what you need help with..."
                    className={`flex w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                      errors.message ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"
                    }`}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={isSubmitting}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <p className="text-xs text-slate-400">
                    This will open your email client with the message pre-filled.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-slate-900">Get in Touch</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Email</p>
                    <a href="mailto:hello@tripmind.ai" className="text-sm text-primary-500 hover:text-primary-600">
                      hello@tripmind.ai
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Location</p>
                    <p className="text-sm text-slate-600">Remote-first company</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Response Time</p>
                    <p className="text-sm text-slate-600">Within 24 hours on business days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-slate-900">Common Questions</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>
                  <strong>Billing inquiries:</strong> Contact your payment provider or check your billing page.
                </li>
                <li>
                  <strong>Technical issues:</strong> Describe the issue in detail and include your browser info.
                </li>
                <li>
                  <strong>Feature requests:</strong> We love hearing ideas. Tell us what would help you most.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
