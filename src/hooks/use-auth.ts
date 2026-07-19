"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { authService } from "@/services";
import { AUTH_TOKEN_KEY } from "@/lib";
import type {
  ApiError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types";

const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null, ApiError>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      if (typeof window === "undefined") return null;
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return null;
      try {
        return await authService.getMe();
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const loginMutation = useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.accessToken);
      queryClient.setQueryData(AUTH_QUERY_KEY, data.data.user);
    },
  });

  const registerMutation = useMutation<
    AuthResponse,
    ApiError,
    RegisterRequest
  >({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.accessToken);
      queryClient.setQueryData(AUTH_QUERY_KEY, data.data.user);
    },
  });

  const logoutMutation = useMutation<void, ApiError, void>({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      router.push("/login");
    },
  });

  const getLoginError = useCallback((): string | null => {
    if (!loginMutation.isError) return null;
    const err = loginMutation.error;
    if (err.status === 401) return "Invalid email or password.";
    if (err.status === 429)
      return "Too many attempts. Please try again later.";
    if (typeof navigator !== "undefined" && !navigator.onLine)
      return "You appear to be offline. Please check your connection.";
    if (err.status >= 500)
      return "Something went wrong on our end. Please try again.";
    return err.message || "Login failed. Please try again.";
  }, [loginMutation.isError, loginMutation.error]);

  const getRegisterError = useCallback((): string | null => {
    if (!registerMutation.isError) return null;
    const err = registerMutation.error;
    if (err.status === 409)
      return "An account with this email already exists.";
    if (err.status === 429)
      return "Too many attempts. Please try again later.";
    if (typeof navigator !== "undefined" && !navigator.onLine)
      return "You appear to be offline. Please check your connection.";
    if (err.status >= 500)
      return "Something went wrong on our end. Please try again.";
    if (err.errors) {
      const firstError = Object.values(err.errors)[0];
      if (firstError && firstError.length > 0) return firstError[0];
    }
    return err.message || "Registration failed. Please try again.";
  }, [registerMutation.isError, registerMutation.error]);

  const loginWithRedirect = useCallback(
    (data: LoginRequest, redirectTo: string) => {
      loginMutation.mutate(data, {
        onSuccess: () => {
          router.push(redirectTo);
        },
      });
    },
    [loginMutation, router]
  );

  const registerWithRedirect = useCallback(
    (data: RegisterRequest, redirectTo: string) => {
      registerMutation.mutate(data, {
        onSuccess: () => {
          router.push(redirectTo);
        },
      });
    },
    [registerMutation, router]
  );

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login: loginMutation,
    loginWithRedirect,
    register: registerMutation,
    registerWithRedirect,
    logout: logoutMutation,
    loginError: getLoginError(),
    registerError: getRegisterError(),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
