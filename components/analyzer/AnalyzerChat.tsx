"use client";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface Message {
  id: number;
  type: "user" | "assistant";
  content: string;
}

interface AnalyzerChatProps {
  isActive: boolean;
  resumeName: string | null;
}

export function AnalyzerChat({ isActive, resumeName }: AnalyzerChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: Date.now(),
      type: "user",
      content: input,
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        type: "assistant",
        content: "I'll help you improve your resume. What specific aspect would you like to focus on?",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  if (!isActive) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a resume to start the conversation
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">
          Chat about: <span className="text-blue-600">{resumeName}</span>
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.type === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your resume..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 