import { apiClient } from "@/lib";
import type {
  Destination,
  DestinationQueryParams,
  PaginatedResponse,
  CreateDestinationRequest,
} from "@/types";

function unwrap<T>(body: T | { success: boolean; data: T }): T {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

function cleanParams(
  params: DestinationQueryParams
): Record<string, string | number> {
  const cleaned: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export const destinationService = {
  async getAll(
    params?: DestinationQueryParams
  ): Promise<PaginatedResponse<Destination>> {
    const response = await apiClient.get<
      PaginatedResponse<Destination> | { success: boolean; data: PaginatedResponse<Destination> }
    >("/destinations", {
      params: params ? cleanParams(params) : undefined,
    });

    return unwrap(response.data) as PaginatedResponse<Destination>;
  },

  async getBySlug(slug: string): Promise<Destination> {
    const response = await apiClient.get<
      Destination | { success: boolean; data: Destination }
    >(`/destinations/${slug}`);

    return unwrap(response.data) as Destination;
  },

  async getById(id: string): Promise<Destination> {
    const response = await apiClient.get<
      Destination | { success: boolean; data: Destination }
    >(`/destinations/${id}`);

    return unwrap(response.data) as Destination;
  },

  async create(data: CreateDestinationRequest): Promise<Destination> {
    const response = await apiClient.post<
      Destination | { success: boolean; data: Destination }
    >("/destinations", data);

    return unwrap(response.data) as Destination;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/destinations/${id}`);
  },
};
