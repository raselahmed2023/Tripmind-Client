"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  MapPin,
  Calendar,
  Compass,
  Sparkles,
  ChevronDown,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { useTrips } from "@/hooks";
import {
  useConversations,
  useMessages,
  useCreateConversation,
  useSendMessage,
  useDeleteConversation,
  getAssistantError,
} from "@/hooks/use-assistant";
import { cn } from "@/utils";

const suggestedPrompts = [
  { icon: MapPin, text: "What are the best restaurants near my hotel?" },
  { icon: Calendar, text: "Help me adjust my itinerary for rain tomorrow." },
  { icon: Compass, text: "Suggest hidden gems in my destination." },
  { icon: Sparkles, text: "Optimize my budget for the remaining days." },
];

export default function AIAssistantPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showTripSelector, setShowTripSelector] = useState(false);
  const [showConversations, setShowConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: tripsData } = useTrips({ limit: 20 });
  const trips = tripsData?.data ?? [];

  const { data: conversationsData } = useConversations();
  const conversations = conversationsData?.data ?? [];

  const { data: messagesData, isLoading: messagesLoading } = useMessages(selectedConversationId);
  const messages = messagesData?.data ?? [];

  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage();
  const deleteConversation = useDeleteConversation();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleNewConversation = useCallback(async () => {
    try {
      const conv = await createConversation.mutateAsync({
        tripId: selectedTripId || undefined,
        title: undefined,
      });
      setSelectedConversationId(conv._id);
      setShowConversations(false);
    } catch {
      // Error handled by mutation
    }
  }, [createConversation, selectedTripId]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!content.trim() || !selectedConversationId) return;

      const messageContent = content.trim();
      setInput("");

      try {
        await sendMessage.mutateAsync({
          conversationId: selectedConversationId,
          content: messageContent,
        });
      } catch {
        // Error handled by mutation
      }
    },
    [selectedConversationId, sendMessage]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSend(input);
    },
    [input, handleSend]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      try {
        await deleteConversation.mutateAsync(id);
        if (selectedConversationId === id) {
          setSelectedConversationId(null);
          setShowConversations(true);
        }
      } catch {
        // Error handled by mutation
      }
    },
    [deleteConversation, selectedConversationId]
  );

  const canSend = selectedConversationId && input.trim() && !sendMessage.isPending;

  const sendError = sendMessage.error ? getAssistantError(sendMessage.error) : null;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex w-full gap-4">
        {/* Sidebar */}
        <div className={cn(
          "flex w-64 shrink-0 flex-col gap-4",
          !showConversations && "hidden lg:flex"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">AI Assistant</h2>
              <p className="mt-1 text-xs text-slate-500">Your personal travel companion</p>
            </div>
          </div>

          <Button onClick={handleNewConversation} disabled={createConversation.isPending} size="sm">
            {createConversation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            New Chat
          </Button>

          {/* Trip Context Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTripSelector(!showTripSelector)}
              className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-lg)] border border-slate-200 bg-white p-3 text-left text-sm transition-colors hover:border-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-slate-400">Trip Context</p>
                <p className="mt-0.5 truncate font-medium text-slate-900">
                  {trips.find((t) => t._id === selectedTripId)?.title || "No trip selected"}
                </p>
              </div>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", showTripSelector && "rotate-180")} />
            </button>

            {showTripSelector && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-[var(--radius-lg)] border border-slate-200 bg-white shadow-lg">
                <button
                  onClick={() => { setSelectedTripId(null); setShowTripSelector(false); }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                    !selectedTripId && "bg-primary-50 text-primary-600"
                  )}
                >
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">No context</span>
                </button>
                {trips.map((trip) => (
                  <button
                    key={trip._id}
                    onClick={() => { setSelectedTripId(trip._id); setShowTripSelector(false); }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                      selectedTripId === trip._id && "bg-primary-50 text-primary-600"
                    )}
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{trip.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conversation List */}
          <div className="flex-1 space-y-1 overflow-y-auto">
            <p className="text-xs font-medium uppercase text-slate-400 mb-2">Conversations</p>
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-400">No conversations yet.</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  className={cn(
                    "group flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors cursor-pointer",
                    selectedConversationId === conv._id
                      ? "bg-primary-50 text-primary-600"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                  onClick={() => { setSelectedConversationId(conv._id); setShowConversations(false); }}
                >
                  <span className="flex-1 truncate">{conv.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conv._id); }}
                    className="shrink-0 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-slate-200 bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConversations(true)}
                className="lg:hidden rounded p-1 text-slate-600 hover:bg-slate-100"
                aria-label="Show conversations"
              >
                <Compass className="h-5 w-5" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                <Bot className="h-4 w-4 text-primary-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Travel Assistant</h3>
                <p className="text-xs text-slate-500">
                  {selectedConversationId ? "Active conversation" : "Select or create a conversation"}
                </p>
              </div>
            </div>
            {sendMessage.isPending && (
              <Badge variant="accent">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Thinking...
              </Badge>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {!selectedConversationId ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                  <Bot className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">How can I help you today?</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Start a new conversation or select an existing one to begin chatting with your AI travel assistant.
                </p>
                <Button onClick={handleNewConversation} className="mt-6" disabled={createConversation.isPending}>
                  {createConversation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Start New Conversation
                </Button>
              </div>
            ) : messagesLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100">
                        <Bot className="h-4 w-4 text-primary-500" />
                      </div>
                    )}
                    {message.role === "tool" ? (
                      <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm max-w-[70%]">
                        <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <div>
                          <p className="text-xs font-medium text-amber-700">Tool Activity</p>
                          <p className="mt-1 text-xs text-amber-600">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "max-w-[70%] rounded-[var(--radius-lg)] px-4 py-3 text-sm",
                          message.role === "user"
                            ? "bg-primary-500 text-white"
                            : "bg-slate-100 text-slate-900"
                        )}
                      >
                        <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                        <p
                          className={cn(
                            "mt-2 text-[10px]",
                            message.role === "user" ? "text-primary-200" : "text-slate-400"
                          )}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    )}
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                        U
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error display */}
          {sendError && (
            <div className="border-t border-red-200 bg-red-50 px-4 py-2">
              <p className="flex items-center gap-2 text-xs text-red-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                {sendError}
              </p>
            </div>
          )}

          {/* Suggested prompts (shown when no messages) */}
          {selectedConversationId && messages.length === 0 && !messagesLoading && (
            <div className="border-t border-slate-100 px-4 py-3">
              <p className="mb-2 text-xs font-medium text-slate-400">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => handleSend(prompt.text)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <prompt.icon className="h-3 w-3" />
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-200 px-4 py-4">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedConversationId ? "Ask about your trip..." : "Start a conversation first..."}
                rows={1}
                disabled={!selectedConversationId}
                className="flex-1 resize-none rounded-[var(--radius-lg)] border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!canSend}
                className="shrink-0"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
