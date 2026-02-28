"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { ProjectBadge } from "@/components/projects/project-badge";
import { formatRelativeTime } from "@/lib/utils";
import { Circle, CircleDot, CheckCircle2, Archive } from "lucide-react";
import type { Task, TaskStatus } from "@/types";
import type { Id } from "@/convex/_generated/dataModel";

interface TaskItemProps {
  task: Task;
  showProject?: boolean;
  onClick?: () => void;
}

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  backlog: "todo",
  todo: "in-progress",
  "in-progress": "done",
  done: "backlog",
};

export function TaskItem({ task, showProject = false, onClick }: TaskItemProps) {
  const updateStatus = useMutation(api.tasks.updateStatus);

  const handleStatusChange = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await updateStatus({
      id: task._id as Id<"tasks">,
      status: STATUS_CYCLE[task.status],
    });
  };

  const statusIcon = {
    backlog: Archive,
    todo: Circle,
    "in-progress": CircleDot,
    done: CheckCircle2,
  };
  const StatusIcon = statusIcon[task.status];

  const statusColor = {
    backlog: "text-muted-foreground/70",
    todo: "text-muted-foreground",
    "in-progress": "text-accent",
    done: "text-green-500",
  };

  const priorityVariant: Record<string, "secondary" | "warning" | "destructive" | "info"> = {
    low: "secondary",
    medium: "info",
    high: "warning",
    urgent: "destructive",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-muted-foreground ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <button
        onClick={handleStatusChange}
        className={`flex-shrink-0 ${statusColor[task.status]} hover:opacity-70 transition-opacity`}
      >
        <StatusIcon className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"
            }`}
          >
            {task.title}
          </span>
          <Badge variant={priorityVariant[task.priority] || "secondary"} className="text-xs">
            {task.priority}
          </Badge>
          {task.labels?.map((label) => (
            <Badge key={label} variant="outline" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
            {task.description.split("\n")[0]}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1">
          {showProject && <ProjectBadge slug={task.projectSlug} size="sm" />}
          {task.assignee && (
            <span className="text-xs text-muted-foreground">@{task.assignee}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(task.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
