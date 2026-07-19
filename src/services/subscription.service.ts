import { apiClient, normalizeSingle } from "@/lib";
import type { Subscription } from "@/types";

export const subscriptionService = {
  async getMe(): Promise<Subscription | null> {
    try {
      const response = await apiClient.get("/subscriptions/me");
      return normalizeSingle<Subscription>(response.data);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 404) return null;
      throw err;
    }
  },
};
