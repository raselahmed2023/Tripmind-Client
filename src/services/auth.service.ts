import { apiClient, normalizeSingle } from "@/lib";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  GoogleExchangeRequest,
  UpdateProfileRequest,
} from "@/types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", data);
    return normalizeSingle<AuthResponse>(response.data);
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/register", data);
    return normalizeSingle<AuthResponse>(response.data);
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get("/auth/me");
    return normalizeSingle<User>(response.data);
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async googleExchange(data: GoogleExchangeRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/google/exchange", data);
    return normalizeSingle<AuthResponse>(response.data);
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.patch("/user/me", data);
    return normalizeSingle<User>(response.data);
  },
};
