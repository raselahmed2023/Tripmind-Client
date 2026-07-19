import { apiClient, normalizePaginated, normalizeSingle, normalizeConversation, normalizeAssistantMessage } from "@/lib";
import type {
  Conversation,
  AssistantMessage,
  CreateConversationRequest,
  SendMessageRequest,
  PaginatedResult,
} from "@/types";

export const assistantService = {
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    const response = await apiClient.post("/ai-assistant/conversations", data);
    return normalizeConversation(response.data);
  },

  async getConversations(params?: { page?: number; limit?: number }): Promise<PaginatedResult<Conversation>> {
    const response = await apiClient.get("/ai-assistant/conversations", { params });
    const result = normalizePaginated<unknown>(response.data);
    return {
      ...result,
      data: result.data.map(normalizeConversation),
    };
  },

  async getConversation(id: string): Promise<Conversation> {
    const response = await apiClient.get(`/ai-assistant/conversations/${id}`);
    return normalizeConversation(response.data);
  },

  async deleteConversation(id: string): Promise<void> {
    await apiClient.delete(`/ai-assistant/conversations/${id}`);
  },

  async getMessages(
    conversationId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResult<AssistantMessage>> {
    const response = await apiClient.get(`/ai-assistant/conversations/${conversationId}/messages`, { params });
    const result = normalizePaginated<unknown>(response.data);
    return {
      ...result,
      data: result.data.map(normalizeAssistantMessage),
    };
  },

  async sendMessage(
    conversationId: string,
    data: SendMessageRequest
  ): Promise<{ userMessage: AssistantMessage; assistantMessage: AssistantMessage }> {
    const response = await apiClient.post(`/ai-assistant/conversations/${conversationId}/messages`, data);
    const body = normalizeSingle<{ userMessage: unknown; assistantMessage: unknown }>(response.data);
    return {
      userMessage: normalizeAssistantMessage(body.userMessage),
      assistantMessage: normalizeAssistantMessage(body.assistantMessage),
    };
  },
};
