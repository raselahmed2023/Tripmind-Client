import type { PaginatedResult, Trip, Destination, Notification, Payment, Conversation, AssistantMessage } from "@/types";

// ============================================================
// Raw backend envelope shapes (what Axios returns)
// ============================================================

interface RawPaginatedEnvelope<T> {
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

interface RawSuccessEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============================================================
// Paginated normalizer
// ============================================================

export function normalizePaginated<T>(raw: unknown): PaginatedResult<T> {
  const body = raw as RawPaginatedEnvelope<T>;

  if (body && typeof body === "object" && "pagination" in body && Array.isArray(body.data)) {
    return {
      data: body.data,
      page: body.pagination.page,
      limit: body.pagination.limit,
      total: body.pagination.total,
      totalPages: body.pagination.totalPages,
    };
  }

  // Fallback: if it's already a flat paginated shape
  const flat = raw as PaginatedResult<T>;
  if (flat && typeof flat === "object" && "data" in flat && "page" in flat && "total" in flat) {
    return flat;
  }

  return { data: [], page: 1, limit: 10, total: 0, totalPages: 0 };
}

// ============================================================
// Single-resource normalizer
// ============================================================

export function normalizeSingle<T>(raw: unknown): T {
  const body = raw as RawSuccessEnvelope<T>;

  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return body.data as T;
  }

  return raw as T;
}

// ============================================================
// Domain-specific normalizers
// ============================================================

export function normalizeTrip(raw: unknown): Trip {
  const trip = normalizeSingle<Record<string, unknown>>(raw);

  // Handle populated destinationId (backend may return object or string)
  const destField = trip.destinationId;
  let destinationId: string;
  let destination: Destination | null = null;

  if (destField && typeof destField === "object" && "_id" in destField) {
    // destinationId is populated as a Destination object
    destination = destField as unknown as Destination;
    destinationId = destination._id;
  } else if (typeof destField === "string") {
    destinationId = destField;
    // destination may be a separate field
    destination = (trip.destination as Destination) || null;
  } else {
    destinationId = "";
    destination = null;
  }

  // Handle itineraryId (may be string or populated object)
  const itinField = trip.itineraryId;
  let itineraryId: string | null = null;
  if (typeof itinField === "string") {
    itineraryId = itinField;
  } else if (itinField && typeof itinField === "object" && "_id" in itinField) {
    itineraryId = (itinField as { _id: string })._id;
  }

  return {
    _id: String(trip._id || ""),
    userId: String(trip.userId || ""),
    destinationId,
    destination,
    title: String(trip.title || ""),
    startDate: String(trip.startDate || ""),
    endDate: String(trip.endDate || ""),
    travelers: Number(trip.travelers || 1),
    budget: Number(trip.budget || 0),
    currency: String(trip.currency || "USD"),
    travelStyle: (trip.travelStyle as Trip["travelStyle"]) || "mid-range",
    interests: Array.isArray(trip.interests) ? trip.interests : [],
    accommodationPreference: String(trip.accommodationPreference || ""),
    transportPreference: String(trip.transportPreference || ""),
    status: (trip.status as Trip["status"]) || "draft",
    estimatedCost: Number(trip.estimatedCost || 0),
    notes: String(trip.notes || ""),
    itineraryId,
    createdAt: String(trip.createdAt || ""),
    updatedAt: String(trip.updatedAt || ""),
  };
}

export function normalizeNotification(raw: unknown): Notification {
  const n = normalizeSingle<Record<string, unknown>>(raw);

  return {
    _id: String(n._id || ""),
    userId: String(n.userId || ""),
    type: (n.type as Notification["type"]) || "info",
    title: String(n.title || ""),
    message: String(n.message || ""),
    relatedEntityType: (n.relatedEntityType as Notification["relatedEntityType"]) || "system",
    relatedEntityId: n.relatedEntityId ? String(n.relatedEntityId) : null,
    isRead: Boolean(n.isRead),
    metadata: (n.metadata as Record<string, unknown>) || {},
    createdAt: String(n.createdAt || ""),
    updatedAt: String(n.updatedAt || ""),
  };
}

export function normalizePayment(raw: unknown): Payment {
  const p = normalizeSingle<Record<string, unknown>>(raw);

  return {
    _id: String(p._id || ""),
    userId: String(p.userId || ""),
    stripeCheckoutSessionId: p.stripeCheckoutSessionId ? String(p.stripeCheckoutSessionId) : null,
    stripePaymentIntentId: p.stripePaymentIntentId ? String(p.stripePaymentIntentId) : null,
    stripeCustomerId: p.stripeCustomerId ? String(p.stripeCustomerId) : null,
    stripeSubscriptionId: p.stripeSubscriptionId ? String(p.stripeSubscriptionId) : null,
    productType: (p.productType as Payment["productType"]) || "subscription",
    plan: (p.plan as Payment["plan"]) || "pro_monthly",
    amount: Number(p.amount || 0),
    currency: String(p.currency || "usd"),
    status: (p.status as Payment["status"]) || "pending",
    metadata: (p.metadata as Record<string, unknown>) || {},
    paidAt: p.paidAt ? String(p.paidAt) : null,
    createdAt: String(p.createdAt || ""),
    updatedAt: String(p.updatedAt || ""),
  };
}

export function normalizeConversation(raw: unknown): Conversation {
  const c = normalizeSingle<Record<string, unknown>>(raw);

  return {
    _id: String(c._id || ""),
    userId: String(c.userId || ""),
    tripId: c.tripId ? String(c.tripId) : null,
    title: String(c.title || ""),
    status: (c.status as Conversation["status"]) || "active",
    createdAt: String(c.createdAt || ""),
    updatedAt: String(c.updatedAt || ""),
  };
}

export function normalizeAssistantMessage(raw: unknown): AssistantMessage {
  const m = normalizeSingle<Record<string, unknown>>(raw);

  return {
    _id: String(m._id || ""),
    conversationId: String(m.conversationId || ""),
    role: (m.role as AssistantMessage["role"]) || "user",
    content: String(m.content || ""),
    toolCalls: Array.isArray(m.toolCalls) ? m.toolCalls : [],
    createdAt: String(m.createdAt || ""),
    updatedAt: String(m.updatedAt || ""),
  };
}
