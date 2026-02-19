"use client";

import { useState, useEffect } from "react";

export default function EditProfileModal({ profile, onClose, onSave }: any) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [activeTab, setActiveTab] = useState("account");

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
        headers: { "Content-Type": "application/json" },
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

  const tabs = [
    {
      id: "account",
      label: "Account Information",
      sub: "Change your account info",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: "password",
      label: "Password",
      sub: "Change your password",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      sub: "Manage your notifications",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      id: "privacy",
      label: "Privacy",
      sub: "Control your privacy",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-neutral-950 rounded-3xl w-full max-w-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute -inset-px bg-gradient-to-r from-orange-500/20 via-transparent to-orange-600/20 rounded-3xl blur-sm pointer-events-none" />

        <div className="relative flex h-[580px]">

          {/* LEFT SIDEBAR */}
          <div className="w-64 bg-neutral-900/80 border-r border-white/5 flex flex-col p-5 gap-2">
            
            {/* Profile completion card */}
            <div className="relative bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl p-4 border border-orange-500/20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl" />
              <div className="relative flex items-center gap-3">
                {/* Progress circle */}
                <div className="relative w-12 h-12 flex-shrink-0">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#262626" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f97316" strokeWidth="3"
                      strokeDasharray={`${64} 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-orange-400">64%</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Complete profile</p>
                  <p className="text-neutral-400 text-xs mt-0.5">Unlock all features</p>
                </div>
              </div>
              <button className="relative w-full mt-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-all duration-300">
                Verify Identity
              </button>
            </div>

            {/* Nav Items */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/20 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
              >
                <span className={`transition-colors duration-300 ${
                  activeTab === tab.id ? "text-orange-400" : "text-neutral-500 group-hover:text-neutral-300"
                }`}>
                  {tab.icon}
                </span>
                <div>
                  <p className={`text-sm font-medium ${activeTab === tab.id ? "text-white" : ""}`}>
                    {tab.label}
                  </p>
                  <p className="text-xs text-neutral-500">{tab.sub}</p>
                </div>
              </button>
            ))}
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Personal Information</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-neutral-800/80 border border-white/10 flex items-center justify-center hover:bg-neutral-700 transition-all"
              >
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

              {activeTab === "account" && (
                <div className="space-y-6">

                  {/* Avatar Section */}
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="p-0.5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full">
                        <img
                          src={profile?.avatarUrl || `https://picsum.photos/200?random=1`}
                          className="w-20 h-20 rounded-full object-cover border-4 border-neutral-950"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-300">
                        Upload New Picture
                      </button>
                      <button className="px-5 py-2.5 bg-neutral-800/80 border border-white/10 text-neutral-300 text-sm font-medium rounded-xl hover:bg-neutral-700/80 hover:border-red-500/30 hover:text-red-400 transition-all duration-300">
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Name */}
                  <div className="relative group">
                    <input
                      className="w-full bg-neutral-900/80 border border-neutral-700/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 px-4 py-3.5 rounded-xl text-white placeholder-neutral-500 outline-none transition-all duration-300 pr-12"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-orange-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>

                  {/* Username */}
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">@</span>
                    <input
                      className="w-full bg-neutral-900/80 border border-neutral-700/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 pl-8 pr-12 py-3.5 rounded-xl text-white placeholder-neutral-500 outline-none transition-all duration-300"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-orange-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>

                  {/* Bio */}
                  <div className="relative">
                    <textarea
                      rows={3}
                      className="w-full bg-neutral-900/80 border border-neutral-700/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 px-4 py-3.5 rounded-xl text-white placeholder-neutral-500 outline-none transition-all duration-300 resize-none"
                      placeholder="Tell the world about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <p className="text-xs text-neutral-600 text-right mt-1">{bio.length}/160</p>
                  </div>
                </div>
              )}

              {activeTab === "password" && (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-sm mb-6">Update your password to keep your account secure.</p>
                  {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                    <div key={label} className="relative">
                      <input
                        type="password"
                        className="w-full bg-neutral-900/80 border border-neutral-700/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 px-4 py-3.5 rounded-xl text-white placeholder-neutral-500 outline-none transition-all duration-300"
                        placeholder={label}
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-sm mb-6">Manage how you receive notifications.</p>
                  {["New followers", "Post likes", "Comments", "Messages", "Mentions"].map((item) => (
                    <div key={item} className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-neutral-300 text-sm">{item}</span>
                      <div className="w-11 h-6 bg-orange-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-sm mb-6">Control who can see your content.</p>
                  {["Private Account", "Show online status", "Allow tagging"].map((item) => (
                    <div key={item} className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-neutral-300 text-sm">{item}</span>
                      <div className="w-11 h-6 bg-neutral-700 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-neutral-400 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-neutral-800/80 border border-white/10 text-white text-sm font-medium hover:bg-neutral-700/80 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}