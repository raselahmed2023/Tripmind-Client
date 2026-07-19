import { apiClient, normalizeSingle } from "@/lib";
import type { Itinerary, GenerateItineraryRequest } from "@/types";

interface GenerateItineraryResult {
  itinerary: Itinerary;
  generationTimeMs: number;
}

export const aiService = {
  async generateItinerary(
    data: GenerateItineraryRequest
  ): Promise<GenerateItineraryResult> {
    const response = await apiClient.post(`/ai/${data.tripId}/generate`, {
      dietaryPreferences: data.dietaryPreferences,
      accessibilityNeeds: data.accessibilityNeeds,
      activityPreferences: data.activityPreferences,
      additionalNotes: data.additionalNotes,
    });
    return normalizeSingle<GenerateItineraryResult>(response.data);
  },

  async getItinerary(itineraryId: string): Promise<Itinerary | null> {
    try {
      const response = await apiClient.get(`/itineraries/${itineraryId}`);
      return normalizeSingle<Itinerary>(response.data);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 404) return null;
      throw err;
    }
  },
};
