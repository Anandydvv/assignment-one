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
  const path = url.pathname; // e.g. /api/stages

  // Copy body only for methods that allow it
  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD", "OPTIONS"].includes(method);
  const body = hasBody ? Buffer.from(await req.arrayBuffer()) : undefined;

  // Prepare headers but strip host-related ones
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");

  let lastErr: unknown = null;
  for (const base of CANDIDATE_BASES) {
    try {
      const target = new URL(path, base).toString();
      const res = await fetch(target, {
        method,
        headers,
        body: body as unknown as BodyInit | null | undefined,
      });

      // Pipe through response from API
      const resBody = await res.arrayBuffer();
      const headersObj = Object.fromEntries(res.headers.entries());
      return new NextResponse(resBody, { status: res.status, headers: headersObj });
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
