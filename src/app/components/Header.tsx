// src/app/components/Header.tsx
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

  // remember last visited page
  useEffect(() => {
    try { localStorage.setItem('lastRoute', pathname); } catch {}
    document.cookie = `lastTab=${encodeURIComponent(pathname)}; path=/; SameSite=Lax; max-age=${60*60*24*365}`;
  }, [pathname]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom" role="navigation" aria-label="Primary">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/" aria-label="Home">
          Anand Yadav — 21629311
        </Link>

        <button className="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#mainNavbar"
          aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {NAV.map(item => {
              const active = pathname === item.href;
              return (
                <li key={item.href} className="nav-item">
                  <Link className={`nav-link${active ? ' active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                        href={item.href}>
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
