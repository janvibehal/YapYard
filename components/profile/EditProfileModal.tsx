"use client";

import { useState, useEffect } from "react";

export default function EditProfileModal({ profile, onClose, onSave }: any) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // ✅ Load profile safely when modal opens
  useEffect(() => {
    if (!profile) return;

    setName(profile.name || "");
    setUsername(profile.username || "");
    setBio(profile.bio || "");
  }, [profile]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/users/${profile._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, bio }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error("Update failed");

      onSave(data);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#111] p-6 rounded-xl w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold">Edit Profile</h2>

        {/* NAME */}
        <input
          className="w-full bg-black border border-white/20 p-3 rounded-lg"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* USERNAME */}
        <input
          className="w-full bg-black border border-white/20 p-3 rounded-lg"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* BIO */}
        <textarea
          className="w-full bg-black border border-white/20 p-3 rounded-lg"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="border border-white/20 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-orange-500 px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
