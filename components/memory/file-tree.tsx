"use client";

import { FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { MemoryFile } from "@/types";

// Categorize files by their role in the system
const CATEGORIES: { label: string; match: (name: string) => boolean; defaultOpen: boolean }[] = [
  {
    label: "System / Soul",
    match: (n) => ["SOUL.md", "IDENTITY.md", "AGENTS.md", "USER.md", "HEARTBEAT.md", "BOOTSTRAP.md", "TOOLS.md"].includes(n),
    defaultOpen: true,
  },
  {
    label: "Cost & Operations",
    match: (n) => ["COST_ARCHITECTURE.md", "CLAUDE_CODE_STRATEGY.md", "MISSION_CONTROL_SPEC.md"].includes(n),
    defaultOpen: true,
  },
  {
    label: "Memory",
    match: (n) => n === "MEMORY.md" || n === "LEARNINGS.md",
    defaultOpen: true,
  },
  {
    label: "Ernest",
    match: (n) => n.startsWith("ERNEST"),
    defaultOpen: false,
  },
  {
    label: "Daily Logs",
    match: (n) => /^\d{4}-\d{2}-\d{2}/.test(n) || n.startsWith("content-"),
    defaultOpen: false,
  },
];

interface FileTreeProps {
  files: MemoryFile[];
  selectedFile: string | null;
  onSelectFile: (filename: string) => void;
}

export function FileTree({ files, selectedFile, onSelectFile }: FileTreeProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.label, c.defaultOpen]))
  );

  const toggleCategory = (label: string) => {
    setOpenCategories((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Categorize files
  const categorized = CATEGORIES.map((cat) => ({
    ...cat,
    files: files
      .filter((f) => cat.match(f.name))
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));

  // Files that don't fit any category
  const categorizedNames = new Set(categorized.flatMap((c) => c.files.map((f) => f.name)));
  const uncategorized = files
    .filter((f) => !categorizedNames.has(f.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-2">
      {categorized.map(
        (cat) =>
          cat.files.length > 0 && (
            <div key={cat.label}>
              <button
                onClick={() => toggleCategory(cat.label)}
                className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {openCategories[cat.label] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                {cat.label}
                <span className="ml-auto text-[10px] font-normal">{cat.files.length}</span>
              </button>
              {openCategories[cat.label] && (
                <div className="ml-1 space-y-0.5">
                  {cat.files.map((file) => (
                    <FileButton
                      key={file.name}
                      name={file.name}
                      selected={selectedFile === file.name}
                      onClick={() => onSelectFile(file.name)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
      )}

      {uncategorized.length > 0 && (
        <div>
          <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Other
          </div>
          <div className="ml-1 space-y-0.5">
            {uncategorized.map((file) => (
              <FileButton
                key={file.name}
                name={file.name}
                selected={selectedFile === file.name}
                onClick={() => onSelectFile(file.name)}
              />
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">No files found</p>
        </div>
      )}
    </div>
  );
}

function FileButton({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors text-left ${
        selected
          ? "bg-accent/20 text-accent"
          : "text-foreground hover:bg-muted"
      }`}
    >
      <FileText className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="truncate">{name.replace(/\.md$/, "")}</span>
    </button>
  );
}
