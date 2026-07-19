import { apiClient, normalizePaginated, normalizeTrip } from "@/lib";
import type {
  Trip,
  CreateTripRequest,
  UpdateTripRequest,
  TripQueryParams,
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

export const tripService = {
  async getAll(params?: TripQueryParams): Promise<PaginatedResult<Trip>> {
    const response = await apiClient.get("/trips", {
      params: params ? cleanParams(params as Record<string, unknown>) : undefined,
    });
    const result = normalizePaginated<unknown>(response.data);
    return {
      ...result,
      data: result.data.map(normalizeTrip),
    };
  },

  async getById(id: string): Promise<Trip> {
    const response = await apiClient.get(`/trips/${id}`);
    return normalizeTrip(response.data);
  },

  async create(data: CreateTripRequest): Promise<Trip> {
    const response = await apiClient.post("/trips", data);
    return normalizeTrip(response.data);
  },

  async update(id: string, data: UpdateTripRequest): Promise<Trip> {
    const response = await apiClient.patch(`/trips/${id}`, data);
    return normalizeTrip(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/trips/${id}`);
  },
};
