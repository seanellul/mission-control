import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const SECRET = process.env.MC_AGENT_SECRET || "snowflake";

// GET — return agent runs from Convex
export async function GET() {
  const agents = await convex.query(api.agentRuns.list, { limit: 20 });
  return NextResponse.json({ agents });
}

// POST — Pi pushes agent status updates to Convex
export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { agentId, projectSlug, status, summary, startedAt } = body;

  if (!agentId || !status) {
    return NextResponse.json({ error: "agentId and status required" }, { status: 400 });
  }

  await convex.mutation(api.agentRuns.upsertByAgentId, {
    agentId,
    projectSlug,
    status,
    summary,
    startedAt,
  });

  return NextResponse.json({ ok: true });
}
