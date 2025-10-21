"use client";
import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Stage from "../components/Stage";

export default function Stage2() {
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = (color: string) => {
    if (color === "green") {
      setClicked(true);
      setMessage("✅ You chose the right color — Debug mode activated!");
    } else {
      setMessage("❌ That’s a bug color! Try again.");
    }
  };

  return (
    <Layout>
      <Stage
        title="Stage 2 – Choose the Debug Color"
        description="One of these glowing buttons represents a successful debug. Click the right one to proceed!"
      >
        {/* Color Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mt-10 justify-items-center">
          {["red", "blue", "green", "yellow"].map((color) => (
            <button
              key={color}
              onClick={() => handleClick(color)}
              className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full transition-transform duration-300 
                          border-4 border-${color}-400/70 shadow-[0_0_35px_${color}] 
                          hover:scale-110 hover:shadow-[0_0_60px_${color}] active:scale-95`}
              style={{
                backgroundColor: color,
                boxShadow: `0 0 30px ${color}, inset 0 0 20px ${color}`,
              }}
            />
          ))}
        </div>

        {/* Feedback Message */}
        {message && (
          <p
            className={`mt-8 text-lg font-semibold ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* Next Stage Button */}
        {clicked && (
          <Link
            href="/escape-room/stage3"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg 
                       font-bold shadow-[0_0_25px_rgba(0,255,0,0.6)] transition-transform hover:scale-110 mt-6"
          >
            Next Stage →
          </Link>
        )}
      </Stage>
    </Layout>
  );
}
