"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const messageAnimationStyle = `
  @keyframes messageIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .message-in {
    animation: messageIn 0.2s ease-out forwards;
  }
`;

export default function ChatWindow({
  selectedUser,
  onBack,
}: any) {

  const { user } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // ⭐ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⭐ FETCH MESSAGES FUNCTION (REUSABLE)
  const fetchMessages = async () => {

    if (!selectedUser || !user?.token) return;

    try {

      const res = await fetch(
        `/api/messages?userId=${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      setMessages(data.messages || []);

    } catch (err) {
      console.error("Message fetch error:", err);
    }
  };

  // ⭐ INITIAL FETCH
  useEffect(() => {
    fetchMessages();
  }, [selectedUser, user?.token]);

  // ⭐ AUTO LIVE REFRESH (Polling every 2s)
  useEffect(() => {

    if (!selectedUser || !user?.token) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000); // refresh every 2 seconds

    return () => clearInterval(interval);

  }, [selectedUser, user?.token]);

  // ⭐ SEND MESSAGE
  const sendMessage = async () => {

    if (!input.trim()) return;

    const newMessage = {
      _id: Math.random().toString(),
      content: input,
      sender: user?._id,
      temp: true,
    };

    // optimistic UI
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    try {

      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          receiverId: selectedUser._id,
          content: newMessage.content,
        }),
      });

      // ⭐ Immediately refresh after sending
      fetchMessages();

    } catch (err) {
      console.error("Send failed:", err);
    }

  };

  return (

    <div className="w-full h-full flex flex-col bg-[#0c0c0c]">

      <style>{messageAnimationStyle}</style>

      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">

        <button
          onClick={onBack}
          className="text-gray-300 hover:text-white"
        >
          <ArrowLeft />
        </button>

        <div className="font-semibold text-white text-lg">
          {selectedUser.name}
        </div>

      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {messages.map((msg, index) => {

          const senderId =
            typeof msg.sender === "object"
              ? msg.sender?._id
              : msg.sender;

          const isMe = String(senderId) === String(user?._id);

          return (

            <div
              key={msg._id || index}
              className="w-full flex message-in"
              style={{
                justifyContent: isMe ? "flex-end" : "flex-start",
                animationDelay: "0ms",
              }}
            >

              <div
                className={`
                  max-w-[75%]
                  px-4 py-2
                  rounded-2xl
                  text-sm
                  break-words
                  ${isMe
                    ? "bg-orange-500 text-white"
                    : "bg-white/10 text-white"}
                `}
              >
                {msg.content}
              </div>

            </div>

          );

        })}

        <div ref={bottomRef} />

      </div>

      {/* INPUT BAR */}
      <div className="p-3 border-t border-white/10 flex gap-2">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="
            flex-1
            bg-white/5
            border border-white/10
            rounded-lg
            p-3
            text-white
            outline-none
            placeholder-gray-400
          "
        />

        <button
          onClick={sendMessage}
          className="
            bg-orange-500
            px-4
            rounded-lg
            flex items-center
            justify-center
            hover:bg-orange-600
          "
        >
          <Send size={18} className="text-white" />
        </button>

      </div>

    </div>
  );
}