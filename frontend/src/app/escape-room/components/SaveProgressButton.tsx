"use client";
import { useState } from "react";

type SaveStatus = "idle" | "saving" | "done" | "error";

type StagePayload = {
  stage: string;
  output: string;
};

const STAGE_OUTPUT_KEYS: Array<{ stage: string; storageKey: string }> = [
  { stage: "stage1", storageKey: "stage1Output" },
  { stage: "stage2", storageKey: "stage2Output" },
  { stage: "stage3", storageKey: "stage3Output" },
  { stage: "stage4", storageKey: "stage4Output" },
];

function getApiBase() {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "http://localhost:4000";
}

export default function SaveProgressButton() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState("");

  const buildPayloads = (): StagePayload[] => {
    const items: StagePayload[] = [];

    for (const entry of STAGE_OUTPUT_KEYS) {
      try {
        const value = localStorage.getItem(entry.storageKey);
        if (value) {
          items.push({ stage: entry.stage, output: value });
        }
      } catch (err) {
        console.error("Failed to read stage progress", entry.storageKey, err);
      }
    }

    return items;
  };

  async function handleSaveAll() {
    const payloads = buildPayloads();

    if (!payloads.length) {
      setStatus("idle");
      setMessage("No stage output found yet. Solve a puzzle first.");
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const base = getApiBase();
      const response = await fetch(`${base}/api/stages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloads),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const detail = body && typeof body.error === "string" ? body.error : `HTTP ${response.status}`;
        throw new Error(detail);
      }

      setStatus("done");
      setMessage("Progress saved to the control room.");
    } catch (err) {
      setStatus("error");
      const fallback = err instanceof Error ? err.message : "Unknown error";
      setMessage(`Could not save progress: ${fallback}`);
    }
  }

  const buttonLabel =
    status === "saving" ? "Saving..." : status === "done" ? "Saved" : "Save Progress";

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        type="button"
        onClick={handleSaveAll}
        disabled={status === "saving"}
        className={`px-4 py-2 rounded-md text-white text-sm font-medium transition-colors ${
          status === "saving"
            ? "bg-gray-500"
            : status === "done"
            ? "bg-green-500 hover:bg-green-600"
            : status === "error"
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        aria-busy={status === "saving"}
        aria-live="polite"
      >
        {buttonLabel}
      </button>

      {message && (
        <span
          className={`text-sm ${
            status === "error"
              ? "text-red-400"
              : status === "done"
              ? "text-green-400"
              : "text-gray-300"
          }`}
          role="status"
        >
          {message}
        </span>
      )}
    </div>
  );
}
