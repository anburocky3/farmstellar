"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FarmstellarChatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: t("chatbot.greeting"),
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Check if user is asking about creators
      const lowerInput = inputMessage.toLowerCase();
      const creatorKeywords = [
        "who created",
        "who made",
        "creator",
        "team",
        "developed",
        "built",
        "developed by",
      ];
      const isAskingAboutCreators = creatorKeywords.some((keyword) =>
        lowerInput.includes(keyword)
      );

      if (isAskingAboutCreators) {
        const botMessage = {
          id: messages.length + 2,
          role: "assistant",
          content: t("chatbot.creatorInfo"),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      // Fetch user profile and farm details
      let userLocation = null;
      let farmDetails = null;

      try {
        const profileRes = await fetch("/api/auth/me");
        if (profileRes.ok) {
          const profile = await profileRes.json();
          userLocation = {
            city: profile.city,
            location: profile.location,
          };
          if (profile.farm) {
            farmDetails = {
              name: profile.farm.name,
              address: profile.farm.address,
              size: profile.farm.size,
              primaryCrop: profile.farm.primaryCrop,
            };
          }
        }
      } catch (e) {
        console.warn("Could not fetch user profile:", e);
      }

      const response = await fetch(`/api/chatbot/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId,
          userLocation,
          farmDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: data.answer || t("chatbot.fallback"),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);

      // Fallback response
      const fallbackMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: t("chatbot.learningFallback"),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessageContent = (content) => {
    if (!content) return "";

    const escapeHtml = (str) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    // Escape first to avoid accidental HTML, then restore simple markdown
    let safe = escapeHtml(content);

    // Bold: **text**
    safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    const lines = safe.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const bulletRegex = /^([•\-]\s)(.+)$/;
    const allBullets =
      lines.length > 0 && lines.every((l) => bulletRegex.test(l));

    if (allBullets) {
      const items = lines
        .map((l) => l.replace(bulletRegex, "$2").trim())
        .map((l) => `<li>${l}</li>`) // keep bold tags inside
        .join("");
      return `<ul class="list-disc list-outside pl-4 space-y-1">${items}</ul>`;
    }

    // Otherwise join with <br>
    return lines.join("<br/>");
  };

  const handleClearChat = async () => {
    try {
      await fetch(`/api/chatbot/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      setMessages([
        {
          id: 1,
          role: "assistant",
          content: t("chatbot.greeting"),
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  const suggestedQueries = [
    t("chatbot.suggestCropCare"),
    t("chatbot.suggestPestControl"),
    t("chatbot.suggestIrrigation"),
    t("chatbot.suggestSoil"),
  ];

  const handleSuggestionClick = async (suggestion) => {
    setInputMessage(suggestion);
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Manually trigger send
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: suggestion,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let userLocation = null;
      let farmDetails = null;

      try {
        const profileRes = await fetch("/api/auth/me");
        if (profileRes.ok) {
          const profile = await profileRes.json();
          userLocation = { city: profile.city, location: profile.location };
          if (profile.farm) {
            farmDetails = {
              name: profile.farm.name,
              address: profile.farm.address,
              size: profile.farm.size,
              primaryCrop: profile.farm.primaryCrop,
            };
          }
        }
      } catch (e) {
        console.warn("Could not fetch user profile:", e);
      }

      const response = await fetch(`/api/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: suggestion,
          session_id: sessionId,
          userLocation,
          farmDetails,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const botMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: data.answer || t("chatbot.fallback"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const fallbackMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: t("chatbot.learningFallback"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 ">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full shadow-2xl! bg-linear-to-br from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 border-2 border-white/30 transition-all duration-300 hover:scale-110 group relative overflow-hidden"
            aria-label="Open FarmStellar Bot"
          >
            {/* Animated background pulse */}
            <div className="absolute inset-0 bg-linear-to-br from-yellow-200/30 to-green-200/30 rounded-full animate-ping opacity-75" />

            {/* Rotating background effect */}
            <div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent rounded-full"
              style={{ animation: "spin 3s linear infinite" }}
            />

            {/* Icon - Farming themed */}
            <div className="relative z-10 flex items-center justify-center">
              <Bot className="h-10! w-10! text-white drop-shadow-lg animate-bounce" />
            </div>

            {/* Glowing notification badge */}
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-3 sm:left-auto right-6 z-50 w-[400px] max-h-[calc(100vh-80px)] h-[600px] bg-background rounded-2xl shadow-2xl border-2 border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-linear-to-r from-green-500 via-green-600 to-emerald-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  {t("chatbot.botName")}
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-white/90 text-xs">{t("chatbot.online")}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                className="text-white hover:bg-white/20 rounded-full"
                title={t("chatbot.clearChat")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto p-4 bg-linear-to-b from-green-50/30 to-background"
          >
            <div className="space-y-4">
              {messages.length === 1 && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-muted-foreground font-semibold px-2">
                    {t("chatbot.suggestedQueries")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQueries.map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(query)}
                        className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full transition-colors border border-green-300"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-linear-to-br from-green-500 to-green-600 text-white shadow-md"
                        : "bg-white border border-border shadow-sm"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-600">
                          {t("chatbot.botName")}
                        </span>
                      </div>
                    )}
                    <p
                      className={`text-sm whitespace-pre-wrap ${
                        message.role === "user"
                          ? "text-white"
                          : "text-foreground"
                      }`}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: renderMessageContent(message.content),
                        }}
                      />
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-white/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-green-600" />
                      <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                      <span className="text-sm text-muted-foreground">
                        {t("chatbot.thinking")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder={t("chatbot.placeholder")}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 rounded-full border-2 focus-visible:ring-green-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="rounded-full h-10 w-10 p-0 bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {/* {t("chatbot.powered")} */}
              FarmStellar AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
