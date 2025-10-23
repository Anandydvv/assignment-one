import { NextRequest, NextResponse } from "next/server";
import { getStageModel } from "../../models/stageModel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS_HEADERS = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

// Format a date-like value as a local time string.
// If a specific IANA time zone is provided (e.g. "America/New_York"), use it.
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

// Replace createdAt/updatedAt with localized strings (drop UTC entirely)
function withLocalTimes<T extends Record<string, any>>(obj: T, timeZone?: string) {
  const localized: Record<string, any> = { ...obj };
  localized.createdAt = formatLocalDate(obj.createdAt, timeZone);
  localized.updatedAt = formatLocalDate(obj.updatedAt, timeZone);
  // Ensure we don't keep any previous local fields
  delete localized.createdAtLocal;
  delete localized.updatedAtLocal;
  return localized as T;
}

function extractTimeZone(req: NextRequest) {
  // Prefer explicit hints from client; otherwise leave undefined (server local tz)
  const url = new URL(req.url);
  const qpTz = url.searchParams.get("tz") || url.searchParams.get("timezone");
  const hdrTz =
    req.headers.get("x-timezone") ||
    req.headers.get("time-zone") ||
    req.headers.get("timezone");
  return (qpTz || hdrTz || undefined) as string | undefined;
}

function applyShape(items: Array<Record<string, any>>, req: NextRequest) {
  const url = new URL(req.url);
  const shape =
    url.searchParams.get("shape") ||
    url.searchParams.get("view") ||
    url.searchParams.get("format");
  if (!shape) return items;

  const norm = shape.toLowerCase();
  if (norm === "bystage" || norm === "stages" || norm === "map") {
    const defaultFields = ["id", "output", "createdAt", "updatedAt"];
    const rawFields = url.searchParams.get("fields");
    const fields = rawFields
      ? rawFields
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : defaultFields;

    const stages: Record<string, any> = {};
    for (const item of items) {
      const key = String(item.stage ?? "");
      const shaped: Record<string, any> = {};
      for (const f of fields) {
        if (f === "stage") continue; // key already used
        if (Object.prototype.hasOwnProperty.call(item, f)) {
          shaped[f] = item[f];
        }
      }
      stages[key] = shaped;
    }
    return { stages };
  }
  return items;
}

function jsonWithCors(body: unknown, init?: number | ResponseInit) {
  let status: number | undefined;
  let headers: HeadersInit | undefined;
  if (typeof init === "number") {
    status = init;
  } else if (init) {
    status = (init as ResponseInit).status;
    headers = (init as ResponseInit).headers;
  }
  const merged: ResponseInit = {
    status,
    headers: { ...(headers || {}), ...Object.fromEntries(CORS_HEADERS.entries()) },
  };
  return NextResponse.json(body, merged);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

type SavePayload = { stage: unknown; output: unknown };

export async function POST(req: NextRequest) {
  try {
    const Stage = getStageModel();
    await Stage.sync();
    const timeZone = extractTimeZone(req);
    const json = (await req.json()) as SavePayload | SavePayload[];
    const inputs = Array.isArray(json) ? json : [json];

    if (!inputs.length) {
      return jsonWithCors({ error: "No stage records provided" }, { status: 400 });
    }

    const sanitized = inputs.map((item) => {
      const stage = typeof item.stage === "string" ? item.stage.trim() : "";
      const output = typeof item.output === "string" ? item.output.trim() : "";
      return { stage, output };
    });

    const invalid = sanitized.find((item) => !item.stage || !item.output);
    if (invalid) {
      return jsonWithCors(
        { error: "Each stage record requires non-empty 'stage' and 'output' fields." },
        { status: 422 }
      );
    }

    const results = await Promise.all(
      sanitized.map(async (item) => {
        await Stage.upsert(item);
        const record = await Stage.findOne({ where: { stage: item.stage } });
        if (!record) throw new Error(`Stage not persisted: ${item.stage}`);
        return withLocalTimes(record.toJSON(), timeZone);
      })
    );

    const payload = Array.isArray(json) ? results : results[0];
    return jsonWithCors(payload);
  } catch (error) {
    console.error("Failed to save stage output", error);
    return jsonWithCors({ error: "Unable to save stage output." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const Stage = getStageModel();
    await Stage.sync();
    const timeZone = extractTimeZone(req);
    const stages = await Stage.findAll({ order: [["stage", "ASC"]] });
    const list = stages.map((s) => withLocalTimes(s.toJSON(), timeZone));
    return jsonWithCors(applyShape(list, req));
  } catch (error) {
    console.error("Failed to fetch stages", error);
    return jsonWithCors({ error: "Unable to fetch stages." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const Stage = getStageModel();
    await Stage.sync();
    const timeZone = extractTimeZone(req);
    const { id, output, stage } = (await req.json()) as {
      id?: unknown;
      stage?: unknown;
      output: unknown;
    };

    const newOutput = typeof output === "string" ? output.trim() : "";
    if (!newOutput) {
      return jsonWithCors({ error: "Output is required." }, { status: 422 });
    }

    let record = null;
    if (typeof id === "number" || (typeof id === "string" && (id as string).trim())) {
      record = await Stage.findByPk(Number(id));
    } else if (typeof stage === "string" && stage.trim()) {
      record = await Stage.findOne({ where: { stage: stage.trim() } });
    }

    if (!record) {
      return jsonWithCors({ error: "Stage not found" }, { status: 404 });
    }

    const updated = await (record as any).update({ output: newOutput });
    return jsonWithCors(withLocalTimes(updated.toJSON(), timeZone));
  } catch (error) {
    console.error("Failed to update stage", error);
    return jsonWithCors({ error: "Unable to update stage." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const Stage = getStageModel();
    await Stage.sync();
    const { id, stage } = (await req.json()) as {
      id?: unknown;
      stage?: unknown;
    };

    let record = null;
    if (typeof id === "number" || (typeof id === "string" && (id as string).trim())) {
      record = await Stage.findByPk(Number(id));
    } else if (typeof stage === "string" && stage.trim()) {
      record = await Stage.findOne({ where: { stage: stage.trim() } });
    }

    if (!record) {
      return jsonWithCors({ error: "Stage not found" }, { status: 404 });
    }

    await (record as any).destroy();
    return jsonWithCors({ message: "Stage deleted successfully" });
  } catch (error) {
    console.error("Failed to delete stage", error);
    return jsonWithCors({ error: "Unable to delete stage." }, { status: 500 });
  }
}
