'use client';

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Load saved theme on first mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDark(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function toggleTheme() {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.setAttribute("data-theme", newDark ? "dark" : "light");
    localStorage.setItem("theme", newDark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      style={{
        border: "1px solid var(--border)",
        padding: "6px 10px",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
