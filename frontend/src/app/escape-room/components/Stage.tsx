"use client";
import React from "react";

interface StageProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function Stage({ title, description, children }: StageProps) {
  return (
    <div className="p-8 bg-gradient-to-b from-gray-900/90 to-gray-800/80 rounded-2xl shadow-xl text-left border border-gray-700 hover:border-yellow-400/40 transition-all duration-300">
      <h2 className="text-3xl font-extrabold mb-3 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,255,0,0.6)]">
        {title}
      </h2>
      <p className="mb-6 text-gray-200">{description}</p>
      {children}
    </div>
  );
}
