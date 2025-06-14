import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, X, Minimize2, Maximize2, Loader2, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";
import QuickActions from "./QuickActions";
import { useUserData } from "../../hooks/useUserData";
import { useQuizzes } from "../../hooks/useQuizzes";
import { useAuth } from "../../context/AuthContext";

// ✅ Updated to new SDK usage
const genAI = new GoogleGenAI({
  apiKey: "AIzaSyCzOXU3OxBXIQAsOe7KgaPnC4nAHqfTVDA",
});

const ChatWindow = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  const { quizzes, loading: quizzesLoading } = useQuizzes();
  const [userName, setUserName] = useState("Guest");
  const [userInitial, setUserInitial] = useState("G");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Generate user context for AI
  const generateUserContext = () => {
    if (!userData) return "";

    const performance = userData.quizPerformance || [];
    const categoryStats = {};

    // Analyze performance by category
    performance.forEach((quiz) => {
      if (!categoryStats[quiz.category]) {
        categoryStats[quiz.category] = { total: 0, correct: 0, count: 0 };
      }
      categoryStats[quiz.category].total += quiz.totalQuestions;
      categoryStats[quiz.category].correct += quiz.score;
      categoryStats[quiz.category].count += 1;
    });

    const categoryAnalysis = Object.entries(categoryStats)
      .map(([category, stats]) => {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        return `${category}: ${percentage}% average (${stats.count} quizzes taken)`;
      })
      .join(", ");

    const recentPerformance = performance
      .slice(-5)
      .map(
        (quiz) => `${quiz.quizTitle} (${quiz.category}): ${quiz.percentage}%`
      )
      .join(", ");

    return `
USER PROFILE:
- Name: ${userData.displayName || userData.email?.split("@")[0] || "User"}
- Level: ${userData.level || 1}
- Total XP: ${userData.totalXP || userData.xp || 0}
- Current Rank: #${userData.rank || "N/A"}
- Quizzes Completed: ${userData.quizzesCompleted || 0}
- Perfect Scores: ${userData.perfectScores || 0}
- Badges: ${userData.badges?.join(", ") || "None yet"}

PERFORMANCE ANALYSIS:
- Category Performance: ${categoryAnalysis || "No data yet"}
- Recent Quiz Results: ${recentPerformance || "No recent quizzes"}

AVAILABLE QUIZZES:
${
  quizzes
    ?.slice(0, 10)
    .map((quiz) => `- ${quiz.title} (${quiz.category}, ${quiz.difficulty})`)
    .join("\n") || "Loading quizzes..."
}

You are a quiz assistant that helps users improve their performance. Analyze their strengths/weaknesses based on category performance and recommend specific quizzes that would help them improve. Be encouraging and specific in your recommendations.`;
  };

  // Save messages to localStorage
  const saveMessagesToStorage = (newMessages) => {
    if (currentUser?.uid) {
      localStorage.setItem(
        `chatMessages_${currentUser.uid}`,
        JSON.stringify(newMessages)
      );
    }
  };

  // Load messages from localStorage
  const loadMessagesFromStorage = () => {
    if (currentUser?.uid) {
      const savedMessages = localStorage.getItem(
        `chatMessages_${currentUser.uid}`
      );
      return savedMessages ? JSON.parse(savedMessages) : [];
    }
    return [];
  };

  // Clear chat history
  const clearChatHistory = () => {
    if (currentUser?.uid && userData) {
      localStorage.removeItem(`chatMessages_${currentUser.uid}`);

      // Create fresh welcome message immediately
      const name =
        userData.displayName || userData.email?.split("@")[0] || "Guest";
      const welcomeMessage = `Hi ${name}! 🎉 

I'm your personalized AI quiz assistant. I can see you've completed ${
        userData.quizzesCompleted || 0
      } quizzes and earned ${userData.totalXP || userData.xp || 0} XP points!

I'm here to help you:
📊 Analyze your quiz performance
🎯 Recommend quizzes based on your strengths/weaknesses
🏆 Suggest strategies to improve your ranking
📚 Find the perfect quiz for your skill level

What would you like to know about your quiz journey?`;

      const initialMessages = [{ text: welcomeMessage, isBot: true }];
      setMessages(initialMessages);
      saveMessagesToStorage(initialMessages);

      // Force scroll to top after clearing
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = 0;
        }
      }, 100);
    }
  };

  // Load previous messages or initialize chat
  useEffect(() => {
    const initializeChat = () => {
      if (!userData || !currentUser) return;

      const name =
        userData.displayName || userData.email?.split("@")[0] || "Guest";
      setUserName(name);
      setUserInitial(name.charAt(0).toUpperCase());

      // Load existing messages from storage
      const savedMessages = loadMessagesFromStorage();

      if (savedMessages.length > 0) {
        // If there are saved messages, load them
        setMessages(savedMessages);
      } else {
        // If no saved messages, create welcome message
        const welcomeMessage = `Hi ${name}! 🎉 

I'm your personalized AI quiz assistant. I can see you've completed ${
          userData.quizzesCompleted || 0
        } quizzes and earned ${userData.totalXP || userData.xp || 0} XP points!

I'm here to help you:
📊 Analyze your quiz performance
🎯 Recommend quizzes based on your strengths/weaknesses
🏆 Suggest strategies to improve your ranking
📚 Find the perfect quiz for your skill level

What would you like to know about your quiz journey?`;

        const initialMessages = [{ text: welcomeMessage, isBot: true }];
        setMessages(initialMessages);
        saveMessagesToStorage(initialMessages);
      }

      setIsInitialized(true);
    };

    if (isOpen && userData && !userLoading && currentUser && !isInitialized) {
      initializeChat();
    }
  }, [isOpen, userData, userLoading, currentUser, isInitialized]);

  // It handles closing of chatbot
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle scroll behavior - top for welcome, bottom for conversation
  useEffect(() => {
    if (!isOpen || messages.length === 0 || isMinimized) return;

    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
      if (messagesContainerRef.current) {
        // If only welcome message (first time opening), scroll to top
        if (messages.length === 1 && messages[0].isBot) {
          messagesContainerRef.current.scrollTop = 0;
          messagesContainerRef.current.style.overflowY = "auto";
        } else {
          // If conversation started, scroll to bottom for new messages
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 100);
  }, [messages, isOpen, isMinimized]);

  // Handle scroll when reopening from minimized state
  useEffect(() => {
    if (isOpen && !isMinimized && messages.length > 0) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          if (messages.length === 1 && messages[0].isBot) {
            messagesContainerRef.current.scrollTop = 0;
          } else {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 150);
    }
  }, [isMinimized]);

  //   Focus on input box after opening chatbot
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newUserMessage = {
      text: userMessage,
      isBot: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => {
      const updated = [...prev, newUserMessage];
      saveMessagesToStorage(updated);
      return updated;
    });
    setIsLoading(true);

    try {
      const userContext = generateUserContext();
      const contextualPrompt = `${userContext}

USER QUESTION: ${userMessage}

Provide a helpful, personalized response based on the user's quiz performance data. If they ask for recommendations, be specific about which quizzes they should take and why. If they ask about their performance, analyze their strengths and weaknesses based on the data provided.`;

      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contextualPrompt,
      });

      const reply = result.text; // ✅ Correct text access
      const botMessage = {
        text: reply,
        isBot: true,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        const updated = [...prev, botMessage];
        saveMessagesToStorage(updated);
        return updated;
      });
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        text: "I apologize, but I encountered an error. Please try again later.",
        isBot: true,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        const updated = [...prev, errorMessage];
        saveMessagesToStorage(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    // Auto-submit the quick action
    const syntheticEvent = { preventDefault: () => {} };
    setInput("");
    const newUserMessage = {
      text: prompt,
      isBot: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => {
      const updated = [...prev, newUserMessage];
      saveMessagesToStorage(updated);
      return updated;
    });
    setIsLoading(true);

    // Call the AI with the prompt
    (async () => {
      try {
        const userContext = generateUserContext();
        const contextualPrompt = `${userContext}

USER QUESTION: ${prompt}

Provide a helpful, personalized response based on the user's quiz performance data. If they ask for recommendations, be specific about which quizzes they should take and why. If they ask about their performance, analyze their strengths and weaknesses based on the data provided.`;

        const result = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: contextualPrompt,
        });

        const reply = result.text;
        const botMessage = {
          text: reply,
          isBot: true,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => {
          const updated = [...prev, botMessage];
          saveMessagesToStorage(updated);
          return updated;
        });
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
          text: "I apologize, but I encountered an error. Please try again later.",
          isBot: true,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => {
          const updated = [...prev, errorMessage];
          saveMessagesToStorage(updated);
          return updated;
        });
      } finally {
        setIsLoading(false);
      }
    })();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={chatWindowRef}
      className={`fixed bottom-20 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 
      overflow-hidden transition-all duration-300 ease-in-out backdrop-blur-lg 
      dark:bg-gray-900 dark:border-gray-700 
      ${isMinimized ? "h-14" : "h-[400px]"}`}
      style={{ boxShadow: "0 4px 32px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Header - Always Visible */}
      <div
        className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between sticky top-0 z-10 shadow-lg transition-all duration-300 ${
          isMinimized ? "p-2" : "p-4"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
              isMinimized ? "w-8 h-8" : "w-10 h-10"
            }`}
          >
            <Sparkles size={isMinimized ? 16 : 20} className="text-white" />
          </div>
          <div>
            <h3
              className={`font-semibold transition-all duration-300 ${
                isMinimized ? "text-sm" : "text-base"
              }`}
            >
              AI Assistant
            </h3>
            {!isMinimized && (
              <p className="text-sm text-white/90 font-medium">
                Welcome,{" "}
                {userName.length > 12
                  ? `${userName.slice(0, 12)}...`
                  : userName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearChatHistory}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            title="Clear chat history"
          >
            <svg
              width={16}
              height={16}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      {/* Header End*/}

      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className={`overflow-y-auto pt-4 px-3 pb-3 space-y-3 bg-gray-50/50 dark:bg-gray-900 ${
              messages.length <= 1 && userData && !isLoading
                ? "h-[calc(100%-18rem)]"
                : "h-[calc(100%-8rem)]"
            }`}
          >
            {messages.map((message, index) => (
              <div key={index} className="flex items-start gap-2 text-white">
                {message.isBot ? (
                  <ChatMessage
                    message={message.text}
                    isBot={true}
                    isFirstMessage={index === 0 && message.isBot}
                  />
                ) : (
                  <div className="flex items-start gap-2 justify-end w-full text-white">
                    <div className="flex-1">
                      <ChatMessage message={message.text} isBot={false} />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      {userInitial}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-white p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">AI is thinking...</span>
              </div>
            )}
            {/* Add this to scroll at bottom once message is added  */}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && userData && !isLoading && (
            <div className="flex-shrink-0">
              <QuickActions
                onActionClick={handleQuickAction}
                userData={userData}
              />
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className={`w-full pr-10 pl-3 py-2 rounded-xl border border-gray-200 
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                resize-none text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                placeholder-gray-400 dark:placeholder-gray-500`}
                rows={1}
                style={{ maxHeight: "100px" }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 
                p-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 
                text-white transition-all duration-200 
                hover:shadow-lg hover:opacity-90 
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none`}
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
