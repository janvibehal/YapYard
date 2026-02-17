"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, MessageCircle, Minimize2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  receiver: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  content: string;
  createdAt: string;
  read: boolean;
}

interface MessagePopupProps {
  otherUser: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  currentUserId: string;
  onClose: () => void;
}

export default function MessagePopup({
  otherUser,
  currentUserId,
  onClose,
}: MessagePopupProps) {
  const { user } = useAuth();// ✅ FIX: user is now defined

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ⭐ AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⭐ FETCH MESSAGES — stable reference
  const fetchMessages = useCallback(async () => {
    if (!user?.token) return;

    try {
      const response = await fetch(`/api/messages?userId=${otherUser._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [otherUser._id, user?.token]);

  // ⭐ Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ⭐ POLLING — keeps popup live without manual refresh
  useEffect(() => {
    if (!user?.token || isMinimized) return;
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages, user?.token, isMinimized]);

  // ⭐ SEND MESSAGE
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading || !user?.token) return;

    setLoading(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          receiverId: otherUser._id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage("");
        // Immediately refresh to show the sent message
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg">
        Please login to chat.
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 right-4 bg-orange-600 text-white px-4 py-2
          rounded-full shadow-lg cursor-pointer hover:bg-orange-700 transition-all
          flex items-center gap-2 z-50"
        onClick={() => setIsMinimized(false)}
      >
        <MessageCircle size={20} />
        <span>{otherUser.name}</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg
      shadow-2xl flex flex-col border border-gray-200 z-50">

      {/* HEADER */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {otherUser.profilePicture ? (
            <img
              src={otherUser.profilePicture}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
            <p className="text-xs text-green-600 font-medium">Active now</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            // ⭐ FIX: sender may be populated object or raw ID string
            const senderId =
              typeof message.sender === "object"
                ? message.sender._id
                : message.sender;
            const isCurrentUser = String(senderId) === String(currentUserId);

            return (
              <div
                key={message._id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isCurrentUser
                      ? "bg-orange-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none
              focus:border-orange-400 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-orange-500 text-white p-3 rounded-full
              disabled:opacity-50 hover:bg-orange-600 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}