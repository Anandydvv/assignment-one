import { NextRequest, NextResponse } from "next/server";
import getSequelize from "../../lib/sequelize";
import { getStageModel } from "../../models/stageModel";

// Ensure this route always runs on the Node.js runtime and is not prerendered
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

// CREATE
export async function POST(req: NextRequest) {
  const sequelize = getSequelize();
  const Stage = getStageModel();
  await sequelize.sync();
  const { stage, output } = await req.json();
  const newStage = await Stage.create({ stage, output });
  return jsonWithCors(newStage);
}

// READ all
export async function GET() {
  const sequelize = getSequelize();
  const Stage = getStageModel();
  await sequelize.sync();
  const stages = await Stage.findAll();
  return jsonWithCors(stages);
}

// UPDATE
export async function PUT(req: NextRequest) {
  const sequelize = getSequelize();
  const Stage = getStageModel();
  await sequelize.sync();
  const { id, output } = await req.json();
  const stage = await Stage.findByPk(id);
  if (!stage) return jsonWithCors({ error: "Stage not found" }, { status: 404 });
  await stage.update({ output });
  return jsonWithCors(stage);
}

// DELETE
export async function DELETE(req: NextRequest) {
  const sequelize = getSequelize();
  const Stage = getStageModel();
  await sequelize.sync();
  const { id } = await req.json();
  const stage = await Stage.findByPk(id);
  if (!stage) return jsonWithCors({ error: "Stage not found" }, { status: 404 });
  await stage.destroy();
  return jsonWithCors({ message: "Stage deleted successfully" });
}
