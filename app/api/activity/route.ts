import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const SECRET = process.env.MC_AGENT_SECRET || "snowflake";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const projectSlug = searchParams.get("project") || undefined;

  const activities = await convex.query(api.activities.list, { projectSlug, limit });
  return NextResponse.json({ activities });
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectSlug, type, actor, message } = body;

  if (!type || !actor || !message) {
    return NextResponse.json({ error: "type, actor, message required" }, { status: 400 });
  }

  await convex.mutation(api.activities.create, { projectSlug, type, actor, message });
  return NextResponse.json({ ok: true });
}
