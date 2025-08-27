'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { href: '/', label: 'Tabs' },
  { href: '/prelab', label: 'Pre-lab Questions' },
  { href: '/escape-room', label: 'Escape Room' },
  { href: '/coding-races', label: 'Coding Races' },
  { href: '/courtroom', label: 'Court Room' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();

  useEffect(() => {
    try { localStorage.setItem('lastRoute', pathname); } catch {}
    document.cookie = `lastTab=${encodeURIComponent(pathname)}; path=/; SameSite=Lax; max-age=${60*60*24*365}`;
  }, [pathname]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom" role="navigation" aria-label="Primary">
      {/* ONE container, column layout so menu sits under the brand */}
      <div className="container-fluid flex-column align-items-stretch">

        {/* Row 1: brand (left) + hamburger (right) */}
        <div className="w-100">
            <Link className="navbar-brand d-block mb-1" href="/" aria-label="Home">
              Anand Yadav — 21629311
            </Link>
            <hr className="w-100 my-1" />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        {/* Row 2: collapsed nav (appears under the brand) */}
        <div className="collapse navbar-collapse w-100 mt-2" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href} className="nav-item">
                  <Link
                    className={`nav-link${active ? ' active' : ''}`}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="d-flex align-items-center gap-2">
            <span className="text-body-secondary d-none d-lg-inline">Dark Mode</span>
            <ThemeToggle compact label="Dark Mode" />
          </div>
        </div>
      </div>
    </nav>
  );
}
