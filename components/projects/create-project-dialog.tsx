"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLOR_PALETTE = [
  "#3b82f6", "#22c55e", "#a855f7", "#ef4444",
  "#f59e0b", "#06b6d4", "#ec4899", "#8b5cf6",
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const createProject = useMutation(api.projects.create);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slug = slugify(name);

  const handleSubmit = async () => {
    if (!name.trim() || !slug) return;
    setIsSubmitting(true);
    try {
      await createProject({
        name: name.trim(),
        slug,
        description: description.trim() || `${name.trim()} project`,
        status: "active",
        color,
      });
      setName("");
      setDescription("");
      setColor(COLOR_PALETTE[0]);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Add a new project to track.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              placeholder="My Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            {slug && (
              <p className="text-xs text-muted-foreground">
                Slug: <code className="bg-muted px-1 rounded">{slug}</code>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              placeholder="Brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="flex gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    color === c
                      ? "ring-2 ring-accent ring-offset-2 ring-offset-card scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
