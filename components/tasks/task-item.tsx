"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { ProjectBadge } from "@/components/projects/project-badge";
import { formatRelativeTime } from "@/lib/utils";
import { Circle, CircleDot, CheckCircle2 } from "lucide-react";
import type { Task } from "@/types";
import type { Id } from "@/convex/_generated/dataModel";

interface TaskItemProps {
  task: Task;
  showProject?: boolean;
}

export function TaskItem({ task, showProject = false }: TaskItemProps) {
  const updateStatus = useMutation(api.tasks.updateStatus);

  const handleStatusChange = async () => {
    const nextStatus = {
      todo: "in-progress" as const,
      "in-progress": "done" as const,
      done: "todo" as const,
    };
    await updateStatus({
      id: task._id as Id<"tasks">,
      status: nextStatus[task.status],
    });
  };

  const statusIcon = {
    todo: Circle,
    "in-progress": CircleDot,
    done: CheckCircle2,
  };
  const StatusIcon = statusIcon[task.status];

  const statusColor = {
    todo: "text-muted-foreground",
    "in-progress": "text-accent",
    done: "text-green-500",
  };

  const priorityVariant = {
    low: "secondary" as const,
    medium: "warning" as const,
    high: "destructive" as const,
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-muted-foreground">
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
          <Badge variant={priorityVariant[task.priority]} className="text-xs">
            {task.priority}
          </Badge>
        </div>
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
