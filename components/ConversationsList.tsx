'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Edit, MoreHorizontal, ChevronDown, ChevronUp, Search } from 'lucide-react';
import MessagePopup from './MessagePopup';

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

export default function ConversationsList({ currentUserId }: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'focused' | 'other'>('focused');

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/conversations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const openChat = (user: any) => {
    setSelectedUser(user);
    setShowChatPopup(true);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Total unread count
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Message Button - More Elaborate */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 transition-all z-40 flex items-center gap-3 group"
        >
          <div className="relative">
            <MessageCircle size={24} />
            {totalUnread > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}
          </div>
          <span className="font-semibold hidden group-hover:inline-block">Messaging</span>
        </button>
      )}

      {/* Conversations List Popup - LinkedIn Style */}
      {isOpen && (
        <div className={`fixed ${isMinimized ? 'bottom-6' : 'bottom-6'} right-6 w-[400px] ${isMinimized ? 'h-14' : 'h-[600px]'} bg-white rounded-lg shadow-2xl border border-gray-300 z-40 overflow-hidden transition-all duration-300`}>
          {/* Header - LinkedIn Style */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">Messaging</h3>
            </div>
            <div className="flex items-center gap-1">
              <button className="hover:bg-gray-100 p-2 rounded-full transition-colors" title="More options">
                <MoreHorizontal size={20} className="text-gray-600" />
              </button>
              <button className="hover:bg-gray-100 p-2 rounded-full transition-colors" title="New message">
                <Edit size={20} className="text-gray-600" />
              </button>
              <button 
                onClick={toggleMinimize}
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                {isMinimized ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Search Bar */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-blue-50 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('focused')}
                  className={`flex-1 py-3 text-sm font-semibold ${
                    activeTab === 'focused'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Focused
                </button>
                <button
                  onClick={() => setActiveTab('other')}
                  className={`flex-1 py-3 text-sm font-semibold ${
                    activeTab === 'other'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Other
                </button>
              </div>

              {/* Conversations List */}
              <div className="overflow-y-auto" style={{ height: 'calc(100% - 200px)' }}>
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium mb-1">No conversations yet</p>
                    <p className="text-sm">Start messaging your connections</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv._id}
                      onClick={() => openChat(conv.otherUser)}
                      className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors flex items-start gap-3"
                    >
                      {/* Profile Picture */}
                      <div className="relative flex-shrink-0">
                        {conv.otherUser.profilePicture ? (
                          <img
                            src={conv.otherUser.profilePicture}
                            alt={conv.otherUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-lg">
                            {conv.otherUser.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      </div>

                      {/* Message Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {conv.otherUser.name}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {new Date(conv.lastMessageAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate pr-2">
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Message Popup */}
      {showChatPopup && selectedUser && (
        <MessagePopup
          otherUser={selectedUser}
          currentUserId={currentUserId}
          onClose={() => setShowChatPopup(false)}
        />
      )}
    </>
  );
}