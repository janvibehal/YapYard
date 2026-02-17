"use client";

import { useAuth } from "@/context/AuthContext";
import ConversationsList from "./ConversationsList";

export default function MessagingWrapper() {
  const { user } = useAuth();

  if (!user) return null;

  return <ConversationsList currentUserId={user._id} />;
}