"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { X, Send, ChevronRight, Sparkles, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { trackEvent } from "../utils/analytics";
import { processLunaQuery, getSuggestedQuestions } from "../utils/lunaEngine";
// 确保全局升级处理函数可用
import "@/lib/pro-upgrade-handler";

interface Message {
  sender: "luna" | "user";
  text: string;
  links?: { label: string; url: string }[];
  timestamp: number;
  isUpgradePrompt?: boolean;
}

const DAILY_LIMIT = 5;

const LunaAI: React.FC = () => {
  const t = useTranslations("common.lunaAI");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [holidayMode, setHolidayMode] = useState<{
    icon: string;
    message: string;
  } | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Upgrade Promoter State
  const [isPro, setIsPro] = useState(false);
  const [dailyMessageCount, setDailyMessageCount] = useState(0);

  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect locale from URL
  const locale = useMemo(() => {
    if (typeof window === "undefined") return "en";
    const path = window.location.pathname;
    return path.includes("/zh") ? "zh" : "en";
  }, []);

  // Load state from localStorage
  useEffect(() => {
    const storedPro = localStorage.getItem("luna_is_pro");
    if (storedPro === "true") setIsPro(true);

    const storedCount = localStorage.getItem("luna_daily_count");
    const storedDate = localStorage.getItem("luna_count_date");
    const today = new Date().toDateString();

    if (storedDate === today && storedCount) {
      setDailyMessageCount(parseInt(storedCount, 10));
    } else {
      setDailyMessageCount(0);
      localStorage.setItem("luna_count_date", today);
      localStorage.setItem("luna_daily_count", "0");
    }
  }, []);

  // Get suggested questions based on context
  const suggestedQuestions = useMemo(() => {
    // Check if user has cycle data (from localStorage)
    const hasCycleData =
      typeof window !== "undefined" &&
      localStorage.getItem("cycleData") !== null;

    // Check if user has pain entries (from localStorage)
    const hasPainEntries =
      typeof window !== "undefined" &&
      localStorage.getItem("painEntries") !== null;

    // Get last query from messages
    const lastQuery =
      messages.length > 0
        ? messages.filter((m) => m.sender === "user").slice(-1)[0]?.text
        : undefined;

    // Try to get user age
    let userAge: number | undefined;
    if (typeof window !== "undefined") {
      const storedAge = localStorage.getItem("user_age");
      if (storedAge) {
        userAge = parseInt(storedAge, 10);
      } else {
        // Try to parse from userProfile
        try {
          const userProfile = localStorage.getItem("userProfile");
          if (userProfile) {
            const parsed = JSON.parse(userProfile);
            if (parsed.age) userAge = parseInt(parsed.age, 10);
            else if (parsed.birthYear)
              userAge =
                new Date().getFullYear() - parseInt(parsed.birthYear, 10);
          }
        } catch {
          // console.error('Failed to parse user profile');
        }
      }
    }

    return getSuggestedQuestions({
      hasCycleData,
      hasPainEntries,
      lastQuery,
      locale: locale as "en" | "zh",
      userAge,
    });
  }, [messages, locale]);

  const triggerEmojiRain = useCallback(() => {
    if (typeof window === "undefined" || !document.body) return;

    const emojis = [
      "💜",
      "🌟",
      "💕",
      "✨",
      "🌸",
      "🌙",
      holidayMode?.icon,
    ].filter(Boolean);
    const container = document.body;
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("div");
      el.innerText = emojis[Math.floor(Math.random() * emojis.length)]!;
      el.className = "emoji-rain";
      el.style.left = `${Math.random() * 100}vw`;
      el.style.animationDuration = `${2 + Math.random() * 2}s`;
      container.appendChild(el);
      setTimeout(() => {
        if (container.contains(el)) container.removeChild(el);
      }, 4000);
    }
  }, [holidayMode]);

  const handleUpgrade = () => {
    // 关闭聊天窗口
    setIsOpen(false);

    // 追踪升级点击事件
    trackEvent("luna_upgrade_clicked", { source: "luna_ai_chat" });

    // 尝试使用全局升级处理函数
    if (typeof window !== "undefined" && window.handleProUpgrade) {
      window.handleProUpgrade({
        plan: "monthly",
        painPoint: "luna_ai_limit",
        assessmentScore: 0,
        source: "luna_ai_chat",
      });
    } else {
      // 备用方案：跳转到定价页面
      const currentPath = window.location.pathname;
      const locale = currentPath.includes("/zh") ? "zh" : "en";
      window.location.href = `/${locale}/pricing`;
    }
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    // Check limit
    if (!isPro && dailyMessageCount >= DAILY_LIMIT) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: question, timestamp: Date.now() },
      ]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "luna",
            text: t("proUpgrade.limitReached"),
            timestamp: Date.now(),
            isUpgradePrompt: true,
          },
        ]);
        trackEvent("luna_limit_reached");
      }, 500);
      return;
    }

    setInputValue(question);
    // Auto-send after a short delay
    setTimeout(() => {
      const userText = question.trim();
      setInputValue("");

      // Add User Message
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: userText, timestamp: Date.now() },
      ]);
      setIsTyping(true);
      trackEvent("luna_suggested_question", { question: userText });

      // Increment count
      if (!isPro) {
        const newCount = dailyMessageCount + 1;
        setDailyMessageCount(newCount);
        localStorage.setItem("luna_daily_count", newCount.toString());
      }

      // Simulate AI Delay
      setTimeout(() => {
        const response = processLunaQuery(userText, locale as "en" | "zh");

        // Translate response text and links (locale will be added on click)
        const translatedText = t(response.text);
        const translatedLinks = response.links?.map((link) => ({
          label: t(link.label),
          url: link.url,
        }));

        setMessages((prev) => [
          ...prev,
          {
            sender: "luna",
            text: translatedText,
            links: translatedLinks,
            timestamp: Date.now(),
          },
        ]);
        setIsTyping(false);
      }, 800);
    }, 100);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // Check limit
    if (!isPro && dailyMessageCount >= DAILY_LIMIT) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: inputValue.trim(), timestamp: Date.now() },
      ]);
      setInputValue("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "luna",
            text: t("proUpgrade.limitReached"),
            timestamp: Date.now(),
            isUpgradePrompt: true,
          },
        ]);
        trackEvent("luna_limit_reached");
      }, 500);
      return;
    }

    const userText = inputValue.trim();
    setInputValue("");

    // Add User Message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, timestamp: Date.now() },
    ]);
    setIsTyping(true);
    trackEvent("luna_query", { query: userText });

    // Increment count
    if (!isPro) {
      const newCount = dailyMessageCount + 1;
      setDailyMessageCount(newCount);
      localStorage.setItem("luna_daily_count", newCount.toString());
    }

    // Simulate AI Delay
    setTimeout(() => {
      const response = processLunaQuery(userText, locale as "en" | "zh");

      // Translate response text and links (locale will be added on click)
      const translatedText = t(response.text);
      const translatedLinks = response.links?.map((link) => ({
        label: t(link.label),
        url: link.url,
      }));

      setMessages((prev) => [
        ...prev,
        {
          sender: "luna",
          text: translatedText,
          links: translatedLinks,
          timestamp: Date.now(),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Initialize Holiday Mode & Welcome Message
  useEffect(() => {
    const checkHoliday = () => {
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      if (month === 2 && day === 14) {
        setHolidayMode({ icon: "💝", message: t("holiday.valentines") });
      } else if (month === 3 && day === 8) {
        setHolidayMode({ icon: "👩‍⚕️", message: t("holiday.womensDay") });
      }
    };
    checkHoliday();
  }, [t]);

  // Set initial welcome message
  useEffect(() => {
    const welcomeText = holidayMode
      ? `${holidayMode.message} ${t("holiday.helpPrompt")}`
      : t("welcome");

    setMessages([
      {
        sender: "luna",
        text: welcomeText,
        timestamp: Date.now(),
      },
    ]);
  }, [holidayMode, t]);

  // Easter Egg System
  useEffect(() => {
    let keyPressCount = 0;
    let lastKeyPressTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastKeyPressTime > 2000) keyPressCount = 0;

      if (e.key.toLowerCase() === "l") {
        keyPressCount++;
        lastKeyPressTime = currentTime;
        if (keyPressCount === 3) {
          triggerEmojiRain();
          trackEvent("luna_easter_egg_triggered");
          keyPressCount = 0;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [triggerEmojiRain]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      <div
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-purple-100 dark:border-purple-900 w-80 sm:w-96 h-[500px] flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
        role="dialog"
        aria-label="Luna Assistant Chat"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl" role="img" aria-label="Luna Icon">
              {holidayMode?.icon || "🌙"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold leading-none">{t("title")}</h3>
                {isPro && (
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Sparkles size={10} /> PRO
                  </span>
                )}
              </div>
              <span className="text-xs text-purple-100 opacity-90">
                {t("tagline")}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white rounded-br-none"
                    : msg.isUpgradePrompt
                      ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800 rounded-bl-none"
                      : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-slate-600 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>

                {msg.isUpgradePrompt && (
                  <button
                    onClick={handleUpgrade}
                    className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Lock size={14} /> {t("proUpgrade.unlockButton")}
                  </button>
                )}

                {msg.links && (
                  <div className="mt-3 space-y-1">
                    {msg.links.map((link, lIdx) => {
                      // Calculate the correct URL with locale
                      // Check if URL already contains locale (e.g., /zh/... or /en/...)
                      const urlAlreadyHasLocale =
                        link.url.match(/^\/(zh|en)\//);
                      const fullUrl = urlAlreadyHasLocale
                        ? link.url
                        : link.url.startsWith("/")
                          ? `/${locale}${link.url}`
                          : link.url;

                      return (
                        <a
                          key={lIdx}
                          href={fullUrl}
                          className={`block text-xs font-bold py-1 px-2 rounded transition-colors flex items-center justify-between ${
                            msg.sender === "user"
                              ? "bg-white/20 hover:bg-white/30 text-white"
                              : "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                          }`}
                          onClick={(e) => {
                            if (link.url.startsWith("#")) {
                              e.preventDefault();
                              // Handle anchor links / tool opening
                              const element = document.querySelector(link.url);
                              if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                                setIsOpen(false);
                              }
                            } else if (link.url.startsWith("/")) {
                              // For page links, prevent default and navigate
                              e.preventDefault();
                              window.location.href = fullUrl;
                              setIsOpen(false);
                            }
                          }}
                        >
                          {link.label} <ChevronRight size={12} />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-2xl rounded-bl-none p-3 shadow-sm">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Questions Chips - Show when the last message is from Luna */}
          {messages.length > 0 &&
            messages[messages.length - 1].sender === "luna" &&
            !isTyping &&
            suggestedQuestions.length > 0 && (
              <div className="px-4 pb-2 space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {t("suggestedQuestions")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-800"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 shrink-0"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                !isPro && dailyMessageCount >= DAILY_LIMIT
                  ? t("input.limitReached")
                  : t("input.placeholder")
              }
              disabled={!isPro && dailyMessageCount >= DAILY_LIMIT}
              className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={
                !inputValue.trim() ||
                (!isPro && dailyMessageCount >= DAILY_LIMIT)
              }
              className="absolute right-1 p-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-90"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2 flex justify-center items-center gap-1">
            {!isPro && (
              <span>
                {t("footer.freeMessagesLeft", {
                  count: DAILY_LIMIT - dailyMessageCount,
                })}
              </span>
            )}
            <span>{t("footer.disclaimer")}</span>
          </div>
        </form>
      </div>

      {/* Floating Orb (Trigger) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform duration-300 animate-float group focus:outline-none focus:ring-4 focus:ring-purple-300"
        aria-label={isOpen ? t("aria.closeChat") : t("aria.openChat")}
      >
        <div className="relative">
          <span
            className={`text-3xl transition-all duration-300 ${
              isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
            role="img"
            aria-label="Moon icon"
          >
            {holidayMode?.icon || "🌙"}
          </span>
          <X
            className={`text-white w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
          )}
        </div>
      </button>

      {/* Emoji Rain Animation Styles */}
      <style jsx>{`
        @keyframes emojiRain {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LunaAI;
