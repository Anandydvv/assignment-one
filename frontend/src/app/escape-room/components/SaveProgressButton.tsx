"use client";
import { useState } from "react";

function getApiBase() {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://localhost:4000";
}

export default function SaveProgressButton() {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string>("");

  async function handleSaveAll() {
    try {
      setStatus("saving");
      setMessage("");

      const stage1 = localStorage.getItem("stage1Output");
      const stage2 = localStorage.getItem("stage2Output");
      const stage3 = localStorage.getItem("stage3Output");
      const stage4 = localStorage.getItem("stage4Output");

      const payloads: Array<{ stage: string; output: string }> = [];
      if (stage1) payloads.push({ stage: "stage1", output: stage1 });
      if (stage2) payloads.push({ stage: "stage2", output: stage2 });
      if (stage3) payloads.push({ stage: "stage3", output: stage3 });
      if (stage4) payloads.push({ stage: "stage4", output: stage4 });

      if (payloads.length === 0) {
        setStatus("idle");
        setMessage("No stage outputs found to save.");
        return;
      }

      const base = getApiBase();
      const results = await Promise.all(
        payloads.map((p) =>
          fetch(`${base}/api/stages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
          })
        )
      );

      const allOk = results.every((r) => r.ok);
      if (!allOk) {
        const firstBad = results.find((r) => !r.ok);
        setStatus("error");
        setMessage(
          `Failed saving (HTTP ${firstBad?.status ?? "unknown"}). Try again.`
        );
        return;
      }

      setStatus("done");
      setMessage("All stage outputs saved.");
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Unexpected error while saving.";
      setMessage(msg);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleSaveAll}
        disabled={status === "saving"}
        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white px-3 py-1 rounded text-sm"
        aria-busy={status === "saving"}
        aria-live="polite"
      >
        {status === "saving" ? "Saving..." : "Save Progress"}
      </button>
      {message && (
        <span className="text-sm text-body-secondary" role="status">
          {message}
        </span>
      )}
    </div>
  );
}
