"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assistantService } from "@/services";
import type { ApiError } from "@/types";

const CONVERSATIONS_QUERY_KEY = ["assistant", "conversations"] as const;
const MESSAGES_QUERY_KEY = ["assistant", "messages"] as const;

export function useConversations() {
  return useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: () => assistantService.getConversations({ limit: 50 }),
    staleTime: 30 * 1000,
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: [...MESSAGES_QUERY_KEY, conversationId],
    queryFn: () => assistantService.getMessages(conversationId!, { limit: 100 }),
    enabled: !!conversationId,
    staleTime: 10 * 1000,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { tripId?: string; title?: string }) =>
      assistantService.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      assistantService.sendMessage(conversationId, { content }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...MESSAGES_QUERY_KEY, variables.conversationId],
      });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assistantService.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });
}

export function getAssistantError(error: unknown): string {
  const apiError = error as ApiError;
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "You appear to be offline. Please check your connection.";
  }
  if (apiError?.status === 429) return "Too many requests. Please wait a moment.";
  if (apiError?.status && apiError.status >= 500) return "Server error. Please try again later.";
  if (apiError?.errors) {
    const firstError = Object.values(apiError.errors)[0];
    if (firstError && firstError.length > 0) return firstError[0];
  }
  return apiError?.message || "An unexpected error occurred.";
}
