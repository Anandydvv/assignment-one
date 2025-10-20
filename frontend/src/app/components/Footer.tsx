// src/app/components/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();
  const today = new Date().toLocaleDateString();

  return (
    <footer className="footer" role="contentinfo">
      <p>© {year} Anand Yadav, 21629311 — {today}</p>
    </footer>
  );
}
