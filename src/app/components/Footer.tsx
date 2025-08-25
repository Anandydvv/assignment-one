export default function Footer(){
  const today = new Date().toLocaleDateString();
  return (
    <footer style={{borderTop:"1px solid var(--border)", padding:16, textAlign:"center", marginTop:24, color:"var(--muted)"}}>
      Copyright © Your Name — Student No: 12345678 — {today}
    </footer>
  );
}
