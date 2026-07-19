import { apiClient } from "@/lib";
import type { Itinerary, GenerateItineraryRequest } from "@/types";

function unwrap<T>(body: T | { success: boolean; data: T }): T {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export const aiService = {
  async generateItinerary(
    data: GenerateItineraryRequest
  ): Promise<{ itinerary: Itinerary; creditsRemaining: number }> {
    const response = await apiClient.post<
      { success: boolean; data: { itinerary: Itinerary; creditsRemaining: number } } |
      { itinerary: Itinerary; creditsRemaining: number }
    >(`/ai/${data.tripId}/generate`);
    return unwrap(response.data) as { itinerary: Itinerary; creditsRemaining: number };
  },

  async getItinerary(itineraryId: string): Promise<Itinerary | null> {
    try {
      const response = await apiClient.get<
        { success: boolean; data: Itinerary } | Itinerary
      >(`/itineraries/${itineraryId}`);
      return unwrap(response.data) as Itinerary;
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 404) return null;
      throw err;
    }
  },
};
