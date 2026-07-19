import { apiClient } from "@/lib";
import type {
  Notification,
  UnreadCountResponse,
  PaginatedResponse,
  NotificationQueryParams,
} from "@/types";

function unwrap<T>(body: T | { success: boolean; data: T }): T {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

function cleanParams(
  params: NotificationQueryParams
): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export const notificationService = {
  async getAll(
    params?: NotificationQueryParams
  ): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get<
      PaginatedResponse<Notification> | { success: boolean; data: PaginatedResponse<Notification> }
    >("/notifications", {
      params: params ? cleanParams(params) : undefined,
    });
    return unwrap(response.data) as PaginatedResponse<Notification>;
  },

  async getUnreadCount(): Promise<number> {
    const response =
      await apiClient.get<UnreadCountResponse>("/notifications/unread-count");
    return response.data.data.count;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch("/notifications/read-all");
  },

  async deleteOne(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },

  async clearRead(): Promise<void> {
    await apiClient.delete("/notifications/clear-read");
  },
};
