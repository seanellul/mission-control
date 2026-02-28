"use client";

import { FileText, Folder } from "lucide-react";
import type { MemoryFile } from "@/types";

interface FileTreeProps {
  files: MemoryFile[];
  selectedFile: string | null;
  onSelectFile: (filename: string) => void;
}

export function FileTree({ files, selectedFile, onSelectFile }: FileTreeProps) {
  // Sort: directories first, then by name
  const sortedFiles = [...files].sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) {
      return a.isDirectory ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-1">
      {sortedFiles.map((file) => (
        <button
          key={file.path}
          onClick={() => !file.isDirectory && onSelectFile(file.name)}
          disabled={file.isDirectory}
          className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left ${
            selectedFile === file.name
              ? "bg-accent/20 text-accent"
              : file.isDirectory
              ? "text-muted-foreground cursor-default"
              : "text-foreground hover:bg-muted"
          }`}
        >
          {file.isDirectory ? (
            <Folder className="h-4 w-4 text-muted-foreground" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          <span className="truncate">{file.name}</span>
        </button>
      ))}

      {files.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">No files found</p>
        </div>
      )}
    </div>
  );
}
