// src/app/page.tsx
import TabsGen from "./components/TabsGen";

export default function HomePage() {
  return (
    <section>
      <h1>HTML + JS Generator</h1>
      <p>This page outputs copy-pasteable HTML5 + JS with inline CSS (no classes).</p>
      <TabsGen />
    </section>
  );
}
