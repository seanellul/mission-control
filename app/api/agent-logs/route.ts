import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TMP_DIR = "/tmp";

interface AgentLog {
  id: string;
  status: string;
  log?: string;
  startedAt?: number;
}

export async function GET() {
  try {
    const files = await fs.readdir(TMP_DIR);

    // Find all agent status files
    const statusFiles = files.filter(
      (f) => f.startsWith("agent-") && f.endsWith(".status")
    );

    const agents: AgentLog[] = [];

    for (const statusFile of statusFiles) {
      const id = statusFile.replace("agent-", "").replace(".status", "");
      const statusPath = path.join(TMP_DIR, statusFile);
      const logPath = path.join(TMP_DIR, `agent-${id}.log`);

      try {
        const status = (await fs.readFile(statusPath, "utf-8")).trim();
        const stats = await fs.stat(statusPath);

        let log: string | undefined;
        try {
          const logContent = await fs.readFile(logPath, "utf-8");
          // Get last 500 chars of log
          log = logContent.slice(-500);
        } catch {
          // Log file doesn't exist
        }

        agents.push({
          id,
          status,
          log,
          startedAt: stats.birthtime.getTime(),
        });
      } catch {
        // Skip files we can't read
      }
    }

    // Sort by startedAt descending
    agents.sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));

    return NextResponse.json({ agents });
  } catch (error) {
    console.error("Error reading agent logs:", error);
    return NextResponse.json({ agents: [] });
  }
}
