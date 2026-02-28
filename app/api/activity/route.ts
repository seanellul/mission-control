import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { projectSlug, type, actor, message } = body;

    // Validate required fields
    if (!type || !actor || !message) {
      return NextResponse.json(
        { error: "Missing required fields: type, actor, message" },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ["commit", "decision", "task", "agent", "note"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const id = await convex.mutation(api.activities.create, {
      projectSlug,
      type,
      actor,
      message,
    });

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectSlug = searchParams.get("projectSlug") || undefined;
    const limit = searchParams.get("limit");

    const activities = await convex.query(api.activities.list, {
      projectSlug,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
