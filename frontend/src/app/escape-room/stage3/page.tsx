"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Stage from "../components/Stage";

export default function Stage3() {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [output, setOutput] = useState<number[]>([]);

  useEffect(() => {
    try {
      if (isCorrect) {
        localStorage.setItem("stage3Output", "Generated numbers 0-1000");
      } else {
        localStorage.removeItem("stage3Output");
      }
    } catch (err) {
      console.error("LocalStorage error:", err);
    }
  }, [isCorrect]);

  const handleCheck = () => {
    const cleanInput = input.replace(/\s+/g, " ").trim();
    const correctPattern =
      /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<=\s*1000\s*;\s*i\+\+\s*\)\s*\{\s*console\.log\(i\)\s*;\s*\}/;

    if (correctPattern.test(cleanInput)) {
      setIsCorrect(true);
      setFeedback("That loop looks great - you are printing the full range.");
      setOutput(Array.from({ length: 1001 }, (_, i) => i));
    } else {
      setIsCorrect(false);
      setFeedback("Almost there. Make sure the loop logs every number from 0 through 1000.");
      setOutput([]);
    }
  };

  return (
    <Layout>
      <Stage
        title="Stage 3 - Generate Numbers 0-1000"
        description="Write a JavaScript loop that prints every number from 0 to 1000 in the console."
      >
        <textarea
          className="w-full p-3 rounded-lg text-black border-2 border-yellow-400/40 \
                     focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40 outline-none transition-all duration-200"
          rows={3}
          placeholder="Write your code here..."
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

          {output.length > 0 && (
            <div className="mt-4 p-3 bg-gray-900/70 rounded-lg max-h-40 overflow-y-auto text-left text-xs text-yellow-300 border border-yellow-400/30">
              <p className="font-bold mb-1">Output Preview:</p>
              <p>{output.join(", ")}</p>
            </div>
          )}

          {isCorrect && (
            <Link
              href="/escape-room/stage4"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg \
                         font-bold shadow-[0_0_25px_rgba(0,255,0,0.8)] transition-transform hover:scale-110 mt-6 \
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
