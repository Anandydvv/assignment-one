// src/app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "LTU A1 – HTML Generator",
  description: "Next.js app that outputs HTML+JS for LMS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main" role="main" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
