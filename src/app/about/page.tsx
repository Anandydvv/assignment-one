// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <section>
      <h1>About</h1>
      <p><strong>Name:</strong> Anand Yadav</p>
      <p><strong>Student Number:</strong> 21629311</p>

      <h2>How to use this website (video)</h2>
      {/* Embedded YouTube video */}
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src="https://www.youtube.com/embed/gxK_C0x4pKw"
          title="How to use this website"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </section>
  );
}

