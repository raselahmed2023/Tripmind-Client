import { apiClient, normalizePaginated, normalizeSingle } from "@/lib";
import type {
  Destination,
  DestinationQueryParams,
  AdminDestinationQueryParams,
  CreateDestinationRequest,
  UpdateDestinationRequest,
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

export const destinationService = {
  async getAll(params?: DestinationQueryParams): Promise<PaginatedResult<Destination>> {
    const response = await apiClient.get("/destinations", {
      params: params ? cleanParams(params as Record<string, unknown>) : undefined,
    });
    return normalizePaginated<Destination>(response.data);
  },

  async getBySlug(slug: string): Promise<Destination> {
    const response = await apiClient.get(`/destinations/${slug}`);
    return normalizeSingle<Destination>(response.data);
  },

  async getAdminAll(params?: AdminDestinationQueryParams): Promise<PaginatedResult<Destination>> {
    const response = await apiClient.get("/destinations/admin/all", {
      params: params ? cleanParams(params as Record<string, unknown>) : undefined,
    });
    return normalizePaginated<Destination>(response.data);
  },

  async getAdminById(id: string): Promise<Destination> {
    const response = await apiClient.get(`/destinations/admin/${id}`);
    return normalizeSingle<Destination>(response.data);
  },

  async create(data: CreateDestinationRequest): Promise<Destination> {
    const response = await apiClient.post("/destinations", data);
    return normalizeSingle<Destination>(response.data);
  },

  async update(id: string, data: UpdateDestinationRequest): Promise<Destination> {
    const response = await apiClient.patch(`/destinations/${id}`, data);
    return normalizeSingle<Destination>(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/destinations/${id}`);
  },
};
