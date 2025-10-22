import { NextRequest, NextResponse } from "next/server";
import { getStageModel } from "../../models/stageModel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS_HEADERS = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

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
        return record.toJSON();
      })
    );

    const payload = Array.isArray(json) ? results : results[0];
    return jsonWithCors(payload);
  } catch (error) {
    console.error("Failed to save stage output", error);
    return jsonWithCors({ error: "Unable to save stage output." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const Stage = getStageModel();
    await Stage.sync();
    const stages = await Stage.findAll({ order: [["stage", "ASC"]] });
    return jsonWithCors(stages.map((s) => s.toJSON()));
  } catch (error) {
    console.error("Failed to fetch stages", error);
    return jsonWithCors({ error: "Unable to fetch stages." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const Stage = getStageModel();
    await Stage.sync();
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
    return jsonWithCors(updated.toJSON());
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
