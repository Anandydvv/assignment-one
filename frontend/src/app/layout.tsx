// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import BootstrapClient from './bootstrap-client';
import Header from './components/Header';   // <— this path

import Footer from './components/Footer';


export const metadata = {
  title: 'LTU A1 – HTML Generator',
  description: 'Next.js app that outputs HTML+JS for LMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        {/* Enable Bootstrap components (collapse, dropdown, etc.) */}
        <BootstrapClient />

        <a className="skip-link" href="#main">Skip to content</a>

        {/* Student ID must be top-left on every page → handled inside Header */}
        <Header />

        {/* Keep a Bootstrap container for consistent spacing */}
        <main id="main" role="main" tabIndex={-1} className="container py-4">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
