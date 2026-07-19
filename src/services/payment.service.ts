import { apiClient, normalizePaginated, normalizePayment, normalizeSingle } from "@/lib";
import type {
  Payment,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  CreatePortalSessionResponse,
  PaginatedResult,
} from "@/types";

export const paymentService = {
  async getAll(params?: { page?: number; limit?: number }): Promise<PaginatedResult<Payment>> {
    const response = await apiClient.get("/payments/me", { params });
    const result = normalizePaginated<unknown>(response.data);
    return {
      ...result,
      data: result.data.map(normalizePayment),
    };
  },

  async getById(id: string): Promise<Payment> {
    const response = await apiClient.get(`/payments/${id}`);
    return normalizePayment(response.data);
  },

  async createCheckoutSession(
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse> {
    const response = await apiClient.post("/payments/create-checkout-session", data);
    return normalizeSingle<CreateCheckoutSessionResponse>(response.data);
  },

  async createPortalSession(): Promise<CreatePortalSessionResponse> {
    const response = await apiClient.post("/subscriptions/create-portal-session");
    return normalizeSingle<CreatePortalSessionResponse>(response.data);
  },
};
