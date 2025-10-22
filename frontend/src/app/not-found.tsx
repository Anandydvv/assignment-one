// frontend/app/not-found.tsx
export default function NotFound() {
  return (
    <html>
      <body
        style={{
          margin: 0,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#111827",
          color: "#e5e7eb",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          404 – Page Not Found
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "500px", lineHeight: "1.5" }}>
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
      </body>
    </html>
  );
}
