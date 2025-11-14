"use client";

import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

interface ReplyProps {
  _id: string;
  avatar: string;
  name: string;
  text: string;
  image?: string;
  likesCount?: number;
  likedByMe?: boolean;
  onReply?: () => void;   // IMPORTANT: removed replyId
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const Reply: React.FC<ReplyProps> = ({
  _id,
  avatar,
  name,
  text,
  image,
  likesCount: initialLikes = 0,
  likedByMe: initialLiked = false,
  onReply,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loadingLike, setLoadingLike] = useState(false);

  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);

    try {
      const res = await fetch(`${BASE_URL}/api/comments/likes/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLiked(!liked);
        setLikesCount(data.likes);
      }
    } catch (err) {
      console.error("Error liking reply:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="ml-10 mt-2">
      <div className="flex items-start space-x-2">
        <img
          src={avatar}
          alt={name}
          className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-600"
        />

        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm flex justify-between items-center">
            <span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {name}
              </span>{" "}
              {text}
            </span>
            {image && <img src={image} className="w-6 h-6 rounded ml-2" />}
          </div>

          <div className="flex space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2">
            <button
              onClick={handleLike}
              disabled={loadingLike}
              className={`hover:underline flex items-center space-x-1 ${
                liked ? "text-red-500" : ""
              }`}
            >
              <Heart className="w-3 h-3" />
              <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
            </button>

            <button
              onClick={() => onReply && onReply()}
              className="hover:underline flex items-center space-x-1"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
