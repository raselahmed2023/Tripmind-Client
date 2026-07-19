// ============================================================
// API Response Envelope Types (backend contract source of truth)
// ============================================================

export interface ApiSuccessResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiPaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// ============================================================
// Normalized paginated result (derived from envelope)
// ============================================================

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================
// Auth
// ============================================================

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
  authProvider: "local" | "google";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface GoogleExchangeRequest {
  code: string;
}

// ============================================================
// Destinations
// ============================================================

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
  status: "draft" | "published";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDestinationRequest {
  title: string;
  country: string;
  city: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  category: string;
  averageDailyCost: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  bestSeason: string;
  recommendedDays: number;
  latitude: number;
  longitude: number;
  highlights: string[];
  status?: "draft" | "published";
}

export type UpdateDestinationRequest = Partial<CreateDestinationRequest>;

export interface DestinationQueryParams {
  search?: string;
  category?: string;
  country?: string;
  bestSeason?: string;
  minCost?: number;
  maxCost?: number;
  minRating?: number;
  sort?: DestinationSortOption;
  page?: number;
  limit?: number;
}

export interface AdminDestinationQueryParams extends DestinationQueryParams {
  status?: "draft" | "published";
}

export type DestinationSortOption = "newest" | "highest_rating" | "lowest_cost" | "highest_cost";

export const DESTINATION_SORT_OPTIONS: { value: DestinationSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "highest_rating", label: "Highest Rating" },
  { value: "lowest_cost", label: "Lowest Cost" },
  { value: "highest_cost", label: "Highest Cost" },
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

// ============================================================
// Trips
// ============================================================

export type TripStatus = "draft" | "planned" | "ongoing" | "completed" | "cancelled";

export type TravelStyle = "budget" | "mid-range" | "luxury";

export interface Trip {
  _id: string;
  userId: string;
  destinationId: string;
  destination: Destination | null;
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
  itineraryId: string | null;
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

export type UpdateTripRequest = Partial<Omit<CreateTripRequest, "destinationId">> & {
  status?: TripStatus;
};

export interface TripQueryParams {
  status?: TripStatus;
  travelStyle?: TravelStyle;
  sort?: string;
  page?: number;
  limit?: number;
}

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

// ============================================================
// AI Itinerary (matches backend exactly)
// ============================================================

export interface ItineraryActivity {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  estimatedCost: number;
  category: string;
  location: string;
  notes: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  _id: string;
  tripId: string;
  userId: string;
  destinationId: string;
  summary: string;
  days: ItineraryDay[];
  costBreakdown: Record<string, number>;
  warnings: string[];
  recommendations: string[];
  status: "draft" | "finalized" | "archived";
  generatedAt: string;
  aiModel: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GenerateItineraryRequest {
  tripId: string;
  dietaryPreferences?: string;
  accessibilityNeeds?: string;
  activityPreferences?: string[];
  additionalNotes?: string;
}

// ============================================================
// Notifications (matches backend exactly)
// ============================================================

export type NotificationType =
  | "ai_generation_started"
  | "ai_generation_completed"
  | "ai_generation_failed"
  | "trip_updated"
  | "trip_starting_soon"
  | "budget_warning"
  | "itinerary_finalized"
  | "payment_completed"
  | "payment_failed"
  | "subscription_activated"
  | "subscription_cancelled"
  | "ai_credits_added";

export type RelatedEntityType = "trip" | "itinerary" | "destination" | "system";

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityType: RelatedEntityType;
  relatedEntityId: string | null;
  isRead: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQueryParams {
  type?: NotificationType;
  isRead?: "true" | "false";
  sort?: string;
  page?: number;
  limit?: number;
}

// ============================================================
// Subscriptions (matches backend exactly)
// ============================================================

export type SubscriptionPlan = "free" | "pro_monthly";

export type SubscriptionStatus = "active" | "past_due" | "cancelled" | "expired";

export interface Subscription {
  _id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  aiCredits: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Payments (matches backend exactly)
// ============================================================

export type ProductType = "subscription" | "credit_pack";

export type PaymentPlan = "pro_monthly" | "ai_credits_10";

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";

export interface Payment {
  _id: string;
  userId: string;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  productType: ProductType;
  plan: PaymentPlan;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata: Record<string, unknown>;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckoutSessionRequest {
  productType: ProductType;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface CreatePortalSessionResponse {
  url: string;
}

// ============================================================
// AI Assistant (matches backend exactly)
// ============================================================

export interface Conversation {
  _id: string;
  userId: string;
  tripId: string | null;
  title: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ToolCall {
  toolName: string;
  result: Record<string, unknown>;
}

export interface AssistantMessage {
  _id: string;
  conversationId: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolCalls: ToolCall[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationRequest {
  tripId?: string;
  title?: string;
}

export interface SendMessageRequest {
  content: string;
}

// ============================================================
// User Profile
// ============================================================

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
}
