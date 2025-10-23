import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CANDIDATE_BASES: string[] = [
  process.env.API_INTERNAL_URL || "",
  process.env.API_URL || "",
  process.env.NEXT_PUBLIC_API_URL || "",
  // Docker Compose service-to-service URL
  "http://api:4000",
  // Local dev fallback
  "http://localhost:4000",
].filter(Boolean);

async function forward(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname + url.search; // preserve query string (e.g. ?tz=America/New_York)

  // Helpers to localize any ISO timestamps in JSON bodies
  function extractTimeZone() {
    const qpTz = url.searchParams.get("tz") || url.searchParams.get("timezone");
    const hdrTz =
      req.headers.get("x-timezone") ||
      req.headers.get("time-zone") ||
      req.headers.get("timezone");
    return (qpTz || hdrTz || undefined) as string | undefined;
  }

  function formatLocalDate(value: unknown, timeZone?: string) {
    if (!value) return value as undefined;
    const d = new Date(value as any);
    if (isNaN(d.getTime())) return value as unknown as string;
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        ...(timeZone ? { timeZone } : {}),
      }).format(d);
    } catch {
      return d.toLocaleString();
    }
  }

  function isIsoLike(s: string) {
    // quick check for common ISO forms
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s);
  }

  function transformDates(value: any, timeZone?: string): any {
    if (Array.isArray(value)) return value.map((v) => transformDates(v, timeZone));
    if (value && typeof value === "object") {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        if ((k === "createdAt" || k === "updatedAt") && typeof v === "string" && isIsoLike(v)) {
          out[k] = formatLocalDate(v, timeZone);
        } else {
          out[k] = transformDates(v, timeZone);
        }
      }
      return out;
    }
    return value;
  }

  // Copy body only for methods that allow it
  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD", "OPTIONS"].includes(method);
  const body = hasBody ? Buffer.from(await req.arrayBuffer()) : undefined;

  // Prepare headers but strip host-related ones
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");

  let lastErr: unknown = null;
  const tz = extractTimeZone();
  for (const base of CANDIDATE_BASES) {
    try {
      const target = new URL(path, base).toString();
      const res = await fetch(target, {
        method,
        headers,
        body: body as unknown as BodyInit | null | undefined,
      });

      // If JSON, localize timestamps before returning; else pipe through
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        const localized = transformDates(json, tz);
        // merge headers but ensure content-type stays JSON
        const headersObj = Object.fromEntries(res.headers.entries());
        headersObj["content-type"] = "application/json";
        return NextResponse.json(localized, { status: res.status, headers: headersObj });
      } else {
        const resBody = await res.arrayBuffer();
        const headersObj = Object.fromEntries(res.headers.entries());
        return new NextResponse(resBody, { status: res.status, headers: headersObj });
      }
    } catch (err) {
      lastErr = err;
      // try next candidate
    }
  }

  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  return NextResponse.json(
    { error: `Proxy to API failed: ${msg}` },
    { status: 502 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: Request) {
  return forward(req);
}

export async function POST(req: Request) {
  return forward(req);
}

export async function PUT(req: Request) {
  return forward(req);
}

export async function DELETE(req: Request) {
  return forward(req);
}
