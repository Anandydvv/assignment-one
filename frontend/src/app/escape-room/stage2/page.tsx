"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import Stage from "../components/Stage";

export default function Stage2() {
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = (correct: boolean) => {
    if (correct) {
      setClicked(true);
      setMessage("✅ Great! You debugged the code successfully!");
    } else {
      setMessage("❌ That’s a bug! Try again.");
    }
  };

  return (
    <Layout>
      <Stage
        title="Stage 2 – Find the Debug Button"
        description="One of these images represents fixing a bug. Click the correct one to proceed!"
      >
        {/* Images grid */}
        <div className="flex flex-wrap justify-center gap-8 mt-6">
          {/* Wrong image */}
          <div
            onClick={() => handleClick(false)}
            className="cursor-pointer transform hover:scale-110 transition-transform duration-200"
          >
            <Image
              src="/bug.png"
              alt="bug"
              width={160}
              height={160}
              className="rounded-lg border-2 border-red-400/30 hover:border-red-400/80 
                         shadow-[0_0_15px_rgba(255,0,0,0.3)]"
            />
          </div>

          {/* Correct image */}
          <div
            onClick={() => handleClick(true)}
            className="cursor-pointer transform hover:scale-110 transition-transform duration-200"
          >
            <Image
              src="/debug.png"
              alt="debug"
              width={160}
              height={160}
              className="rounded-lg border-2 border-green-400/30 hover:border-green-400/80 
                         shadow-[0_0_15px_rgba(0,255,0,0.3)]"
            />
          </div>
        </div>

        {/* Feedback message */}
        {message && (
          <p
            className={`mt-6 font-semibold ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* Next Stage button */}
        {clicked && (
          <Link
            href="/escape-room/stage3"
            className="inline-block bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-lg 
                       font-bold shadow-[0_0_15px_rgba(0,255,0,0.5)] transition-transform hover:scale-105 mt-5"
          >
            Next Stage →
          </Link>
        )}
      </Stage>
    </Layout>
  );
}
