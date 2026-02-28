import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const SECRET = process.env.MC_AGENT_SECRET || "snowflake";

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectSlug, title, priority, assignee, status, description, labels, parentTaskId, decisionId } = body;

    if (!projectSlug || !title) {
      return NextResponse.json(
        { error: "Missing required fields: projectSlug, title" },
        { status: 400 }
      );
    }

    const validPriorities = ["low", "medium", "high", "urgent"];
    const taskPriority = validPriorities.includes(priority) ? priority : "medium";

    const id = await convex.mutation(api.tasks.create, {
      projectSlug,
      title,
      priority: taskPriority,
      assignee,
      status,
      description,
      labels,
      parentTaskId,
      decisionId,
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

export async function PATCH(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, title, description, assignee, priority, labels } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (status !== undefined) updates.status = status;
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (assignee !== undefined) updates.assignee = assignee;
    if (priority !== undefined) updates.priority = priority;
    if (labels !== undefined) updates.labels = labels;

    await convex.mutation(api.tasks.update, { id, ...updates } as any);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
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
