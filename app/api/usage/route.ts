import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const SECRET = process.env.MC_AGENT_SECRET || "snowflake";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const projectSlug = searchParams.get("project") || undefined;
  const model = searchParams.get("model") || undefined;

  const [records, stats] = await Promise.all([
    convex.query(api.usageRecords.list, { projectSlug, model, limit }),
    convex.query(api.usageRecords.getStats, {}),
  ]);

  return NextResponse.json({ records, stats });
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    agentId, sessionId, model, source, projectSlug,
    inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens,
    apiCalls, estimatedCost, startedAt, endedAt,
  } = body;

  if (!agentId || !model || inputTokens === undefined) {
    return NextResponse.json(
      { error: "agentId, model, and inputTokens required" },
      { status: 400 }
    );
  }

  const validSource = source === "api" || source === "claude-code" ? source : "claude-code";

  const id = await convex.mutation(api.usageRecords.create, {
    agentId,
    sessionId,
    model,
    source: validSource,
    projectSlug,
    inputTokens: inputTokens || 0,
    outputTokens: outputTokens || 0,
    cacheReadTokens: cacheReadTokens || 0,
    cacheWriteTokens: cacheWriteTokens || 0,
    apiCalls: apiCalls || 0,
    estimatedCost: estimatedCost || 0,
    startedAt: startedAt || Date.now(),
    endedAt,
  });

  return NextResponse.json({ ok: true, id });
}
