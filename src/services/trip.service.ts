import { apiClient } from "@/lib";
import type {
  Trip,
  CreateTripRequest,
  UpdateTripRequest,
  TripQueryParams,
  PaginatedResponse,
} from "@/types";

function cleanParams(
  params: TripQueryParams
): Record<string, string | number> {
  const cleaned: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function unwrap<T>(body: T | { success: boolean; data: T }): T {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export const tripService = {
  async getAll(
    params?: TripQueryParams
  ): Promise<PaginatedResponse<Trip>> {
    const response = await apiClient.get<
      PaginatedResponse<Trip> | { success: boolean; data: PaginatedResponse<Trip> }
    >("/trips", {
      params: params ? cleanParams(params) : undefined,
    });
    return unwrap(response.data);
  },

  async getById(id: string): Promise<Trip> {
    const response = await apiClient.get<
      Trip | { success: boolean; data: Trip }
    >(`/trips/${id}`);
    return unwrap(response.data);
  },

  async create(data: CreateTripRequest): Promise<Trip> {
    const response = await apiClient.post<
      Trip | { success: boolean; data: Trip }
    >("/trips", data);
    return unwrap(response.data);
  },

  async update(id: string, data: UpdateTripRequest): Promise<Trip> {
    const response = await apiClient.patch<
      Trip | { success: boolean; data: Trip }
    >(`/trips/${id}`, data);
    return unwrap(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/trips/${id}`);
  },
};
