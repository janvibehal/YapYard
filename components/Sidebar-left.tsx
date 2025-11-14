"use client";

import React, { useState } from "react";
import {
  Home,
  Hash,
  Heart,
  Clapperboard,
  Bell,
  User,
  Upload,
  MessageSquare,
  Moon,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const COLORS = {
  BACKGROUND_PRIMARY: "bg-[#131313]",
  BACKGROUND_SECONDARY: "bg-gray-800",
  BORDER_COLOR: "border-gray-800",
  TEXT_PRIMARY: "text-white",
  TEXT_SECONDARY: "text-gray-300",
  TEXT_HEADER: "text-gray-500",
  ACTIVE_ACCENT: "border-white",
  ACTIVE_BACKGROUND: "bg-gray-800",
};

const menuSections = [
  {
    title: "MAIN MENU",
    links: [
      { name: "Home Page", icon: Home, isActive: true },
      { name: "Trending Topics", icon: Hash },
      { name: "Popular Creator", icon: Heart },
      { name: "Reels", icon: Clapperboard },
      { name: "Notification", icon: Bell },
    ],
    defaultOpen: true,
  },
  {
    title: "MY MENU",
    links: [
      { name: "Profile", icon: User },
      { name: "Shot Upload", icon: Upload },
      { name: "Message", icon: MessageSquare },
    ],
    defaultOpen: true,
  },
];

const MenuItem = ({ icon: Icon, name, isActive = false }) => (
  <div
    className={`flex items-center p-3 my-0.5 rounded-lg transition-colors cursor-pointer text-sm
      ${
        isActive
          ? `${COLORS.ACTIVE_BACKGROUND} ${COLORS.TEXT_PRIMARY} font-semibold border-r-4 ${COLORS.ACTIVE_ACCENT}`
          : `${COLORS.TEXT_SECONDARY} opacity-80 hover:${COLORS.BACKGROUND_SECONDARY}/50 hover:${COLORS.TEXT_PRIMARY}`
      }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span>{name}</span>
  </div>
);

const MenuSection = ({ section }) => {
  const [isOpen, setIsOpen] = useState(section.defaultOpen);

  return (
    <div className="mb-6">
      <div
        className={`flex items-center justify-between text-xs font-bold tracking-widest ${COLORS.TEXT_HEADER} uppercase cursor-pointer mb-2`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {section.title}
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-gray-400" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-400" />
        )}
      </div>

      {isOpen && (
        <nav>
          {section.links.map((link, index) => (
            <MenuItem key={index} {...link} />
          ))}
        </nav>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const avatarSrc =
    user?.avatarUrl ||
    `https://picsum.photos/200?random=${user?._id || Math.floor(Math.random() * 1000)}`;

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="fixed top-4 left-4 bg-[#1c1c1c] p-2 rounded-lg md:hidden z-[9999]"
        onClick={() => setOpen(true)}
      >
        <Menu className="text-white w-6 h-6" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm md:hidden z-[9998]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 p-4 z-[9999] shadow-2xl rounded-r-xl
          ${COLORS.BACKGROUND_PRIMARY} ${COLORS.TEXT_PRIMARY} border ${COLORS.BORDER_COLOR}
          transform transition-transform duration-300
          ${open ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"}
          md:translate-x-0 md:pointer-events-auto md:static`}
      >
        {/* Close Button Mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setOpen(false)}>
            <X className="text-white w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center mb-8 pt-1">
          <h1 className="text-3xl pl-1 font-serif italic text-white">DZINR-APP</h1>
        </div>

        {/* Menu Sections */}
        <div className="flex-grow overflow-y-auto pr-1 custom-scroll">
          {menuSections.map((section, index) => (
            <MenuSection key={index} section={section} />
          ))}
        </div>

        {/* Profile / Login */}
        <div className="my-4 border-t border-gray-700 pt-4">
          {user ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
              <div className="flex items-center space-x-3">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
                <span className="font-medium capitalize">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-8 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
            >
              Login
            </a>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <div
          className={`p-3 ${COLORS.BACKGROUND_SECONDARY} rounded-lg border ${COLORS.BORDER_COLOR} flex items-center justify-between shadow-inner`}
        >
          <div className="flex items-center text-sm">
            <Moon className="w-5 h-5 mr-3 text-white" />
            <span className="text-white">Dark Mode</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-gray-600 rounded-full peer-checked:bg-white transition-colors duration-300"></div>
            <div
              className={`absolute top-0.5 left-[3px] w-5 h-5 rounded-full transition-transform duration-300 shadow-lg ${
                isDarkMode ? "translate-x-[20px] bg-black" : "translate-x-0 bg-white"
              }`}
            />
          </label>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
