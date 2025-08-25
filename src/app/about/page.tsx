// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <section>
      <h1>About</h1>
      <p><strong>Name:</strong> Anand Yadav</p>
      <p><strong>Student Number:</strong> 21629311</p>

      <h2>How to use this website (video)</h2>
      {/* Replace with your video in /public, or a YouTube embed */}
      <video controls width={640}>
        <source src="/about-demo.mp4" type="video/mp4" />
        Sorry, your browser doesn’t support embedded videos.
      </video>
    </section>
  );
}
