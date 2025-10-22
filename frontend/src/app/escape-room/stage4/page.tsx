"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Stage from "../components/Stage";

export default function Stage4() {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    try {
      if (feedback.includes("�o.")) {
        // Persist the produced JSON output
        localStorage.setItem("stage4Output", output || "");
      } else {
        localStorage.removeItem("stage4Output");
      }
    } catch {}
  }, [feedback, output]);

  const handleCheck = () => {
    // Clean input
    const cleanInput = input.replace(/\s+/g, " ").trim();

    // Flexible regex pattern — checks for correct JSON conversion
    const correctPattern =
      /const\s+data\s*=\s*\{\s*name\s*:\s*["'][\w\s]+["']\s*,\s*age\s*:\s*\d+\s*\}\s*;\s*console\.log\s*\(\s*JSON\.stringify\s*\(\s*data\s*\)\s*\)\s*;/i;

    if (correctPattern.test(cleanInput)) {
      setFeedback("✅ Correct! You successfully converted the object to JSON.");
      const data = { name: "Anand", age: 25 };
      setOutput(JSON.stringify(data, null, 2));
    } else {
      setFeedback(
        "❌ Try again — use JSON.stringify() to convert an object into JSON format."
      );
      setOutput("");
    }
  };

  return (
    <Layout>
      <Stage
        title="Stage 4 – Port Data Format"
        description="Write a JavaScript code to convert the following object into JSON format."
      >
        {/* Example object */}
        <pre className="bg-gray-800 text-yellow-200 p-3 rounded-md text-left mb-3">
{`const data = { name: "Anand", age: 25 };`}
        </pre>

        {/* Input box */}
        <textarea
          className="w-full p-3 rounded-lg text-black border-2 border-yellow-400/40 focus:border-yellow-400 
                     focus:ring-2 focus:ring-yellow-400/40 outline-none transition-all duration-200"
          rows={3}
          placeholder='Write your code here... (e.g. console.log(JSON.stringify(data));)'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Button + Feedback */}
        <div className="mt-5 flex flex-col items-start gap-3">
          <button
            onClick={handleCheck}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg 
                       font-semibold shadow-[0_0_10px_rgba(255,255,0,0.5)] transition-transform hover:scale-105"
          >
            Check Answer
          </button>

          {/* Feedback text */}
          {feedback && (
            <p
              className={`text-sm font-semibold ${
                feedback.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {feedback}
            </p>
          )}

          {/* Output preview */}
          {output && (
            <div className="mt-4 p-3 bg-gray-900/70 rounded-lg text-left text-sm text-yellow-300 border border-yellow-400/30">
              <p className="font-bold mb-2">Converted JSON:</p>
              <pre>{output}</pre>
            </div>
          )}

          {/* Final stage button */}
          {feedback.includes("✅") && (
            <Link
              href="/escape-room/complete"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg 
                         font-bold shadow-[0_0_25px_rgba(0,255,0,0.8)] transition-transform hover:scale-110 mt-6 
                         border border-white/40"
              style={{ textShadow: "0 0 10px white, 0 0 20px white" }}
            >
              Finish Game →
            </Link>
          )}
        </div>
      </Stage>
    </Layout>
  );
}
