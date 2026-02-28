"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/shell";
import { FileTree } from "@/components/memory/file-tree";
import { FileViewer } from "@/components/memory/file-viewer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { MemoryFile } from "@/types";

export default function MemoryPage() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/memory");
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load memory files");
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (filename: string) => {
    setContentLoading(true);
    try {
      const res = await fetch(`/api/memory?file=${encodeURIComponent(filename)}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch file: ${res.status}`);
      }
      const data = await res.json();
      setFileContent(data.content || "");
    } catch (err) {
      setFileContent(`Error loading file: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetchFileContent(selectedFile);
    } else {
      setFileContent(null);
    }
  }, [selectedFile]);

  return (
    <Shell title="Memory" description="Browse and search agent memory files">
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* File Tree Sidebar */}
        <div className="w-64 flex-shrink-0 overflow-auto rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm">Files</h3>
            <Button variant="ghost" size="icon" onClick={fetchFiles} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <FileTree
              files={files}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
            />
          )}
        </div>

        {/* File Content */}
        <div className="flex-1 overflow-auto">
          {selectedFile === null ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Select a file to view its contents
              </p>
            </div>
          ) : contentLoading ? (
            <Skeleton className="h-full" />
          ) : fileContent !== null ? (
            <FileViewer filename={selectedFile} content={fileContent} />
          ) : null}
        </div>
      </div>
    </Shell>
  );
}
