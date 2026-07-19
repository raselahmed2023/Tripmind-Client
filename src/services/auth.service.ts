import { apiClient } from "@/lib";
import type {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RegisterRequest,
  User,
} from "@/types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      data
    );
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<MeResponse>("/auth/me");
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};
