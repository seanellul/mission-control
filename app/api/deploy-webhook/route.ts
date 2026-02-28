import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Vercel sends deployment webhooks to this endpoint.
// On failure, we store it in Convex so the Pi can pick it up and fix it.
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body.type as string;

  // Only care about deployment errors
  if (type !== "deployment.error" && type !== "deployment-error") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const deployment = (body.payload as Record<string, unknown>) || body;
  const projectName = (deployment.name as string) ||
    (deployment.project as Record<string, string>)?.name || "unknown";
  const errorMessage = (deployment.errorMessage as string) ||
    (deployment.buildErrorMessage as string) || "Build failed";
  const deployUrl = (deployment.url as string) || "";

  // Log to Convex activities table (Pi polls this)
  await convex.mutation(api.activities.create, {
    type: "agent",
    actor: "vercel",
    message: `DEPLOY_FAILED::${projectName}::${errorMessage.slice(0, 500)}`,
    projectSlug: projectName.includes("mission-control") ? "openclaw-infra"
      : projectName.includes("ernest") ? "ernest"
      : projectName.includes("wordlink") || projectName.includes("word-solitaire") ? "word-solitaire"
      : undefined,
  });

  console.log(`Deploy failure logged: ${projectName} — ${errorMessage.slice(0, 100)}`);
  return NextResponse.json({ ok: true, logged: true });
}
