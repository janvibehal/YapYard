"use client";
import React, { useState } from "react";
import { Edit, MoreHorizontal } from "lucide-react";
import PostContentModal from "./PostContentModal";
import { useAuth } from "@/context/AuthContext"; 

const MOCK_AVATAR = "https://picsum.photos/40/40?random=1";

const PostCreator: React.FC = () => {
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [attachedVideo, setAttachedVideo] = useState<File | null>(null);
  const [attachedVideoPreview, setAttachedVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth(); 

  const handlePost = async (content: string, videoFile?: File | null) => {
    if (!user) {
      alert("You must be logged in to post.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", content);

      if (videoFile) {
        formData.append("media", videoFile);
        formData.append("mediaType", "video");
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: token
          ? {
              Authorization: `Bearer ${token}`, 
            }
          : {},
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Post created successfully:", data);
        setAttachedVideo(null);
        setAttachedVideoPreview(null);
        setPostModalOpen(false);
      } else {
        console.error(" Error creating post:", data.message);
        alert(`Failed to post: ${data.message}`);
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("Something went wrong while posting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#131313] rounded-xs shadow-lg dark:shadow-2xl p-4 w-full mx-auto border border-gray-200 dark:border-gray-700">
      <div className="flex justify-start border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 text-sm md:text-base">
        <div
          className="flex items-center space-x-2 text-gray-900 dark:text-white font-semibold cursor-pointer p-2 rounded-md transition duration-150 relative after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white"
          onClick={() => setPostModalOpen(true)}
        >
          <Edit className="w-5 h-5" />
          <span>Make Post</span>
        </div>
      </div>

      <div
        className="flex space-x-3 items-start mb-4 cursor-text"
        onClick={() => setPostModalOpen(true)}
      >
        <img
          src={user?.avatarUrl || MOCK_AVATAR}
          alt="User Avatar"
          className="w-10 h-10 rounded-lg object-cover ring-2 ring-gray-400 dark:ring-gray-600"
        />
        <textarea
          rows={3}
          placeholder="What you doing? Where you at? Oh you got plans? Please share that!"
          className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-md py-2 px-4 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 resize-none transition duration-150"
          readOnly
        />
      </div>

      <PostContentModal
        isOpen={isPostModalOpen}
        onClose={() => setPostModalOpen(false)}
        onPost={handlePost}
        initialVideoFile={attachedVideo}
        initialVideoPreview={attachedVideoPreview}
        loading={loading}
      />
    </div>
  );
};

export default PostCreator;
