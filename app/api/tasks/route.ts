import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { projectSlug, title, priority, assignee, status } = body;

    // Validate required fields
    if (!projectSlug || !title || !priority) {
      return NextResponse.json(
        { error: "Missing required fields: projectSlug, title, priority" },
        { status: 400 }
      );
    }

    // Validate priority
    if (!["low", "medium", "high"].includes(priority)) {
      return NextResponse.json(
        { error: "Priority must be: low, medium, or high" },
        { status: 400 }
      );
    }

    const id = await convex.mutation(api.tasks.create, {
      projectSlug,
      title,
      priority,
      assignee,
      status,
    });

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectSlug = searchParams.get("projectSlug") || undefined;

    const tasks = await convex.query(api.tasks.list, { projectSlug });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
