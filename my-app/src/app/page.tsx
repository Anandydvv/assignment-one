// src/app/page.tsx
import dynamic from "next/dynamic";
const TabsGenerator = dynamic(() => import("./components/TabsGenerator"), { ssr: false });

export default function Home() {
  return (
    <div style={{padding:16}}>
      <h1>Tabs</h1>
      <TabsGenerator />
    </div>
  );
}
