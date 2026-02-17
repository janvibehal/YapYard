"use client";

import React from "react";
import { TrendingUp, UserPlus } from "lucide-react";

const trendingTopics = [
  {
    tag: "AItools",
    category: "Tech",
    activity: "12.4k posts today",
  },
  {
    tag: "WebDesign",
    category: "Design",
    activity: "8.1k posts today",
  },
  {
    tag: "StartupLife",
    category: "Business",
    activity: "5.9k posts today",
  },
  {
    tag: "ReactJS",
    category: "Development",
    activity: "10.3k posts today",
  },
  {
    tag: "FitnessGoals",
    category: "Lifestyle",
    activity: "7.8k posts today",
  },
];

const suggestedPeople = [
  {
    name: "Sarah Chen",
    username: "@sarahchen",
    bio: "UI/UX Designer • Creating beautiful interfaces",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    followers: "12.5k",
    verified: true,
  },
  {
    name: "Alex Morgan",
    username: "@alexcodes",
    bio: "Full-stack dev • React & Node.js enthusiast",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    followers: "8.3k",
    verified: false,
  },
  {
    name: "Maya Patel",
    username: "@mayawrites",
    bio: "Tech Writer • Simplifying complex topics",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    followers: "15.1k",
    verified: true,
  },
  {
    name: "Jordan Lee",
    username: "@jordandesigns",
    bio: "Product Designer • Building the future",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    followers: "6.7k",
    verified: false,
  },
];

const SidebarRight = () => {
  return (
    <aside className="w-80 hidden lg:block">
      <div className="sticky top-20 space-y-6">
        {/* TRENDING TOPICS CARD */}
        <div
          className="
          relative
          bg-black/40
          backdrop-blur-2xl
          border border-white/10
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          p-5
          rounded-2xl
        "
        >
          {/* ORANGE AMBIENT GLOW */}
          <div
            className="
            absolute bottom-[-120px] left-1/2 -translate-x-1/2
            w-[300px] h-[200px]
            bg-orange-500/20
            blur-[120px]
            pointer-events-none
          "
          />

          {/* HEADER */}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Trending Topics
            </h3>
          </div>

          {/* LIST */}
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={topic.tag}
                className="
                group
                rounded-xl
                p-3
                cursor-pointer
                hover:bg-white/5
                transition-all
              "
              >
                <p className="text-white font-semibold text-sm group-hover:text-orange-400 transition">
                  #{topic.tag}
                </p>

                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{topic.category}</span>
                  <span>{topic.activity}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="text-sm text-orange-400 mt-4 hover:text-orange-300 transition">
            See more
          </button>
        </div>

        {/* SUGGESTED PEOPLE CARD */}
        <div
          className="
          relative
          bg-black/40
          backdrop-blur-2xl
          border border-white/10
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          p-5
          rounded-2xl
        "
        >
          {/* BLUE AMBIENT GLOW */}
          <div
            className="
            absolute top-[-100px] left-1/2 -translate-x-1/2
            w-[250px] h-[180px]
            bg-blue-500/15
            blur-[100px]
            pointer-events-none
          "
          />

          {/* HEADER */}
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Suggested People
            </h3>
          </div>

          {/* LIST */}
          <div className="space-y-4">
            {suggestedPeople.map((person) => (
              <div
                key={person.username}
                className="
                group
                flex items-start gap-3
                rounded-xl
                p-3
                hover:bg-white/5
                transition-all
                cursor-pointer
              "
              >
                {/* AVATAR */}
                <div className="relative flex-shrink-0">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-12 h-12 rounded-full border-2 border-white/10"
                  />
                  {person.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-white font-semibold text-sm truncate group-hover:text-blue-400 transition">
                      {person.name}
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs">{person.username}</p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {person.bio}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {person.followers} followers
                  </p>
                </div>

                {/* FOLLOW BUTTON */}
                <button
                  className="
                  flex-shrink-0
                  px-4 py-1.5
                  text-xs font-semibold
                  bg-blue-500/20
                  text-blue-400
                  border border-blue-400/30
                  rounded-full
                  hover:bg-blue-500/30
                  hover:border-blue-400/50
                  transition-all
                "
                >
                  Follow
                </button>
              </div>
            ))}
          </div>

          <button className="text-sm text-blue-400 mt-4 hover:text-blue-300 transition">
            See more
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;