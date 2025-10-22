"use client";
import React from "react";
import Timer from "./Timer";
import SaveProgressButton from "./SaveProgressButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center 
                 bg-cover bg-center bg-no-repeat text-white overflow-hidden"
      style={{ backgroundImage: "url('/bgpic.avif')" }}
    >
      {/* --- Dark overlay --- */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

      {/* --- Top-right controls: Timer + Save --- */}
      <div className="absolute top-6 right-6 z-10 flex gap-3 items-center">
        <Timer />
        <SaveProgressButton />
      </div>

      {/* --- Main content box --- */}
      <main
        className="relative z-10 w-full max-w-3xl mx-auto px-6 sm:px-10 py-12 text-center 
                   bg-black/60 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/10
                   animate-fade-in"
      >
        {children}
      </main>
    </div>
  );
}
