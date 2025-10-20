"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle({ compact=false, label="Dark Mode" }:{
  compact?: boolean; label?: string;
}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : false;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const nextDark = !dark;
    setDark(nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", nextDark ? "dark" : "light");
  }

  return (
    <label className={`wf-switch ${compact ? "is-compact" : ""}`}>
      <input type="checkbox" checked={dark} onChange={toggle} aria-label={label} />
      <span className="wf-slider" aria-hidden="true"></span>
      {!compact && <span className="wf-switchLabel">{label}</span>}
      {compact && <span className="wf-switchLabel-compact">{label}</span>}
    </label>
  );
}
