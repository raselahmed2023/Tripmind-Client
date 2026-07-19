export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: User;
}

export type TripStatus =
  | "draft"
  | "planned"
  | "ongoing"
  | "completed"
  | "cancelled";

export type TravelStyle = "budget" | "mid-range" | "luxury";

export const TRIP_STATUS_OPTIONS: { value: TripStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "planned", label: "Planned" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const TRAVEL_STYLE_OPTIONS: { value: TravelStyle; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "mid-range", label: "Mid-Range" },
  { value: "luxury", label: "Luxury" },
];

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (\u20ac)" },
  { value: "GBP", label: "GBP (\u00a3)" },
  { value: "JPY", label: "JPY (\u00a5)" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
  { value: "CHF", label: "CHF" },
  { value: "CNY", label: "CNY" },
] as const;

export interface Trip {
  _id: string;
  userId: string;
  destinationId: string;
  destination?: Destination;
  title: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  travelStyle: TravelStyle;
  interests: string[];
  accommodationPreference: string;
  transportPreference: string;
  status: TripStatus;
  estimatedCost: number;
  notes: string;
  itineraryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripRequest {
  destinationId: string;
  title: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  travelStyle: TravelStyle;
  interests: string[];
  accommodationPreference: string;
  transportPreference: string;
  notes: string;
}

export type UpdateTripRequest = Partial<
  Omit<CreateTripRequest, "destinationId">
> & {
  status?: TripStatus;
};

export interface TripQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  destinationId?: string;
  sort?: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: "info" | "success" | "warning" | "reminder" | "ai_generation_started" | "ai_generation_completed" | "ai_generation_failed" | "trip_updated" | "trip_starting_soon" | "budget_warning" | "itinerary_finalized" | "payment_completed" | "payment_failed" | "subscription_activated" | "subscription_cancelled" | "ai_credits_added";
  title: string;
  message: string;
  read: boolean;
  link?: string;
  relatedTripId?: string;
  relatedItineraryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface Subscription {
  id: string;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "canceled" | "past_due" | "trialing";
  aiCreditsRemaining: number;
  aiCreditsTotal: number;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  description: string;
  productType?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckoutSessionRequest {
  productType: "pro_monthly" | "credits_pack";
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface CreatePortalSessionResponse {
  url: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: string;
}

export interface Destination {
  _id: string;
  title: string;
  slug: string;
  country: string;
  city: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  category: string;
  averageDailyCost: number;
  currency: string;
  rating: number;
  reviewCount: number;
  bestSeason: string;
  recommendedDays: number;
  latitude: number;
  longitude: number;
  highlights: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  country?: string;
  bestSeason?: string;
  minRating?: number;
  minCost?: number;
  maxCost?: number;
  sort?: string;
}

export type DestinationSortOption = "newest" | "rating_desc" | "cost_asc" | "cost_desc";

export const DESTINATION_SORT_OPTIONS: { value: DestinationSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "rating_desc", label: "Highest Rating" },
  { value: "cost_asc", label: "Lowest Cost" },
  { value: "cost_desc", label: "Highest Cost" },
];

export const DESTINATION_CATEGORIES = [
  "Beach",
  "Mountain",
  "City",
  "Countryside",
  "Historical",
  "Adventure",
  "Island",
  "Cultural",
] as const;

export const DESTINATION_SEASONS = [
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
  "Year-round",
] as const;

// AI Itinerary Types

export interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
  location?: string;
  cost?: number;
  duration?: string;
  tips?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  morning: ItineraryActivity[];
  afternoon: ItineraryActivity[];
  evening: ItineraryActivity[];
  estimatedCost: number;
  travelTime?: string;
  notes?: string;
}

export interface ItineraryBudget {
  accommodation: number;
  transportation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
  currency: string;
}

export interface ItineraryWeather {
  day: number;
  temperature: { high: number; low: number };
  condition: string;
  icon?: string;
}

export interface Itinerary {
  _id: string;
  tripId: string;
  userId: string;
  title: string;
  overview: string;
  days: ItineraryDay[];
  budget: ItineraryBudget;
  tips: string[];
  warnings: string[];
  packingSuggestions: string[];
  weather?: ItineraryWeather[];
  hotels: { name: string; location: string; pricePerNight: number; rating: number; description: string }[];
  restaurants: { name: string; cuisine: string; priceRange: string; description: string }[];
  transportation: { from: string; to: string; mode: string; duration: string; cost: number }[];
  generatedAt: string;
  model?: string;
}

export interface GenerateItineraryRequest {
  tripId: string;
}

export interface GenerateItineraryResponse {
  success: boolean;
  message: string;
  data: {
    itinerary: Itinerary;
    creditsRemaining: number;
  };
}

export interface AiCreditsInfo {
  remaining: number;
  total: number;
  plan: string;
}
