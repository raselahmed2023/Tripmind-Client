import { apiClient } from "@/lib";
import type {
  Destination,
  DestinationQueryParams,
  PaginatedResponse,
} from "@/types";

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

    const body = response.data;
    if (body && typeof body === "object" && "success" in body && "data" in body) {
      return (body as { data: PaginatedResponse<Destination> }).data;
    }
    return body as PaginatedResponse<Destination>;
  },

  async getBySlug(slug: string): Promise<Destination> {
    const response = await apiClient.get<
      Destination | { success: boolean; data: Destination }
    >(`/destinations/${slug}`);

    const body = response.data;
    if (body && typeof body === "object" && "success" in body && "data" in body) {
      return (body as { data: Destination }).data;
    }
    return body as Destination;
  },
};
