"use client";

import Link from "next/link";
import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
} from "@/components/ui";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks";
import { RedirectGuard } from "@/components/auth";
import { sanitizeRedirect } from "@/utils";
import {
  MapPin,
  Compass,
  Globe,
  Brain,
  Mail,
  User,
  Check,
} from "lucide-react";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function PasswordRequirements({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1" aria-label="Password requirements">
      {checks.map((check) => (
        <div key={check.label} className="flex items-center gap-1.5">
          <Check
            className={`h-3 w-3 ${
              check.met ? "text-green-500" : "text-slate-300"
            }`}
            aria-hidden="true"
          />
          <span
            className={`text-xs ${
              check.met ? "text-green-600" : "text-slate-400"
            }`}
          >
            {check.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function RegisterPageInner() {
  const { register: registerMutation, registerError, isRegistering } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = useWatch({ control, name: "password" });

  const onSubmit = useCallback(
    (data: RegisterFormData) => {
      if (isRegistering) return;
      registerMutation.mutate(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );
    },
    [isRegistering, registerMutation]
  );

  return (
    <RedirectGuard>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="hidden w-1/2 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 lg:flex lg:flex-col lg:justify-center lg:px-12 xl:px-20">
          <div className="max-w-md">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-white/15 backdrop-blur-sm">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TripMind</span>
            </div>
            <h2 className="text-3xl font-bold text-white xl:text-4xl">
              Start planning smarter trips today
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-primary-100">
              Build perfect itineraries with AI, optimize budgets,
              and discover hidden gems at every destination.
            </p>
            <div className="mt-10 space-y-4">
              {[
                { icon: Brain, text: "AI builds your itinerary in seconds" },
                {
                  icon: Compass,
                  text: "Discover destinations you never knew",
                },
                { icon: Globe, text: "Budget-aware itinerary planning" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-primary-100">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-primary-100">
                <MapPin className="h-6 w-6 text-primary-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">TripMind</h1>
            </div>

            <Card className="border-0 shadow-none bg-transparent sm:border sm:shadow-sm sm:bg-white">
              <CardHeader className="px-0 sm:px-6 sm:pt-6">
                <CardTitle className="text-2xl">
                  Create your account
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Plan your next adventure with AI-powered insights
                </p>
              </CardHeader>
              <CardContent className="px-0 sm:px-6 sm:pb-6">
                {registerError && (
                  <Alert variant="error" className="mb-6" role="alert">
                    {registerError}
                  </Alert>
                )}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Full name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your full name"
                        disabled={isRegistering}
                        className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.name
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-slate-300"
                        }`}
                        {...register("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        disabled={isRegistering}
                        className={`flex h-10 w-full rounded-[var(--radius-md)] border bg-white pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.email
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-slate-300"
                        }`}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500" role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <PasswordInput
                      id="password"
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      disabled={isRegistering}
                      error={errors.password?.message}
                      {...register("password")}
                    />
                    <PasswordRequirements password={watchedPassword || ""} />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Confirm password
                    </label>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      disabled={isRegistering}
                      error={errors.confirmPassword?.message}
                      {...register("confirmPassword")}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isRegistering}
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-slate-400">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
                    sessionStorage.setItem("post_login_redirect", redirectTo);
                    window.location.href = `${apiUrl}/auth/google`;
                  }}
                  leftIcon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  }
                >
                  Continue with Google
                </Button>

                <p className="mt-3 text-center text-xs text-slate-400">
                  Sign in with your Google account
                </p>

                <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RedirectGuard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
        </div>
      }
    >
      <RegisterPageInner />
    </Suspense>
  );
}
