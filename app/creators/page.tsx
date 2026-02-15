"use client";

import { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import SidebarLeft from "@/components/Sidebars/Sidebar-left";
import Hero from "@/components/creators/Hero";
import Filters from "@/components/creators/Filters";
import CreatorGrid from "@/components/creators/CreatorGrid";

export default function CreatorsPage() {

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-black">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN LAYOUT */}
      <div className="flex pt-16">

        {/* SIDEBAR */}
        <div className="hidden md:block sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarLeft collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Hero />
          <Filters />
          <CreatorGrid />
        </div>

      </div>
    </div>
  );
}
