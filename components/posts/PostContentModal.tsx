"use client";
import React, { useState, useEffect } from "react";
import { X, Image, Video, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useAuth } from "@/context/AuthContext"; 

interface MediaItem {
  file: File;
  preview: string;
  type: "image" | "video";
}

interface PostContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSuccess?: () => void;
  initialMedia?: MediaItem[];
}

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (videoFile: File | null, videoPreview: string | null) => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onNext,
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setVideoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVideoFile(e.dataTransfer.files[0]);
      setVideoPreview(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleNext = () => {
    onNext(videoFile, videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300"
          onClick={() => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoFile(null);
            setVideoPreview(null);
            onClose();
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Attach Video
        </h2>

        <div
          className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-md p-6 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {videoPreview ? (
            <video
              src={videoPreview}
              controls
              className="w-full max-h-60 rounded-md"
            />
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                Drag & Drop your video here
              </p>
              <label className="text-blue-600 dark:text-blue-400 underline cursor-pointer">
                or select from your computer
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!videoFile}
          className={`mt-4 w-full px-4 py-2 rounded-md font-semibold transition duration-150 ${
            videoFile
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};


const PostContentModal: React.FC<PostContentModalProps> = ({
  isOpen,
  onClose,
  onPostSuccess,
  initialMedia,
}) => {
  const { user } = useAuth(); 
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MediaItem[]>(initialMedia || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setMedia(initialMedia || []);
    setContent("");
  }, [initialMedia, isOpen]); 

  useEffect(() => {
    return () => {
      media.forEach(item => URL.revokeObjectURL(item.preview));
    };
  }, [media]); 


  const handleMediaSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type,
    }));
    setMedia((prev) => [...prev, ...filesArray]);
    e.target.value = ''; 
  };

  const handleRemoveMedia = (index: number) => {
    const removed = media[index];
    if (removed.preview) URL.revokeObjectURL(removed.preview);
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleVideoNext = (file: File | null, preview: string | null) => {
    if (!file || !preview) return;
    setMedia((prev) => [...prev, { file, preview, type: "video" }]);
  };

  const handleClose = () => {
    media.forEach(item => URL.revokeObjectURL(item.preview)); 
    setMedia([]); 
    setContent(""); 
    onClose(); 
  };

  const handlePostClick = async () => {
    if (!content.trim() && media.length === 0) return;
    setLoading(true);

    if (!user || !user.token) {
        console.error("❌ Post failed: User is not authenticated or token is missing.");
        alert("Authentication failed. Please log in again.");
        setLoading(false);
        return;
    }
    
    let mediaCleanup: string[] = [];

    try {
      const formData = new FormData();
      formData.append("text", content);
      
      media.forEach((item) => {
      
        formData.append(`mediaFile`, item.file); 
        formData.append(`mediaType`, item.type); 
        mediaCleanup.push(item.preview);
      });

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to create post. Status: ${res.status}`); 
      }

      onPostSuccess?.();
      handleClose(); 
    } catch (error) {
      console.error("❌ Post failed:", error);
      alert("Failed to upload post: " + (error as Error).message);
    } finally {
      setLoading(false);
      mediaCleanup.forEach(url => URL.revokeObjectURL(url));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl relative p-6">
          <button
            className="absolute top-3 right-3 text-gray-500 dark:text-gray-300"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center mb-4">
            <img
              src={user?.profilePic || "https://picsum.photos/200"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {user?.name || "John Doe"}
            </span>
          </div>

          <textarea
            rows={6}
            placeholder="Write something..."
            className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-3 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 resize-none mb-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {media.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 max-h-60 overflow-y-auto">
              {media.map((item, idx) => (
                <div key={idx} className="relative">
                  {item.type === "image" ? (
                    <img
                      src={item.preview}
                      alt="attachment"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ) : (
                    <video
                      src={item.preview}
                      controls
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                  <button
                    onClick={() => handleRemoveMedia(idx)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2 relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Smile className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            {showEmojiPicker && (
              <div className="absolute z-50 mt-12">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}

            <label className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
              <Image className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMediaSelect(e, "image")}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowVideoModal(true)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <button
            onClick={handlePostClick}
            disabled={loading || (!content.trim() && media.length === 0)}
            className={`mt-4 w-full px-4 py-2 rounded-md font-semibold transition duration-150 ${
              loading
                ? "bg-gray-400 text-white"
                : content.trim() || media.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      <VideoUploadModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        onNext={handleVideoNext}
      />
    </>
  );
};

export default PostContentModal;