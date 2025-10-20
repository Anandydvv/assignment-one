"use client";
import { useState, useEffect } from "react";
import Stage from "./components/Stage";

export default function EscapeRoom() {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    console.log(`Entered Stage ${stage}`);
  }, [stage]);

  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Escape Room Challenge</h1>
      <Stage stage={stage} onNext={() => setStage(stage + 1)} />
    </main>
  );
}
