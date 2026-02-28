"use client";

import { TaskItem } from "./task-item";
import type { Task, TaskStatus } from "@/types";

interface TaskListProps {
  tasks: Task[];
  filter?: TaskStatus;
  showProject?: boolean;
}

export function TaskList({ tasks, filter, showProject = false }: TaskListProps) {
  const filteredTasks = filter ? tasks.filter((t) => t.status === filter) : tasks;

  // Sort: in-progress first, then todo, then done. Within each group, by createdAt desc
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const statusOrder = { "in-progress": 0, todo: 1, done: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return b.createdAt - a.createdAt;
  });

  if (sortedTasks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => (
        <TaskItem key={task._id} task={task} showProject={showProject} />
      ))}
    </div>
  );
}
