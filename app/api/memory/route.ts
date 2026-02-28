import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const MEMORY_DIR = path.join(
  process.env.HOME || "/home/node",
  ".openclaw/workspace/memory"
);

interface MemoryFile {
  name: string;
  path: string;
  isDirectory: boolean;
  modifiedAt: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("file");

  // If a specific file is requested, return its content
  if (filename) {
    try {
      const filePath = path.join(MEMORY_DIR, filename);

      // Prevent directory traversal
      if (!filePath.startsWith(MEMORY_DIR)) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
      }

      const content = await fs.readFile(filePath, "utf-8");
      return NextResponse.json({ content });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      console.error("Error reading memory file:", error);
      return NextResponse.json(
        { error: "Failed to read file" },
        { status: 500 }
      );
    }
  }

  // Otherwise, return the directory listing
  try {
    const entries = await fs.readdir(MEMORY_DIR, { withFileTypes: true });

    const files: MemoryFile[] = await Promise.all(
      entries.map(async (entry) => {
        const filePath = path.join(MEMORY_DIR, entry.name);
        const stats = await fs.stat(filePath);
        return {
          name: entry.name,
          path: filePath,
          isDirectory: entry.isDirectory(),
          modifiedAt: stats.mtime.getTime(),
        };
      })
    );

    // Sort by modified time descending
    files.sort((a, b) => b.modifiedAt - a.modifiedAt);

    return NextResponse.json({ files });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ files: [] });
    }
    console.error("Error reading memory directory:", error);
    return NextResponse.json(
      { error: "Failed to read memory directory" },
      { status: 500 }
    );
  }
}
