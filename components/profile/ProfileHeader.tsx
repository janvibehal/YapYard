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

  // Sync follow state
  useEffect(() => {
    if (!profile || !user) return;
    const isFollowing = profile.followers?.includes(user._id);
    setFollowing(isFollowing);
  }, [profile, user]);

  // Follow / unfollow handler
  const handleFollow = async () => {
    try {
      if (!user?.token) return;

      setLoadingFollow(true);

      const res = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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
    <section className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">

      {/* COVER */}
      <div className="h-48 bg-gradient-to-r from-orange-500/30 via-purple-500/30 to-pink-500/30" />

      <div className="px-6 pb-6">

        {/* AVATAR + ACTIONS */}
        <div className="flex justify-between items-end -mt-16">

          <div className="flex items-end gap-5">
            <img
              src={
                profile?.avatarUrl ||
                `https://picsum.photos/200?random=${userId}`
              }
              className="w-32 h-32 rounded-full border-4 border-black object-cover shadow-lg"
            />

            <div className="mb-3">
              <h1 className="text-2xl font-bold">{profile?.name}</h1>
              <p className="text-gray-400">@{profile?.username || profile?.email?.split("@")[0] || "user"}</p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mb-3">

            {/* EDIT PROFILE */}
            {user?._id === userId && (
              <button
                onClick={onEdit}
                className="border border-white/20 px-5 py-2 rounded-lg hover:bg-white/10 transition"
              >
                Edit Profile
              </button>
            )}

            {/* FOLLOW */}
            {user?._id !== userId && (
              <button
                onClick={handleFollow}
                disabled={loadingFollow}
                className="bg-orange-500 px-5 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                {loadingFollow
                  ? "Loading..."
                  : following
                  ? "Following"
                  : "Follow"}
              </button>
            )}

            {/* MESSAGE */}
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
                    window.dispatchEvent(
                      new CustomEvent("openChat", {
                        detail: {
                          _id: userId,
                          name: profile?.name,
                          profilePicture: profile?.avatarUrl,
                        },
                      })
                    );
                  } else {
                    alert("You must follow each other to message");
                  }
                }}
                className="border border-white/20 px-5 py-2 rounded-lg hover:bg-white/10 transition"
              >
                Message
              </button>
            )}
          </div>
        </div>

        {/* BIO */}
        <p className="mt-5 text-gray-300 max-w-2xl">
          {profile?.bio || "This user hasn't added a bio yet."}
        </p>

        {/* STATS */}
        <div className="flex gap-10 mt-6">

          <div>
            <p className="text-lg font-semibold">{postsCount || 0}</p>
            <p className="text-gray-400 text-sm">Posts</p>
          </div>

          <div>
            <p className="text-lg font-semibold">
              {profile?.followers?.length || 0}
            </p>
            <p className="text-gray-400 text-sm">Followers</p>
          </div>

          <div>
            <p className="text-lg font-semibold">
              {profile?.following?.length || 0}
            </p>
            <p className="text-gray-400 text-sm">Following</p>
          </div>

        </div>
      </div>
    </section>
  );
}
