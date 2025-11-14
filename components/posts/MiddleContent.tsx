"use client";

import React, { useState, useEffect } from "react";
import PostCreator from "./PostCreator";
import PostCard from "./PostCard";
import { useAuth } from "@/context/AuthContext";

interface PostFromBackend {
  _id: string;
  author: { name: string; avatarUrl: string };
  feeling?: string;
  withUser?: string;
  createdAt: string;
  text: string;
  media?: { _id: string; url: string; type: "image" | "video"; alt?: string }[];
  likes?: { _id: string; name }[];
  comments?: any[];
  sharedCount?: number;
}

const MiddleContent: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostFromBackend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/posts", { method: "GET", credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: PostFromBackend[] = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main className="flex-1 h-screen p-4 space-y-4 overflow-y-auto scrollbar-custom relative md:ml-64 md:mr-72 mx-auto max-w-4xl sm:px-6 lg:px-8">
      <PostCreator />
      {loading
        ? Array.from({ length: 3 }).map((_, idx) => <PostCard key={idx} postId="" />)
        : posts.map((post) => <PostCard key={post._id} postId={post._id} />)}
    </main>
  );
};

export default MiddleContent;
