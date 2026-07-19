import axios from "axios";
import type { ApiError } from "@/types";

const AUTH_TOKEN_KEY = "auth_token";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

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
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      const isAuthPage =
        currentPath.startsWith("/login") ||
        currentPath.startsWith("/register") ||
        currentPath.startsWith("/auth/");

      if (isAuthPage) {
        const rawMessage = error.response?.data?.message;
        return Promise.reject({
          message: rawMessage || "An unexpected error occurred",
          status: status || 500,
          errors: error.response?.data?.errors,
        } as ApiError);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { data } = response.data;
        const newToken = data?.accessToken || response.data?.data?.accessToken;

        if (newToken) {
          localStorage.setItem(AUTH_TOKEN_KEY, newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }

        processQueue(new Error("No token"), null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject({
          message: "Session expired. Please log in again.",
          status: 401,
        } as ApiError);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject({
          message: "Session expired. Please log in again.",
          status: 401,
        } as ApiError);
      } finally {
        isRefreshing = false;
      }
    }

    const rawMessage = error.response?.data?.message;
    const apiError: ApiError = {
      message: rawMessage || "An unexpected error occurred",
      status: status || 500,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

export { apiClient, AUTH_TOKEN_KEY };
