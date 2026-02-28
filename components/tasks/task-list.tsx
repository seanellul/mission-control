"use client";

import { useState } from "react";
import { TaskItem } from "./task-item";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Task, TaskStatus } from "@/types";

interface TaskListProps {
  tasks: Task[];
  filter?: TaskStatus;
  showProject?: boolean;
  onTaskClick?: (task: Task) => void;
}

interface StatusGroup {
  status: TaskStatus;
  label: string;
  defaultOpen: boolean;
}

const STATUS_GROUPS: StatusGroup[] = [
  { status: "in-progress", label: "In Progress", defaultOpen: true },
  { status: "todo", label: "Todo", defaultOpen: true },
  { status: "backlog", label: "Backlog", defaultOpen: false },
  { status: "done", label: "Done", defaultOpen: false },
];

export function TaskList({ tasks, filter, showProject = false, onTaskClick }: TaskListProps) {
  const filteredTasks = filter ? tasks.filter((t) => t.status === filter) : tasks;

  if (filter) {
    const sorted = [...filteredTasks].sort((a, b) => b.createdAt - a.createdAt);

    if (sorted.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="space-y-2">
        {sorted.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            showProject={showProject}
            onClick={onTaskClick ? () => onTaskClick(task) : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {STATUS_GROUPS.map((group) => {
        const groupTasks = filteredTasks
          .filter((t) => t.status === group.status)
          .sort((a, b) => b.createdAt - a.createdAt);

        return (
          <StatusSection
            key={group.status}
            group={group}
            tasks={groupTasks}
            showProject={showProject}
            onTaskClick={onTaskClick}
          />
        );
      })}

      {filteredTasks.length === 0 && <EmptyState />}
    </div>
  );
}

function StatusSection({
  group,
  tasks,
  showProject,
  onTaskClick,
}: {
  group: StatusGroup;
  tasks: Task[];
  showProject: boolean;
  onTaskClick?: (task: Task) => void;
}) {
  const [isOpen, setIsOpen] = useState(group.defaultOpen);

  if (tasks.length === 0) return null;

  const statusColors: Record<string, string> = {
    "in-progress": "text-accent",
    todo: "text-muted-foreground",
    backlog: "text-muted-foreground/70",
    done: "text-green-500",
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left py-1.5 hover:opacity-80 transition-opacity"
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <span className={`text-sm font-semibold ${statusColors[group.status] || ""}`}>
          {group.label}
        </span>
        <span className="text-xs text-muted-foreground">({tasks.length})</span>
      </button>

      {isOpen && (
        <div className="ml-6 mt-1 space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              showProject={showProject}
              onClick={onTaskClick ? () => onTaskClick(task) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
      <p className="text-sm text-muted-foreground">No tasks found</p>
    </div>
  );
}
