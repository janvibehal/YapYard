"use client";

import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Comment from "../comments/Comment";
import PostCardSkeleton from "./PostCardSkeleton";
import CommentSkeleton from "../comments/CommentSkeleton";
import { useAuth } from "@/context/AuthContext";

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

interface CommentType {
  id: string;
  author: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  text: string;
  replies?: CommentType[];
}

interface PostData {
  id: string;
  userAvatarUrl: string;
  name: string;
  feeling?: string;
  withUser?: string;
  postDate: string;
  postText: string;
  media: MediaItem[];
  likes: { _id: string; name: string }[];
  comments: CommentType[];
}

interface PostCardProps {
  postId: string;
}

const PostCard: React.FC<PostCardProps> = ({ postId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [post, setPost] = useState<PostData | null>(null);

  const postLiked = post?.likes.some((like) => like._id === user?._id) || false;
  const likedNames =
    post?.likes.filter((like) => like._id !== user?._id).map((like) => like.name) || [];
  const totalLikesCount = post?.likes.length || 0;

  useEffect(() => {
  const fetchPost = async () => {
    if (!postId || !user?.token) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch post");
      const data = await res.json();
      const postData = data.post || data;

      setPost({
        id: postData._id,
        userAvatarUrl: postData.author?.avatarUrl || `https://placehold.co/50x50/3498db/ffffff?text=${postData.author?.name?.charAt(0) || "U"}`,
        name: postData.author?.name || "Unknown User",
        feeling: postData.feeling,
        withUser: postData.withUser,
        postDate: new Date(postData.createdAt).toLocaleString(),
        postText: postData.text,
        media: postData.media?.map((m: any) => ({ id: m._id, url: m.url, type: m.type })) || [],
        likes: postData.likes || [],
        comments: postData.comments?.map((c: any) => ({
          id: c._id,
          author: {
            _id: c.author?._id || "",
            name: c.author?.name || "Unknown",
            avatarUrl: c.author?.avatarUrl || `https://placehold.co/50x50/3498db/ffffff?text=${c.author?.name?.charAt(0) || "U"}`,
          },
          text: c.text,
          replies: c.replies || [],
        })) || [],
      });
    } catch (err) {
      console.error("Error fetching post:", err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  fetchPost();
}, [postId, user?.token]);


  const togglePostLike = async () => {
    if (!post || !user?.token) return;

    const isLiked = postLiked;

    setPost((prev) => {
      if (!prev) return null;
      const updatedLikes = isLiked
        ? prev.likes.filter((like) => like._id !== user._id)
        : [...prev.likes, { _id: user._id, name: user.name }];
      return { ...prev, likes: updatedLikes };
    });

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });
      if (!res.ok) throw new Error("Server failed to process like");
    } catch (err) {
      console.error("Failed to toggle like:", err);

      setPost((prev) => {
        if (!prev) return null;
        const updatedLikes = isLiked
          ? [...prev.likes, { _id: user._id, name: user.name }]
          : prev.likes.filter((like) => like._id !== user._id);
        return { ...prev, likes: updatedLikes };
      });
    }
  };

  if (loading || !post)
    return (
      <div className="mb-6">
        <PostCardSkeleton />
        <CommentSkeleton />
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#131313] rounded-lg shadow-lg dark:shadow-2xl p-4 w-full mx-auto border border-gray-200 dark:border-gray-700 mb-6">

      <div className="flex items-center mb-3">
        <img
          src={post.userAvatarUrl}
          alt={`${post.name}'s avatar`}
          className="w-10 h-10 rounded-lg object-cover mr-3 ring-1 ring-gray-300 dark:ring-gray-600"
        />
        <div>
          <div className="text-gray-900 dark:text-white font-semibold text-sm">
            {post.name}
            {post.feeling && (
              <span className="ml-1 text-gray-700 dark:text-gray-300 font-normal">
                is feeling {post.feeling} {post.feeling === "excited" ? "🤩" : ""}
              </span>
            )}
            {post.withUser && (
              <span className="ml-1 text-gray-700 dark:text-gray-300 font-normal">
                with <span className="font-semibold">{post.withUser}</span>
              </span>
            )}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">{post.postDate}</div>
        </div>
      </div>


      <p className="text-gray-800 dark:text-gray-200 mb-3 text-sm whitespace-pre-wrap">{post.postText}</p>

      {post.media.length > 0 && (
        <div className={`grid gap-2 mb-4 ${post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {post.media.map((item) => (
            <div key={item.id} className="relative w-full h-52">
              {item.type === "video" ? (
                <video controls src={item.url} className="w-full h-full object-cover rounded-md" />
              ) : (
                <img src={item.url} alt={item.type} className="w-full h-full object-cover rounded-md" />
              )}
            </div>
          ))}
        </div>
      )}


      <div className="flex justify-around border-t border-b border-gray-200 dark:border-gray-700 py-2 mb-3">
        <button
          onClick={togglePostLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition duration-150 ${
            postLiked
              ? "text-red-500 hover:text-red-600 dark:hover:text-red-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Heart className="w-5 h-5" fill={postLiked ? "currentColor" : "none"} />
          <span className="text-sm font-medium">{postLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition duration-150"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Comment</span>
        </button>

        <button
          disabled={sharing}
          onClick={async () => {
            setSharing(true);
            const postUrl = window.location.href;
            const shareText = `Check out this post by ${post.name}: ${post.postText}`;
            try {
              if (navigator.share) {
                await navigator.share({ title: `Post by ${post.name}`, text: shareText, url: postUrl });
              } else {
                const tempInput = document.createElement("textarea");
                tempInput.value = `${shareText}\n${postUrl}`;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
                alert("Post link and text copied to clipboard!");
              }
            } catch (err) {
              console.log(err);
            }
            setSharing(false);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition duration-150 ${
            sharing ? "text-gray-400 cursor-not-allowed" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      <div className="flex items-center text-gray-700 dark:text-gray-300 text-xs mb-3">
        {totalLikesCount > 0 && (
          <>
            <Heart className="w-3 h-3 mr-1 text-red-500 fill-current" />
            <span className="font-semibold">
              {postLiked && `You${likedNames.length > 0 ? ", " : ""}`}
              {likedNames.length > 0 && likedNames.slice(0, 2).join(", ")}
              {likedNames.length > 2 && ` and ${likedNames.length - 2} others`}
            </span>
            <span className="ml-1"> liked this.</span>
          </>
        )}
      </div>

      {showComments && (
        <Comment
          currentUserCommentAvatar={
            user?.profilePic ||
            `https://placehold.co/50x50/3498db/ffffff?text=${user?.name?.charAt(0) || "U"}`
          }
          postId={postId}
        />
      )}
    </div>
  );
};

export default PostCard;
