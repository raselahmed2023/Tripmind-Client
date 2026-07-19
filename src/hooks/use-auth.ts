"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services";
import { AUTH_TOKEN_KEY } from "@/lib";
import type { LoginRequest, RegisterRequest, ApiError } from "@/types";

const AUTH_QUERY_KEY = ["auth", "me"] as const;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.getMe,
    enabled: !!getToken(),
    retry: (failureCount, error) => {
      const status = (error as unknown as ApiError)?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      router.push("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      removeToken();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      router.push("/login");
    },
  });

  const googleExchangeMutation = useMutation({
    mutationFn: (code: string) => authService.googleExchange({ code }),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      router.push("/dashboard");
    },
  });

  const getLoginError = useCallback((): string | null => {
    const error = loginMutation.error as unknown as ApiError | undefined;
    if (!error) return null;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return "You appear to be offline. Please check your connection.";
    }
    if (error.status === 401) return "Invalid email or password.";
    if (error.status === 429) return "Too many attempts. Please wait a moment.";
    if (error.status && error.status >= 500) return "Server error. Please try again later.";
    return error.message || "Login failed. Please try again.";
  }, [loginMutation.error]);

  const getRegisterError = useCallback((): string | null => {
    const error = registerMutation.error as unknown as ApiError | undefined;
    if (!error) return null;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return "You appear to be offline. Please check your connection.";
    }
    if (error.status === 409) return "An account with this email already exists.";
    if (error.status === 429) return "Too many attempts. Please wait a moment.";
    if (error.status && error.status >= 500) return "Server error. Please try again later.";
    return error.message || "Registration failed. Please try again.";
  }, [registerMutation.error]);

  return {
    user: user ?? null,
    isAuthenticated: !!user && !!getToken(),
    isAdmin: user?.role === "admin",
    isLoadingUser,
    userError: userError as ApiError | null,

    login: loginMutation,
    isLoggingIn: loginMutation.isPending,
    loginWithRedirect: (data: LoginRequest, redirectTo?: string | null) => {
      loginMutation.mutate(data, {
        onSuccess: () => {
          if (redirectTo) {
            router.push(redirectTo);
          }
        },
      });
    },
    loginError: getLoginError(),

    register: registerMutation,
    isRegistering: registerMutation.isPending,
    registerError: getRegisterError(),

    logout: logoutMutation,
    isLoggingOut: logoutMutation.isPending,

    googleExchange: googleExchangeMutation,
    isGoogleExchanging: googleExchangeMutation.isPending,
    googleExchangeError: googleExchangeMutation.error
      ? ((googleExchangeMutation.error as unknown as ApiError).message || "Google authentication failed.")
      : null,
  };
}
