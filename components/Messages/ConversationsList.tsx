"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import MessagePopup from "./MessagePopup";
import ChatWindow from "./ChatWindow";
import { useAuth } from "@/context/AuthContext";

const panelAnimationStyle = `
  @keyframes panelIn {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @keyframes panelOut {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(16px) scale(0.97);
    }
  }
  .panel-in {
    animation: panelIn 0.2s ease-out forwards;
  }
`;

interface Conversation {
  _id: string;
  otherUser: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface ConversationsListProps {
  currentUserId: string;
}

export default function ConversationsList({
  currentUserId,
}: ConversationsListProps) {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [otherUsers, setOtherUsers] = useState<any[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"focused" | "other">("focused");

  // ⭐ FETCH FUNCTION
  const fetchConversations = async () => {
    try {
      if (!user?.token) return;

      const token = user.token;

      const [convRes, usersRes] = await Promise.all([
        fetch("/api/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/messaging/available-users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const convData = await convRes.json();
      const usersData = await usersRes.json();

      setConversations(convData.conversations || []);
      setOtherUsers(usersData.users || []);
    } catch (err) {
      console.error("Messaging fetch error:", err);
    }
  };

  // ⭐ initial fetch
  useEffect(() => {
    if (isOpen) fetchConversations();
  }, [isOpen]);

  // ⭐ AUTO UPDATE PREVIEW + UNREAD COUNT
  useEffect(() => {
    if (!isOpen || !user?.token) return;

    const interval = setInterval(() => {
      fetchConversations();
    }, 2000);// polling every 2 sec

    return () => clearInterval(interval);
  }, [isOpen, user?.token]);

  // ⭐ listen for global open chat event
  useEffect(() => {
    const handler = (e: any) => {
      const chatUser = e.detail;

      setIsOpen(true); // open messaging panel
      setSelectedUser(chatUser);// open chat window
    };

    window.addEventListener("openChat", handler);

    return () => window.removeEventListener("openChat", handler);
  }, []);

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredOtherUsers = otherUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <style>{panelAnimationStyle}</style>

      {/* FLOAT BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3 z-50"
        >
          <MessageCircle size={22} />
          {totalUnread > 0 && (
            <span className="bg-red-500 text-xs px-2 py-1 rounded-full font-bold">
              {totalUnread}
            </span>
          )}
        </button>
      )}

      {/* PANEL */}
      {isOpen && (
        <div
          className={`panel-in fixed bottom-6 right-6 w-[400px] ${
            isMinimized ? "h-14" : "h-[600px]"
          } bg-[#0c0c0c] backdrop-blur-xl text-white rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden flex flex-col`}
        >
          {/* HEADER */}
          <div className="p-4 flex justify-between items-center border-b border-white/10">
            <h3 className="font-semibold text-white text-lg">Messaging</h3>

            <div className="flex gap-2 text-gray-300">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:text-white"
              >
                {isMinimized ? <ChevronUp /> : <ChevronDown />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-red-400"
              >
                <X />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* SEARCH */}
              <div className="p-3 border-b border-white/10">
                <input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-white placeholder-gray-400 outline-none focus:border-orange-500"
                />
              </div>

              {/* TABS */}
              <div className="flex border-b border-white/10 text-sm">
                <button
                  onClick={() => setActiveTab("focused")}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === "focused"
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-gray-400"
                  }`}
                >
                  Focused
                </button>

                <button
                  onClick={() => setActiveTab("other")}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === "other"
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-gray-400"
                  }`}
                >
                  Other
                </button>
              </div>

              {/* SLIDE CONTAINER */}
              <div className="relative flex-1 overflow-hidden">
                {/* LIST */}
                <div
                  className={`absolute inset-0 transition-transform duration-300 ${
                    selectedUser ? "-translate-x-full" : "translate-x-0"
                  }`}
                >
                  <div className="overflow-y-auto h-full">
                    {activeTab === "focused" &&
                      filteredConversations.map((conv) => (
                        <div
                          key={conv._id}
                          onClick={() => setSelectedUser(conv.otherUser)}
                          className="p-4 hover:bg-white/5 cursor-pointer flex gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                            {conv.otherUser.name[0]}
                          </div>

                          <div>
                            <p className="font-semibold text-white">
                              {conv.otherUser.name}
                            </p>

                            {/* ⭐ PREVIEW AUTO UPDATES */}
                            <p className="text-sm text-gray-400">
                              {conv.lastMessage}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* CHAT WINDOW */}
                <div
                  className={`absolute inset-0 transition-transform duration-300 ${
                    selectedUser ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  {selectedUser && (
                    <ChatWindow
                      selectedUser={selectedUser}
                      onBack={() => setSelectedUser(null)}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}