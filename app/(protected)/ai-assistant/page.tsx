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
} from "lucide-react";
import { Button, Alert, Badge } from "@/components/ui";
import { useTrips } from "@/hooks";
import { cn } from "@/utils";
import type { Trip } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  { icon: MapPin, text: "What are the best restaurants near my hotel?" },
  { icon: Calendar, text: "Help me adjust my itinerary for rain tomorrow." },
  { icon: Compass, text: "Suggest hidden gems in my destination." },
  { icon: Sparkles, text: "Optimize my budget for the remaining days." },
];

const emptyConversations = [
  {
    title: "Plan a day trip",
    description: "Ask the AI to suggest a perfect day trip from your current destination.",
  },
  {
    title: "Find local cuisine",
    description: "Get restaurant recommendations based on your dietary preferences.",
  },
  {
    title: "Weather adjustments",
    description: "Let the AI reshape your plans based on weather forecasts.",
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripSelector, setShowTripSelector] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: tripsData } = useTrips({ limit: 20 });
  const trips = tripsData?.data ?? [];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      // Simulate AI response since backend is not connected
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "The AI Travel Assistant is not yet connected to the backend. This feature requires a backend API endpoint for conversational AI. Once the backend integration is complete, you will receive personalized travel advice, itinerary adjustments, and real-time recommendations here.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  const handleSuggestedPrompt = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
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

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex w-full gap-4">
        {/* Conversation Sidebar */}
        <div className="hidden w-64 shrink-0 flex-col gap-4 lg:flex">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">AI Assistant</h2>
            <p className="mt-1 text-xs text-slate-500">Your personal travel companion</p>
          </div>

          {/* Trip Context Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTripSelector(!showTripSelector)}
              className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-lg)] border border-slate-200 bg-white p-3 text-left text-sm transition-colors hover:border-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-slate-400">Trip Context</p>
                <p className="mt-0.5 truncate font-medium text-slate-900">
                  {selectedTrip ? selectedTrip.title : "No trip selected"}
                </p>
              </div>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", showTripSelector && "rotate-180")} />
            </button>

            {showTripSelector && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-[var(--radius-lg)] border border-slate-200 bg-white shadow-lg">
                <button
                  onClick={() => {
                    setSelectedTrip(null);
                    setShowTripSelector(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                    !selectedTrip && "bg-primary-50 text-primary-600"
                  )}
                >
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">No context</span>
                </button>
                {trips.map((trip) => (
                  <button
                    key={trip._id}
                    onClick={() => {
                      setSelectedTrip(trip);
                      setShowTripSelector(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                      selectedTrip?._id === trip._id && "bg-primary-50 text-primary-600"
                    )}
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{trip.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Prompts */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-slate-400">Suggested</p>
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt.text}
                onClick={() => handleSuggestedPrompt(prompt.text)}
                className="flex w-full items-center gap-2 rounded-[var(--radius-md)] border border-slate-200 bg-white p-2.5 text-left text-xs text-slate-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <prompt.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-2">{prompt.text}</span>
              </button>
            ))}
          </div>

          {/* Backend Status */}
          <div className="mt-auto">
            <Alert variant="warning">
              <p className="text-xs">
                <strong>Backend Required:</strong> The AI assistant needs a backend conversational API to function. Currently in preview mode.
              </p>
            </Alert>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-slate-200 bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                <Bot className="h-4 w-4 text-primary-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Travel Assistant</h3>
                <p className="text-xs text-slate-500">
                  {selectedTrip ? `Context: ${selectedTrip.title}` : "No trip context"}
                </p>
              </div>
            </div>
            <Badge variant="accent">Preview</Badge>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                  <Bot className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">How can I help you today?</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Ask me anything about your trip — from restaurant recommendations to itinerary changes.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {emptyConversations.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[var(--radius-lg)] border border-slate-200 p-4 text-left"
                    >
                      <h4 className="text-sm font-medium text-slate-900">{item.title}</h4>
                      <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
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
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                        U
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <Bot className="h-4 w-4 text-primary-500" />
                    </div>
                    <div className="rounded-[var(--radius-lg)] bg-slate-100 px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 px-4 py-4">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your trip..."
                  rows={1}
                  className="flex w-full resize-none rounded-[var(--radius-lg)] border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isTyping}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              AI responses are simulated. Backend integration required for real assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
