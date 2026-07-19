"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import { useForm } from "react-hook-form";
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
import { MapPin, Compass, Globe, Brain, Mail } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPageInner() {
  const { loginWithRedirect, loginError, isLoggingIn } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback(
    (data: LoginFormData) => {
      if (isLoggingIn) return;
      loginWithRedirect(data, redirectTo);
    },
    [isLoggingIn, loginWithRedirect, redirectTo]
  );

  const handleDemoLogin = () => {
    setValue("email", "demo@tripmind.ai", { shouldValidate: true });
    setValue("password", "Demo123!", { shouldValidate: true });
  };

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
              Welcome back to your travel command center
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-primary-100">
              Pick up right where you left off. Your AI-powered itineraries,
              saved destinations, and trip insights are waiting.
            </p>
            <div className="mt-10 space-y-4">
              {[
                { icon: Brain, text: "AI-generated daily itineraries" },
                { icon: Compass, text: "Personalized destination picks" },
                { icon: Globe, text: "Real-time budget tracking" },
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
                  Sign in to TripMind
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Enter your credentials to access your travel dashboard
                </p>
              </CardHeader>
              <CardContent className="px-0 sm:px-6 sm:pb-6">
                {loginError && (
                  <Alert variant="error" className="mb-6">
                    {loginError}
                  </Alert>
                )}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
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
                        disabled={isLoggingIn}
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
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoggingIn}
                      error={errors.password?.message}
                      {...register("password")}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-slate-600"
                    >
                      Remember me
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoggingIn}
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Signing in..." : "Sign in"}
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
                  disabled
                  aria-label="Google sign-in coming soon"
                  title="Google sign-in will be connected after backend OAuth setup"
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
                  Google sign-in will be available after backend OAuth setup
                </p>

                <div className="mt-6 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDemoLogin}
                    disabled={isLoggingIn}
                  >
                    Try demo account
                  </Button>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                  <p className="text-sm text-slate-500">
                    New to TripMind?{" "}
                    <Link
                      href="/register"
                      className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      Create an account
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
