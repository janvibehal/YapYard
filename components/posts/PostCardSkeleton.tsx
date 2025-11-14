"use client";

import React from "react";

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#131313] rounded-lg shadow-lg dark:shadow-2xl p-4 w-full mx-auto border border-gray-200 dark:border-gray-700 mb-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg mr-3" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32" />
          <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>

      {/* Post Text */}
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
      </div>

      {/* Post Images */}
      <div className="grid gap-2 mb-4 grid-cols-2">
        <div className="h-52 bg-gray-300 dark:bg-gray-700 rounded-md" />
        <div className="h-52 bg-gray-300 dark:bg-gray-700 rounded-md" />
      </div>

      {/* Actions */}
      <div className="flex justify-around border-t border-b border-gray-200 dark:border-gray-700 py-2 mb-3">
        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-md" />
        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-md" />
        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-md" />
      </div>

      {/* Liked By */}
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3" />

      {/* Comments */}
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6" />
            <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
