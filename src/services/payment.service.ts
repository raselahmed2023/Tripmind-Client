import { apiClient } from "@/lib";
import type {
  ApiSuccessResponse,
  Payment,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  CreatePortalSessionResponse,
} from "@/types";

function unwrap<T>(body: T | { success: boolean; data: T }): T {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export const paymentService = {
  async getMe(): Promise<Payment[]> {
    const response = await apiClient.get<
      ApiSuccessResponse<Payment[]> | Payment[]
    >("/payments/me");
    return unwrap(response.data) as Payment[];
  },

  async getById(id: string): Promise<Payment> {
    const response = await apiClient.get<
      ApiSuccessResponse<Payment> | Payment
    >(`/payments/${id}`);
    return unwrap(response.data) as Payment;
  },

  async createCheckoutSession(
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse> {
    const response = await apiClient.post<
      ApiSuccessResponse<CreateCheckoutSessionResponse> | CreateCheckoutSessionResponse
    >("/payments/create-checkout-session", data);
    return unwrap(response.data) as CreateCheckoutSessionResponse;
  },

  async createPortalSession(): Promise<CreatePortalSessionResponse> {
    const response = await apiClient.post<
      ApiSuccessResponse<CreatePortalSessionResponse> | CreatePortalSessionResponse
    >("/subscriptions/create-portal-session");
    return unwrap(response.data) as CreatePortalSessionResponse;
  },
};
