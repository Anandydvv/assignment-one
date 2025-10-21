"use client";
import Link from "next/link";
import Layout from "../components/Layout";

export default function Complete() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        {/* Title */}
        <h1
          className="text-5xl sm:text-6xl font-extrabold text-green-400 mb-6 animate-pulse"
          style={{
            textShadow: "0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88",
          }}
        >
          🎉 Congratulations!
          <br />
          You Escaped the Room!
        </h1>

        {/* Message */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-xl mb-10">
          You completed all stages — from fixing bugs to generating numbers and
          converting data! <br />
          Your logic and persistence got you out. 🧠💻
        </p>

        {/* Restart Button */}
        <Link
          href="/escape-room"
          className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-lg 
                     font-bold shadow-[0_0_25px_rgba(255,255,0,0.7)] transition-transform hover:scale-110"
          style={{ textShadow: "0 0 10px white, 0 0 20px white" }}
        >
          🔁 Play Again
        </Link>

     
      </div>
    </Layout>
  );
}
