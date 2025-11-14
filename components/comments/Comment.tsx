"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import CommentThread, { CommentType } from "./CommentThread";
import { useAuth } from "@/context/AuthContext";

interface CommentProps {
  currentUserCommentAvatar: string;
  postId: string;
}

const Comment: React.FC<CommentProps> = ({
  currentUserCommentAvatar,
  postId,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId || !user?.token) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/comments?postId=${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const mappedComments: CommentType[] = data.comments.map((c: any) => ({
            _id: c._id,
            text: c.text,
            author: {
              _id: c.author?._id || "unknown",
              name: c.author?.name || "Unknown",
              avatarUrl: c.author?.avatarUrl || "/default-avatar.png",
            },
            replies:
              c.replies?.map((r: any) => ({
                _id: r._id,
                text: r.text,
                author: {
                  _id: r.author?._id || "unknown",
                  name: r.author?.name || "Unknown",
                  avatarUrl: r.author?.avatarUrl || "/default-avatar.png",
                },
                replies: [],
                likes: r.likes || [],
                likesCount: r.likes?.length || 0,
                likedByMe: r.likes?.includes(user._id),
              })) || [],
            likes: c.likes || [],
            likesCount: c.likes?.length || 0,
            likedByMe: c.likes?.includes(user._id),
          }));

          setComments(mappedComments);
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, user?.token]);

  const toggleComments = () => setShowComments((prev) => !prev);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user?.token) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ postId, text: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        const newC: CommentType = {
          _id: data.comment._id,
          text: data.comment.text,
          author: {
            _id: data.comment.author._id,
            name: data.comment.author.name,
            avatarUrl: data.comment.author.avatarUrl || "/default-avatar.png",
          },
          replies: [],
          likes: [],
          likesCount: 0,
          likedByMe: false,
        };
        setComments([newC, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleAddReply = async (parentId: string, replyText: string) => {
    if (!replyText.trim() || !user?.token) return;
    try {
      const res = await fetch(`/api/comments/replies/${parentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ text: replyText }),
      });
      const data = await res.json();
      if (data.success) {
        const addReplyRecursively = (list: CommentType[]): CommentType[] =>
          list.map((comment) => {
            if (comment._id === parentId) {
              const newReply: CommentType = {
                _id: data.comment._id,
                text: data.comment.text,
                author: {
                  _id: data.comment.author._id,
                  name: data.comment.author.name,
                  avatarUrl:
                    data.comment.author.avatarUrl || "/default-avatar.png",
                },
                replies: [],
                likes: [],
                likesCount: 0,
                likedByMe: false,
              };
              return { ...comment, replies: [...comment.replies, newReply] };
            }
            if (comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyRecursively(comment.replies),
              };
            }
            return comment;
          });

        setComments((prev) => addReplyRecursively(prev));
      }
    } catch (err) {
      console.error("Failed to add reply:", err);
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={toggleComments}
        className="text-sm text-blue-500 hover:underline mb-2"
      >
        {showComments ? "Hide Comments" : `View Comments (${comments.length})`}
      </button>

      {showComments && (
        <div className="space-y-3">
          {loading && <div>Loading comments...</div>}
          {!loading &&
            comments.map((comment) => (
              <CommentThread
                key={comment._id}
                comment={comment}
                postId={postId}
                onReplyAdded={(reply) =>
                  handleAddReply(comment._id, reply.text)
                }
              />
            ))}

          <div className="flex items-center space-x-3 mt-4">
            <img
              src={currentUserCommentAvatar}
              alt="Your avatar"
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-gray-300 dark:ring-gray-600"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md py-2 pl-4 pr-10 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 transition duration-150 text-sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
