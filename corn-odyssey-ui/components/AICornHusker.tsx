"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Maximize2, Minimize2, AlertCircle } from "lucide-react";

// Define message type for TypeScript
type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

type ChatbotProps = {
  theme: "earth" | "mars" | "space"; // Add space theme for home/about pages
};

const AICornHusker = ({ theme }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are CornHusker, an AI assistant specializing in corn agriculture across the solar system. You provide information about corn growing techniques, yields, and forecasts for both Earth and Mars.",
      timestamp: new Date(),
    },
    {
      role: "assistant",
      content: "Hello! I'm CornHusker, your AI corn cultivation expert. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define theme colors
  const themeColors = {
    earth: {
      primary: "blue",
      secondary: "blue-100",
      border: "blue-700",
      bg: "blue-900",
      messageBg: "blue-800",
      button: "blue-600",
      buttonHover: "blue-700",
    },
    mars: {
      primary: "red",
      secondary: "red-100",
      border: "red-700",
      bg: "red-900",
      messageBg: "red-800",
      button: "red-600",
      buttonHover: "red-700",
    },
    space: {
      primary: "purple",
      secondary: "purple-100",
      border: "purple-700",
      bg: "purple-900",
      messageBg: "purple-800",
      button: "purple-600",
      buttonHover: "purple-700",
    },
  };

  const colors = themeColors[theme];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Add context message when theme changes
  useEffect(() => {
    // Add context information as a system message
    const contextMessage = {
      role: "system" as const,
      content: `User is currently viewing the ${theme.toUpperCase()} page of the application. Tailor your responses about corn agriculture to focus on ${theme} context when appropriate.`,
      timestamp: new Date()
    };
    
    // Find the index of an existing context message
    const existingContextIndex = messages.findIndex(
      msg => msg.role === "system" && msg.content.includes("User is currently viewing")
    );
    
    // If there's an existing context message, replace it
    if (existingContextIndex !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[existingContextIndex] = contextMessage;
      setMessages(updatedMessages);
    } else if (messages.length > 0) {
      // Insert after the first system message
      const firstSystemIndex = messages.findIndex(msg => msg.role === "system");
      if (firstSystemIndex !== -1) {
        const updatedMessages = [...messages];
        updatedMessages.splice(firstSystemIndex + 1, 0, contextMessage);
        setMessages(updatedMessages);
      }
    }
  }, [theme]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Prepare the chat history in the format expected by the API
      const chatHistory = messages
        .filter(msg => msg.role !== "system" || msg.content.includes("User is currently viewing"))
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add the current message
      chatHistory.push({
        role: "user",
        content: userMessage.content
      });

      // Send message to server
      const response = await fetch("http://127.0.0.1:8000/ai-chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatHistory,
          context: theme, // Send current page context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to get response from AI");
      }

      const data = await response.json();

      // Add bot response to chat
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error in chatbot communication:", error);
      
      // Set error message
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to my knowledge base. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Format time for messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter out system messages for display
  const displayMessages = messages.filter(msg => msg.role !== "system");

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-${colors.button} hover:bg-${colors.buttonHover} text-white z-40 shadow-lg flex items-center justify-center transition-transform hover:scale-105`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed z-50 ${
            isMinimized 
              ? "bottom-20 right-6 w-64 h-14" 
              : "bottom-24 right-6 w-80 sm:w-96 h-96"
          } bg-black bg-opacity-80 backdrop-blur-md rounded-lg border border-${
            colors.border
          } shadow-xl overflow-hidden transition-all duration-300`}
        >
          {/* Chat header */}
          <div className={`bg-${colors.bg} p-3 flex items-center justify-between border-b border-${colors.border}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full bg-${colors.button} mr-2`}></div>
              <h3 className="font-bold text-white">AI CornHusker</h3>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={toggleMinimize}
                className="text-gray-300 hover:text-white"
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button 
                onClick={toggleChat}
                className="text-gray-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Hidden content when minimized */}
          {!isMinimized && (
            <>
              {/* Messages container */}
              <div className="h-72 overflow-y-auto p-3 space-y-3">
                {displayMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-3 py-2 ${
                        msg.role === "user"
                          ? `bg-${colors.button} text-white`
                          : `bg-${colors.messageBg} bg-opacity-70 text-${colors.secondary}`
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`bg-${colors.messageBg} bg-opacity-70 text-${colors.secondary} rounded-lg px-3 py-2`}>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="flex justify-center">
                    <div className="flex items-center text-red-400 text-xs">
                      <AlertCircle size={12} className="mr-1" />
                      {error}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className={`p-3 border-t border-${colors.border} bg-black bg-opacity-50`}>
                <div className="flex">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask me about corn agriculture..."
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 bg-${colors.bg} bg-opacity-60 text-white rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-${colors.button}`}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading}
                    className={`bg-${colors.button} hover:bg-${colors.buttonHover} text-white px-3 py-2 rounded-r-lg transition-colors ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AICornHusker;