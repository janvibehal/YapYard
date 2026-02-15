"use client";

import SidebarLeft from "../components/Sidebars/Sidebar-left";
import SidebarRight from "../components/Sidebars/Sidebar-right";
import MiddleContent from "../components/posts/MiddleContent";
import Navbar from "../components/navigation/Navbar";

export default function Home() {

  const hideScrollbar = {
    scrollbarWidth: "none" as const,
    msOverflowStyle: "none" as const,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN LAYOUT */}
      <div className="flex pt-14">

        {/* LEFT SIDEBAR */}
        <div
          className="hidden md:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={hideScrollbar}
        >
          <SidebarLeft />
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1">
          <MiddleContent />
        </div>

        {/* RIGHT SIDEBAR */}
        <div
          className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={hideScrollbar}
        >
          <SidebarRight />
        </div>

      </div>

    </div>
  );
}
