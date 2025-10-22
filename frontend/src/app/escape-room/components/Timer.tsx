"use client";
import React, { useState, useEffect } from "react";

export default function Timer() {
  const TOTAL_TIME = 90;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const savedStart = localStorage.getItem("timerStart");
    if (savedStart) {
      const elapsed = Math.floor((Date.now() - parseInt(savedStart, 10)) / 1000);
      const remaining = TOTAL_TIME - elapsed;
      setSecondsLeft(remaining > 0 ? remaining : 0);
      if (remaining <= 0) setRunning(false);
    } else {
      localStorage.setItem("timerStart", Date.now().toString());
    }
  }, []);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("timerStart");
          setRunning(false);
          alert("Time's up! You ran out of time.");
          window.location.href = "/escape-room/complete";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="bg-gray-800/90 px-4 py-2 rounded-md flex gap-3 items-center text-white">
      <span className="font-mono text-lg">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
      <button
        className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm"
        onClick={() => setRunning(!running)}
      >
        {running ? "Pause" : "Resume"}
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        onClick={() => {
          localStorage.removeItem("timerStart");
          setSecondsLeft(TOTAL_TIME);
          setRunning(false);
        }}
      >
        Reset
      </button>
    </div>
  );
}
