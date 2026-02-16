"use client";

import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PostCard from "@/components/posts/PostCard";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  // ✅ FETCH PROFILE DATA
  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${user._id}`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  // ✅ FETCH USER POSTS
  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/posts/user/${user._id}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOAD DATA ON PAGE LOAD
  useEffect(() => {
    if (!user?._id) return;

    fetchProfile();
    fetchPosts();
  }, [user]);

  // ✅ NOT LOGGED IN
  if (!user) {
    return (
      <div className="pt-24 text-center text-gray-400">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <main className="pt-20 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* PROFILE HEADER */}
        {profile && (
          <ProfileHeader
            profile={profile}
            userId={user._id}
            postsCount={posts.length}
            refreshProfile={fetchProfile}
            onEdit={() => setShowEdit(true)}
          />
        )}

        {/* EDIT PROFILE MODAL */}
        {showEdit && profile && (
          <EditProfileModal
            profile={profile}
            onClose={() => setShowEdit(false)}
            onSave={(updatedProfile) => {
              setProfile(updatedProfile);
              setShowEdit(false);
            }}
          />
        )}

        {/* PROFILE TABS */}
        <div className="bg-[#111] rounded-xl border border-white/10 p-2 flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-orange-500">
            Posts
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-white/10 transition">
            Media
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-white/10 transition">
            Likes
          </button>
        </div>

        {/* POSTS CARD */}
        <div className="bg-[#111] rounded-xl border border-white/10 p-6">

          {loading && (
            <div className="text-center text-gray-400 py-10">
              Loading posts...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center text-gray-500 py-16">
              No posts yet.
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post._id} postId={post._id} />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
