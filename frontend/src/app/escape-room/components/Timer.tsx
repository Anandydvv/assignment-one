"use client";
import React, { useState, useEffect } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="bg-gray-800/90 px-4 py-2 rounded-md flex gap-3 items-center">
      <span className="font-mono text-lg">{seconds}s</span>
      <button
        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm"
        onClick={() => setRunning(!running)}
      >
        {running ? "Pause" : "Start"}
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        onClick={() => {
          setRunning(false);
          setSeconds(0);
        }}
      >
        Reset
      </button>
    </div>
  );
}
