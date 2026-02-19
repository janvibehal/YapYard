"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-black">
      {/* Background glow */}
      <div className="fixed inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-black pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg--500/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl mx-auto py-10 px-4 text-white">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}