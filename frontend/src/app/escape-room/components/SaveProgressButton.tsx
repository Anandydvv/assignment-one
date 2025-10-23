"use client";
import { useState } from "react";

// Normalize output before saving: pretty-print JSON and tidy whitespace
function normalizeOutput(raw: string): string {
  if (!raw) return "";
  const text = raw.replace(/\r\n?/g, "\n");
  const trimmed = text.trim();

  // Try to pretty-print JSON if it looks like JSON
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    try {
      const parsed = JSON.parse(trimmed);
      const sortKeysDeep = (val: any): any => {
        if (Array.isArray(val)) return val.map(sortKeysDeep);
        if (val && typeof val === "object") {
          const out: Record<string, any> = {};
          for (const key of Object.keys(val).sort()) {
            out[key] = sortKeysDeep(val[key]);
          }
          return out;
        }
        return val;
      };
      const sorted = sortKeysDeep(parsed);
      return JSON.stringify(sorted, null, 2);
    } catch {
      // fall through to whitespace normalization if not valid JSON
    }
  }

  // Collapse multiple blank lines and trim lines
  const lines = trimmed.split("\n").map((l) => l.replace(/\s+$/g, ""));
  const collapsed: string[] = [];
  let blank = false;
  for (const line of lines) {
    const isBlank = line.trim() === "";
    if (isBlank) {
      if (!blank) collapsed.push("");
      blank = true;
    } else {
      collapsed.push(line);
      blank = false;
    }
  }
  return collapsed.join("\n");
}

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

// Use the frontend’s own proxy route to avoid CORS/host mismatch.
// The proxy lives at frontend/src/app/api/stages/route.ts
function getStagesUrl() {
  return "/api/stages";
}

// Helper to format UTC timestamps in local Melbourne time
function formatLocalTime(utcString: string) {
  return new Date(utcString).toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
  });
}

export default function SaveProgressButton() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null); // ✅ added

  const buildPayloads = (): StagePayload[] => {
    const items: StagePayload[] = [];

    for (const entry of STAGE_OUTPUT_KEYS) {
      try {
        const value = localStorage.getItem(entry.storageKey);
        if (value) {
          items.push({ stage: entry.stage, output: normalizeOutput(value) });
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
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      async function tryPost(url: string) {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloads),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const detail =
            body && typeof body.error === "string"
              ? body.error
              : `HTTP ${res.status}`;
          throw new Error(detail);
        }
      }

      const tried: string[] = [];
      const candidates = [
        getStagesUrl(),
        typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/stages`
          : "",
        typeof window !== "undefined"
          ? `${window.location.protocol}//localhost:4000/api/stages`
          : "",
      ]
        .filter(Boolean)
        .map(
          (base) =>
            `${base}${base.includes("?") ? "&" : "?"}tz=${encodeURIComponent(tz)}`
        ) as string[];

      let lastError: Error | null = null;
      for (const url of candidates) {
        tried.push(url);
        try {
          await tryPost(url);
          setStatus("done");
          setMessage("Progress saved to the control room.");

          // ✅ Save local time of successful save
          const nowUtc = new Date().toISOString();
          setLastSavedAt(formatLocalTime(nowUtc));
          return;
        } catch (e) {
          lastError = e instanceof Error ? e : new Error(String(e));
        }
      }

      throw new Error(
        `${lastError ? lastError.message : "Unknown error"} (tried: ${tried.join(
          ", "
        )})`
      );
    } catch (err) {
      setStatus("error");
      const fallback = err instanceof Error ? err.message : "Unknown error";
      setMessage(`Could not save progress: ${fallback}`);
    }
  }

  const buttonLabel =
    status === "saving"
      ? "Saving..."
      : status === "done"
      ? "Saved"
      : "Save Progress";

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={status === "saving"}
          className={`px-4 py-2 rounded-md text-black text-sm font-medium transition-colors ${
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

      {/* ✅ Display last saved time */}
      {lastSavedAt && (
        <p className="text-xs text-gray-400">
          Last saved at: <span className="font-mono">{lastSavedAt}</span>
        </p>
      )}
    </div>
  );
}
