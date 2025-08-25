"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Tabs" },
  { href: "/prelab", label: "Pre-lab Questions" },
  { href: "/escape-room", label: "Escape Room" },
  { href: "/coding-races", label: "Coding Races" },
  { href: "/courtroom", label: "Court Room" },
];

function setCookie(name: string, value: string, days = 365) {
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setCookie("lastTab", pathname), [pathname]);

  // Close on outside click or ESC
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuOpen) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="wf-header" role="banner">
      {/* Row 1: centered title, student on right */}
      <div className="wf-toprow">
        <div />
        <h1 className="wf-title">Title</h1>
        <div className="wf-student">Anand Yadav — 21629311</div>
      </div>

      {/* Row 2: nav + About + burger + dark mode */}
      <div className="wf-navrow">
        <nav className="wf-nav" aria-label="Primary">
          {NAV.map((item, i) => (
            <span key={item.href} className="wf-navItem">
              <Link href={item.href} className={pathname === item.href ? "is-active" : ""}>
                {item.label}
              </Link>
              {i < NAV.length - 1 && <span aria-hidden="true" className="wf-sep">|</span>}
            </span>
          ))}
        </nav>

        <div className="wf-rightControls">
          <Link href="/about" className={`wf-about ${pathname === "/about" ? "is-active" : ""}`}>
            About
          </Link>

          {/* Burger + dropdown */}
          <div className="wf-burgerWrap" ref={menuRef}>
            <button
              ref={btnRef}
              className="wf-burger"
              aria-label="Menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="wf-hamburger-menu"
              onClick={() => setMenuOpen(v => !v)}
            >
              <span />
              <span />
              <span />
            </button>

            <div
              id="wf-hamburger-menu"
              role="menu"
              className={`wf-menu ${menuOpen ? "is-open" : ""}`}
            >
              <button role="menuitem" className="wf-menuItem" tabIndex={menuOpen ? 0 : -1}>
                Settings
              </button>
              <button role="menuitem" className="wf-menuItem" tabIndex={menuOpen ? 0 : -1}>
                Contacts
              </button>
              <button role="menuitem" className="wf-menuItem" tabIndex={menuOpen ? 0 : -1}>
                Help
              </button>
            </div>
          </div>

          <div className="wf-darkToggle">
            <ThemeToggle compact label="Dark Mode" />
          </div>
        </div>
      </div>
    </header>
  );
}
