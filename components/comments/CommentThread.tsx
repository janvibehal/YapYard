"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface CommentType {
  _id: string;
  text: string;
  author?: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  replies?: CommentType[];
  likes?: string[];
  likedByMe?: boolean;
  likesCount?: number;
}

interface CommentThreadProps {
  comment: CommentType;
  postId: string;
  parentCommentId?: string;
  onReplyAdded?: (reply: CommentType) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  postId,
  parentCommentId,
  onReplyAdded,
}) => {
  const { user } = useAuth();

  const topCommentId = parentCommentId || comment._id;

  const [liked, setLiked] = useState(comment.likedByMe || false);
  const [likesCount, setLikesCount] = useState(
    comment.likesCount || comment.likes?.length || 0
  );
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<CommentType[]>(comment.replies || []);

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  const handleLike = async () => {
    if (loadingLike || !user?.token) return;

    setLoadingLike(true);
    try {
      const res = await fetch(`${BASE_URL}/api/comments/likes/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLiked(!liked);
        setLikesCount(data.likes);
      }
    } catch (err) {
      console.error("Error liking comment:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleAddReply = async (text: string) => {
    const userId = user?._id || user?.id || user?.userId || user?.user?._id;

    if (!text.trim() || !userId) {
      console.error("User ID missing → cannot send reply");
      return;
    }

    setLoadingReply(true);

    try {
      const res = await fetch(`/api/comments/replies/${topCommentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId,
          text,
          emojis: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error adding reply:", data.error);
        return;
      }

      const newReply = data.reply;
      setReplies((prev) => [...prev, newReply]);
      setReplyText("");
      setShowReplyInput(false);
    } catch (err) {
      console.error("Error adding reply:", err);
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div className="ml-0 mt-3">
      <div className="flex items-start space-x-2">
        <img
          src={comment.author?.avatarUrl || "/default-avatar.png"}
          alt={comment.author?.name || "Unknown"}
          className="w-8 h-8 rounded-lg object-cover ring-1 ring-gray-300 dark:ring-gray-600"
        />

        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {comment.author?.name || "Unknown"}
            </span>{" "}
            {comment.text}
          </div>

          <div className="flex space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
            <button
              onClick={handleLike}
              disabled={loadingLike}
              className={`hover:underline flex items-center space-x-1 ${
                liked ? "text-red-500" : ""
              }`}
            >
              Like ({likesCount})
            </button>

            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="hover:underline"
            >
              Reply
            </button>

            {replies.length > 0 && (
              <button onClick={() => setShowReplies(!showReplies)}>
                {showReplies
                  ? "Hide Replies"
                  : `Show Replies (${replies.length})`}
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="flex items-center space-x-2 mt-2 ml-2">
              <input
                type="text"
                className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md py-1 px-2 text-sm"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAddReply(replyText)
                }
              />
              <button
                onClick={() => handleAddReply(replyText)}
                disabled={loadingReply}
              >
                <ArrowRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}

          {showReplies && replies.length > 0 && (
            <div className="ml-6 border-l border-gray-300 pl-4 mt-2 space-y-3">
              {replies.map((reply) => (
                <CommentThread
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  parentCommentId={topCommentId}
                  onReplyAdded={(newReply) => {
                    setReplies((prev) =>
                      prev.map((r) =>
                        r._id === reply._id
                          ? { ...r, replies: [...(r.replies || []), newReply] }
                          : r
                      )
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentThread;
