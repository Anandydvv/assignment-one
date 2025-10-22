"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Stage from "../components/Stage";

const TARGET_COLOR = "green";

export default function Stage2() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      if (isCorrect && selectedColor) {
        localStorage.setItem("stage2Output", selectedColor);
      } else {
        localStorage.removeItem("stage2Output");
      }
    } catch (err) {
      console.error("LocalStorage error:", err);
    }
  }, [isCorrect, selectedColor]);

  const handleClick = (color: string) => {
    setSelectedColor(color);
    if (color === TARGET_COLOR) {
      setIsCorrect(true);
      setMessage("Debug mode unlocked! You picked the right color.");
    } else {
      setIsCorrect(false);
      setMessage("That shade hides a bug. Pick another color.");
    }
  };

  return (
    <Layout>
      <Stage
        title="Stage 2 - Choose the Debug Color"
        description="One of these glowing buttons represents a successful debug. Click the correct one to move ahead."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mt-10 justify-items-center">
          {["red", "blue", "green", "yellow"].map((color) => {
            const isActive = selectedColor === color;
            return (
              <button
                key={color}
                onClick={() => handleClick(color)}
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 border-4"
                style={{
                  backgroundColor: color,
                  borderColor: isActive ? "#fbbf24" : color,
                  boxShadow: `0 0 35px ${color}, inset 0 0 20px ${color}`,
                }}
                aria-pressed={isActive}
                aria-label={`Select ${color}`}
              />
            );
          })}
        </div>

        {message && (
          <p
            className={`mt-8 text-lg font-semibold ${
              isCorrect ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {isCorrect && (
          <Link
            href="/escape-room/stage3"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg \
                       font-bold shadow-[0_0_25px_rgba(0,255,0,0.6)] transition-transform hover:scale-110 mt-6"
          >
            Next Stage
          </Link>
        )}
      </Stage>
    </Layout>
  );
}
