import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { projectSlug, title, context, options, recommendation, status } = body;

    // Validate required fields
    if (!projectSlug || !title || !context || !options) {
      return NextResponse.json(
        { error: "Missing required fields: projectSlug, title, context, options" },
        { status: 400 }
      );
    }

    // Validate options is an array
    if (!Array.isArray(options) || options.length === 0) {
      return NextResponse.json(
        { error: "Options must be a non-empty array" },
        { status: 400 }
      );
    }

    const id = await convex.mutation(api.decisions.create, {
      projectSlug,
      title,
      context,
      options,
      recommendation,
      status: status || "needs-sean",
    });

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error("Error creating decision:", error);
    return NextResponse.json(
      { error: "Failed to create decision" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const decisions = await convex.query(api.decisions.list, {});
    return NextResponse.json({ decisions });
  } catch (error) {
    console.error("Error fetching decisions:", error);
    return NextResponse.json(
      { error: "Failed to fetch decisions" },
      { status: 500 }
    );
  }
}
