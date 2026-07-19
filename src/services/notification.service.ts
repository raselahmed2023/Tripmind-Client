import { apiClient, normalizePaginated, normalizeNotification } from "@/lib";
import type {
  Notification,
  NotificationQueryParams,
  PaginatedResult,
} from "@/types";

function cleanParams<T extends Record<string, unknown>>(params: T): Record<string, string | number> {
  const cleaned: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value as string | number;
    }
  }
  return cleaned;
}

export const notificationService = {
  async getAll(params?: NotificationQueryParams): Promise<PaginatedResult<Notification>> {
    const response = await apiClient.get("/notifications", {
      params: params ? cleanParams(params as Record<string, unknown>) : undefined,
    });
    const result = normalizePaginated<unknown>(response.data);
    return {
      ...result,
      data: result.data.map(normalizeNotification),
    };
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get("/notifications/unread-count");
    const body = response.data;
    if (body && typeof body === "object" && "data" in body) {
      return Number((body as { data: { count: number } }).data.count || 0);
    }
    return 0;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    const body = response.data;
    if (body && typeof body === "object" && "data" in body) {
      return normalizeNotification((body as { data: unknown }).data);
    }
    return normalizeNotification(body);
  },

  async markAllAsRead(): Promise<number> {
    const response = await apiClient.patch("/notifications/read-all");
    const body = response.data;
    if (body && typeof body === "object" && "data" in body) {
      return Number((body as { data: { modifiedCount: number } }).data.modifiedCount || 0);
    }
    return 0;
  },

  async deleteOne(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },

  async clearRead(): Promise<number> {
    const response = await apiClient.delete("/notifications/clear-read");
    const body = response.data;
    if (body && typeof body === "object" && "data" in body) {
      return Number((body as { data: { deletedCount: number } }).data.deletedCount || 0);
    }
    return 0;
  },
};
