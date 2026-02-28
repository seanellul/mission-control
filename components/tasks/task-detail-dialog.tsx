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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
import { ProjectBadge } from "@/components/projects/project-badge";
import { formatRelativeTime } from "@/lib/utils";
import { CreateTaskDialog } from "./create-task-dialog";
import {
  Circle,
  CircleDot,
  CheckCircle2,
  Archive,
  Pencil,
  Plus,
  GitBranch,
  Bot,
  Trash2,
} from "lucide-react";
import type { Task } from "@/types";
import type { Id } from "@/convex/_generated/dataModel";

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);
  const subtasks = useQuery(
    api.tasks.getSubtasks,
    task ? { parentTaskId: task._id as Id<"tasks"> } : "skip"
  );

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [descDraft, setDescDraft] = useState("");
  const [showCreateSubtask, setShowCreateSubtask] = useState(false);

  if (!task) return null;

  const handleSaveTitle = async () => {
    if (titleDraft.trim() && titleDraft !== task.title) {
      await updateTask({ id: task._id as Id<"tasks">, title: titleDraft.trim() });
    }
    setEditingTitle(false);
  };

  const handleSaveDescription = async () => {
    if (descDraft !== (task.description || "")) {
      await updateTask({
        id: task._id as Id<"tasks">,
        description: descDraft.trim() || undefined,
      });
    }
    setEditingDescription(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateTask({
      id: task._id as Id<"tasks">,
      status: newStatus as Task["status"],
    });
  };

  const handlePriorityChange = async (newPriority: string) => {
    await updateTask({
      id: task._id as Id<"tasks">,
      priority: newPriority as Task["priority"],
    });
  };

  const handleDelete = async () => {
    await removeTask({ id: task._id as Id<"tasks"> });
    onOpenChange(false);
  };

  const statusIcon = {
    backlog: Archive,
    todo: Circle,
    "in-progress": CircleDot,
    done: CheckCircle2,
  };
  const StatusIcon = statusIcon[task.status];

  const priorityVariant: Record<string, "secondary" | "warning" | "destructive" | "info"> = {
    low: "secondary",
    medium: "info",
    high: "warning",
    urgent: "destructive",
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <ProjectBadge slug={task.projectSlug} size="sm" />
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(task.createdAt)}
              </span>
              {task.updatedAt && (
                <span className="text-xs text-muted-foreground">
                  (edited {formatRelativeTime(task.updatedAt)})
                </span>
              )}
            </div>

            {editingTitle ? (
              <Input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") setEditingTitle(false);
                }}
                className="text-lg font-semibold"
              />
            ) : (
              <DialogTitle
                className="cursor-pointer hover:text-accent transition-colors flex items-center gap-2"
                onClick={() => {
                  setTitleDraft(task.title);
                  setEditingTitle(true);
                }}
              >
                {task.title}
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </DialogTitle>
            )}
            <DialogDescription className="sr-only">Task details for {task.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </label>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-9">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Priority
                </label>
                <Select value={task.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="h-9">
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
            </div>

            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.labels.map((label) => (
                  <Badge key={label} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            {task.assignee && (
              <div className="text-sm text-muted-foreground">
                Assigned to <span className="text-foreground font-medium">@{task.assignee}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </label>
              {editingDescription ? (
                <div className="space-y-2">
                  <Textarea
                    autoFocus
                    value={descDraft}
                    onChange={(e) => setDescDraft(e.target.value)}
                    rows={4}
                    placeholder="Add a description..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveDescription}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingDescription(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="min-h-[40px] rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground cursor-pointer hover:border-muted-foreground transition-colors"
                  onClick={() => {
                    setDescDraft(task.description || "");
                    setEditingDescription(true);
                  }}
                >
                  {task.description || "Click to add a description..."}
                </div>
              )}
            </div>

            {task.decisionId && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Linked decision</span>
                <Badge variant="info" className="text-xs">
                  {task.decisionId}
                </Badge>
              </div>
            )}

            {task.agentRunId && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Linked agent run</span>
                <Badge variant="info" className="text-xs">
                  {task.agentRunId}
                </Badge>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subtasks
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowCreateSubtask(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Subtask
                </Button>
              </div>
              {subtasks && subtasks.length > 0 ? (
                <div className="space-y-1">
                  {(subtasks as Task[]).map((sub) => {
                    const SubIcon = statusIcon[sub.status];
                    return (
                      <div
                        key={sub._id}
                        className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                      >
                        <SubIcon className="h-4 w-4 text-muted-foreground" />
                        <span
                          className={
                            sub.status === "done"
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }
                        >
                          {sub.title}
                        </span>
                        <Badge
                          variant={priorityVariant[sub.priority] || "secondary"}
                          className="text-xs ml-auto"
                        >
                          {sub.priority}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No subtasks</p>
              )}
            </div>

            {task.completedAt && (
              <div className="text-xs text-muted-foreground">
                Completed {formatRelativeTime(task.completedAt)}
              </div>
            )}

            <div className="pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateTaskDialog
        open={showCreateSubtask}
        onOpenChange={setShowCreateSubtask}
        defaultProjectSlug={task.projectSlug}
        defaultParentTaskId={task._id}
      />
    </>
  );
}
