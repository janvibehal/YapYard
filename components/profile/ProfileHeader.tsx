"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function ProfileHeader({
  profile,
  userId,
  postsCount,
  refreshProfile,
  onEdit,
}: any) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (!profile || !user) return;
    setFollowing(profile.followers?.includes(user._id));
  }, [profile, user]);

  const handleFollow = async () => {
    try {
      if (!user?.token) return;
      setLoadingFollow(true);
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Follow failed");
      setFollowing(data.following);
      refreshProfile?.();
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-neutral-950/80 via-neutral-900 to-neutral-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
      
      {/* Outer Glow */}
      <div className="absolute -inset-px bg-gradient-to-r from-orange-900/20 via-transparent to-orange-900/20 rounded-3xl blur-sm" />
      
      {/* COVER */}
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-800/40 via-orange-600/20 to-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-900" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, orange 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Floating orbs */}
        <div className="absolute top-8 right-20 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute top-4 right-40 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl" />
      </div>

      <div className="relative px-8 pb-8">
        {/* AVATAR + ACTIONS */}
        <div className="flex justify-between items-end -mt-16 mb-6">
          {/* Avatar */}
          <div className="flex items-end gap-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-all duration-500" />
              <div className="relative p-1 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full">
                <img
                  src={profile?.avatarUrl || `https://picsum.photos/200?random=${userId}`}
                  className="w-28 h-28 rounded-full object-cover border-4 border-neutral-900"
                />
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-neutral-900" />
            </div>

            <div className="mb-3 space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-superbold text-white">{profile?.name}</h1>
                {/* Verified */}
                <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-neutral-400 text-sm">
                @{profile?.username || profile?.email?.split("@")[0] || "user"}
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mb-3">
            {user?._id === userId && (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800/80 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-neutral-700/80 hover:border-orange-500/30 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}

            {user?._id !== userId && (
              <button
                onClick={handleFollow}
                disabled={loadingFollow}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  following
                    ? "bg-neutral-800/80 border border-white/10 text-white hover:bg-neutral-700/80 hover:border-orange-500/30"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02]"
                }`}
              >
                {loadingFollow ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : following ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Following
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Follow
                  </>
                )}
              </button>
            )}

            {user?._id !== userId && (
              <button
                onClick={async () => {
                  if (!user?.token) return;
                  const res = await fetch("/api/conversations", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ otherUserId: userId }),
                  });
                  if (res.ok) {
                    window.dispatchEvent(new CustomEvent("openChat", {
                      detail: { _id: userId, name: profile?.name, profilePicture: profile?.avatarUrl },
                    }));
                  } else {
                    alert("You must follow each other to message");
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800/80 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-neutral-700/80 hover:border-orange-500/30 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Message
              </button>
            )}
          </div>
        </div>

        {/* BIO */}
        <p className="text-neutral-300 text-sm leading-relaxed max-w-2xl mb-6">
          {profile?.bio || "This user hasn't added a bio yet."}
        </p>

        {/* STATS */}
        <div className="flex gap-4">
          {[
            { value: postsCount || 0, label: "Posts" },
            { value: profile?.followers?.length || 0, label: "Followers" },
            { value: profile?.following?.length || 0, label: "Following" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex-1 bg-neutral-800/50 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/5 hover:border-orange-500/20 transition-all duration-300 group cursor-pointer text-center"
            >
              <p className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-orange-600 group-hover:bg-clip-text transition-all duration-300">
                {stat.value}
              </p>
              <p className="text-neutral-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}