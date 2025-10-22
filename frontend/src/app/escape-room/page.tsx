"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "./components/Layout";
import Stage from "./components/Stage";

export default function Stage1() {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    try {
      if (isCorrect) {
        localStorage.setItem("stage1Output", input.trim());
      } else {
        localStorage.removeItem("stage1Output");
      }
    } catch (err) {
      console.error("LocalStorage error:", err);
    }
  }, [isCorrect, input]);

  const handleCheck = () => {
    const cleanInput = input.replace(/\s+/g, " ").trim();
    const correctPattern =
      /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*10\s*;\s*i\+\+\s*\)\s*\{\s*console\.log\(i\)\s*;\s*\}/;

    if (correctPattern.test(cleanInput)) {
      setIsCorrect(true);
      setFeedback("Nice work! That loop is perfect. Head to the next stage when you are ready.");
    } else {
      setIsCorrect(false);
      setFeedback("Not quite yet - make sure the loop runs from 0 to 9 and logs each value.");
    }
  };

  return (
    <Layout>
      <Stage
        title="Stage 1 - Fix the Code"
        description="There is a bug in this loop. Patch it up to keep moving."
      >
        <pre className="bg-gray-700 p-3 rounded-md mb-3 text-left text-yellow-200">
          for (let i = 0; i &lt; 10; i+) {"{"} console.log(i) {"}"}
        </pre>

        <textarea
          className="w-full p-3 rounded-lg text-black border-2 border-yellow-400/40 \
                     focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40 \
                     outline-none transition-all duration-200"
          rows={2}
          placeholder="Enter the corrected code..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="mt-5 flex flex-col items-start gap-3">
          <button
            onClick={handleCheck}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg \
                       font-semibold shadow-[0_0_10px_rgba(255,255,0,0.5)] transition-transform hover:scale-105"
          >
            Check Answer
          </button>

          {feedback && (
            <p className={`text-sm font-semibold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
              {feedback}
            </p>
          )}

          {isCorrect && (
            <Link
              href="/escape-room/stage2"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg \
                         font-bold shadow-[0_0_25px_rgba(0,255,0,0.8)] transition-transform hover:scale-110 mt-4 \
                         border border-white/40"
              style={{ textShadow: "0 0 10px white, 0 0 20px white" }}
            >
              Next Stage
            </Link>
          )}
        </div>
      </Stage>
    </Layout>
  );
}
