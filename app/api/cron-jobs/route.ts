import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CRON_JOBS_PATH = path.join(
  process.env.HOME || "/home/node",
  ".openclaw/cron/jobs.json"
);

export async function GET() {
  try {
    const content = await fs.readFile(CRON_JOBS_PATH, "utf-8");
    const data = JSON.parse(content);
    return NextResponse.json({ jobs: data.jobs || [] });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ jobs: [] });
    }
    console.error("Error reading cron jobs:", error);
    return NextResponse.json(
      { error: "Failed to read cron jobs" },
      { status: 500 }
    );
  }
}
