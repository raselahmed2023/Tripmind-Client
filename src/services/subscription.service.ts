import { apiClient } from "@/lib";
import type { ApiSuccessResponse, Subscription } from "@/types";

function unwrap<T>(body: T | { success: boolean; data: T }): T {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export const subscriptionService = {
  async getMe(): Promise<Subscription> {
    const response = await apiClient.get<
      ApiSuccessResponse<Subscription> | Subscription
    >("/subscriptions/me");
    return unwrap(response.data) as Subscription;
  },
};
