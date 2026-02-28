import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const SECRET = process.env.MC_AGENT_SECRET || "snowflake";

// GET — list files or get specific file content
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("file");

  if (filename) {
    const file = await convex.query(api.memoryFiles.get, { filename });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    return NextResponse.json({ content: file.content, updatedAt: file.updatedAt });
  }

  const files = await convex.query(api.memoryFiles.list);
  return NextResponse.json({
    files: files.map((f) => ({
      name: f.filename,
      modifiedAt: f.updatedAt,
      isDirectory: false,
    })),
  });
}

// POST — Pi pushes memory file content to Convex
export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, content } = await request.json();
  if (!filename || content === undefined) {
    return NextResponse.json({ error: "filename and content required" }, { status: 400 });
  }

  await convex.mutation(api.memoryFiles.upsert, { filename, content });
  return NextResponse.json({ ok: true });
}
