"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/types";
import type { Id } from "@/convex/_generated/dataModel";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectSlug?: string;
  defaultDecisionId?: string;
  defaultParentTaskId?: string;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  defaultProjectSlug,
  defaultDecisionId,
  defaultParentTaskId,
}: CreateTaskDialogProps) {
  const projects = useQuery(api.projects.list) as Project[] | undefined;
  const createTask = useMutation(api.tasks.create);

  const [projectSlug, setProjectSlug] = useState(defaultProjectSlug || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [status, setStatus] = useState<string>("backlog");
  const [assignee, setAssignee] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!projectSlug || !title.trim()) return;
    setIsSubmitting(true);
    try {
      await createTask({
        projectSlug,
        title: title.trim(),
        description: description.trim() || undefined,
        priority: priority as "low" | "medium" | "high" | "urgent",
        status: status as "backlog" | "todo" | "in-progress" | "done",
        assignee: assignee.trim() || undefined,
        decisionId: defaultDecisionId as Id<"decisions"> | undefined,
        parentTaskId: defaultParentTaskId as Id<"tasks"> | undefined,
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("backlog");
      setAssignee("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setProjectSlug(defaultProjectSlug || "");
    }
    onOpenChange(newOpen);
  };

  const activeProjects = projects?.filter((p) => p.status !== "archived") || [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {defaultParentTaskId ? "Add Subtask" : "New Task"}
          </DialogTitle>
          <DialogDescription>
            {defaultParentTaskId
              ? "Create a subtask under the parent task."
              : "Create a new task for a project."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Project</label>
            <Select value={projectSlug} onValueChange={setProjectSlug}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {activeProjects.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              placeholder="Details, acceptance criteria, context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Assignee <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              placeholder="e.g. sean, claude, ernest"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!projectSlug || !title.trim() || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
