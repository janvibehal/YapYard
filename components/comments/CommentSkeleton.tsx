"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

const CommentSkeleton: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        Please log in to view posts.
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-2 animate-pulse mt-2 ml-0">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
};

export default CommentSkeleton;
