import { apiClient, normalizeSingle } from "@/lib";
import type {
  TripPlanPaymentStatus,
  TripPlanCheckoutResponse,
  TripPlanVerificationResponse,
} from "@/types";

export const tripPlanPaymentService = {
  async getStatus(tripId: string): Promise<TripPlanPaymentStatus> {
    const response = await apiClient.get(`/payments/trip-plan/status/${tripId}`);
    return normalizeSingle<TripPlanPaymentStatus>(response.data);
  },

  async createCheckout(tripId: string): Promise<TripPlanCheckoutResponse> {
    const response = await apiClient.post("/payments/trip-plan/checkout", { tripId });
    return normalizeSingle<TripPlanCheckoutResponse>(response.data);
  },

  async verifyPayment(sessionId: string): Promise<TripPlanVerificationResponse> {
    const response = await apiClient.post("/payments/trip-plan/verify", { sessionId });
    return normalizeSingle<TripPlanVerificationResponse>(response.data);
  },
};
