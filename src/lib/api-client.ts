import axios from "axios";
import type { ApiError } from "@/types";

const AUTH_TOKEN_KEY = "auth_token";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const rawMessage = error.response?.data?.message;

    const apiError: ApiError = {
      message: rawMessage || "An unexpected error occurred",
      status: status || 500,
      errors: error.response?.data?.errors,
    };

    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        const currentPath = window.location.pathname;
        const isAuthPage =
          currentPath.startsWith("/login") ||
          currentPath.startsWith("/register");
        if (!isAuthPage) {
          const returnTo = encodeURIComponent(currentPath);
          window.location.href = `/login?redirect=${returnTo}`;
        }
      }
    }

    return Promise.reject(apiError);
  }
);

export { apiClient, AUTH_TOKEN_KEY };
