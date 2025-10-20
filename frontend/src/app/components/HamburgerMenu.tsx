"use client";
import { useState } from "react";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="wf-burgerWrap">
      <button
        className="wf-burger"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`wf-menu ${open ? "is-open" : ""}`}>
        <button className="wf-menuItem">Settings</button>
        <button className="wf-menuItem">Contact</button>
      </div>
    </div>
  );
}
