"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Stage from "../components/Stage";

export default function Stage3() {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [output, setOutput] = useState<number[]>([]);

  useEffect(() => {
    try {
      if (feedback.includes("�o.")) {
        // Save a compact note rather than huge 0..1000 list
        localStorage.setItem("stage3Output", "Generated numbers 0..1000");
      } else {
        localStorage.removeItem("stage3Output");
      }
    } catch {}
  }, [feedback]);

  const handleCheck = () => {
    // Clean user input (remove extra spaces, newlines)
    const cleanInput = input.replace(/\s+/g, " ").trim();

    // Flexible pattern to check for correct for-loop
    const correctPattern =
      /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<=\s*1000\s*;\s*i\+\+\s*\)\s*\{\s*console\.log\(i\)\s*;\s*\}/;

    if (correctPattern.test(cleanInput)) {
      setFeedback("✅ Correct! You generated numbers from 0 to 1000!");
      const nums = Array.from({ length: 1001 }, (_, i) => i);
      setOutput(nums);
    } else {
      setFeedback(
        "❌ Try again — make sure your loop runs from 0 to 1000 (inclusive) and logs each number."
      );
      setOutput([]);
    }
  };

  return (
    <Layout>
      <Stage
        title="Stage 3 – Generate Numbers 0–1000"
        description="Write a JavaScript loop that prints all numbers from 0 to 1000 in the console."
      >
        {/* Code Input Box */}
        <textarea
          className="w-full p-3 rounded-lg text-black border-2 border-yellow-400/40 focus:border-yellow-400 
                     focus:ring-2 focus:ring-yellow-400/40 outline-none transition-all duration-200"
          rows={3}
          placeholder="Write your code here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Check Button */}
        <div className="mt-5 flex flex-col items-start gap-3">
          <button
            onClick={handleCheck}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg 
                       font-semibold shadow-[0_0_10px_rgba(255,255,0,0.5)] transition-transform hover:scale-105"
          >
            Check Answer
          </button>

          {/* Feedback Message */}
          {feedback && (
            <p
              className={`text-sm font-semibold ${
                feedback.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {feedback}
            </p>
          )}

          {/* Output Preview */}
          {output.length > 0 && (
            <div className="mt-4 p-3 bg-gray-900/70 rounded-lg max-h-40 overflow-y-auto text-left text-xs text-yellow-300 border border-yellow-400/30">
              <p className="font-bold mb-1">Output Preview:</p>
              <p>{output.join(", ")}</p>
            </div>
          )}

          {/* Next Stage Button */}
          {feedback.includes("✅") && (
            <Link
              href="/escape-room/stage4"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg 
                         font-bold shadow-[0_0_25px_rgba(0,255,0,0.8)] transition-transform hover:scale-110 mt-6 
                         border border-white/40"
              style={{ textShadow: "0 0 10px white, 0 0 20px white" }}
            >
              Next Stage →
            </Link>
          )}
        </div>
      </Stage>
    </Layout>
  );
}
