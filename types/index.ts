// Project types
export type ProjectStatus = "active" | "paused" | "archived";

export interface Project {
  _id: string;
  slug: string;
  name: string;
  description: string;
  status: ProjectStatus;
  githubUrl?: string;
  color: string;
}

// Task types
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  projectSlug: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  priority: TaskPriority;
  createdAt: number;
}

// Decision types (KEY FEATURE)
export type DecisionStatus = "needs-sean" | "needs-agent" | "resolved" | "deferred";

export interface Decision {
  _id: string;
  projectSlug: string;
  title: string;
  context: string;
  options: string[];
  recommendation?: string;
  status: DecisionStatus;
  createdAt: number;
  resolvedAt?: number;
  resolution?: string;
}

// Agent types
export type AgentStatus = "running" | "done" | "failed";

export interface AgentRun {
  _id: string;
  agentId: string;
  projectSlug?: string;
  status: AgentStatus;
  startedAt: number;
  endedAt?: number;
  summary?: string;
}

// Activity types
export type ActivityType = "commit" | "decision" | "task" | "agent" | "note";

export interface Activity {
  _id: string;
  projectSlug?: string;
  type: ActivityType;
  actor: string;
  message: string;
  createdAt: number;
}

// Cron types (from filesystem)
export interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: {
    kind: string;
    expr: string;
    tz: string;
  };
  payload: {
    kind: string;
    message: string;
    model: string;
  };
  state: {
    nextRunAtMs: number;
    lastRunAtMs?: number;
    lastStatus?: string;
  };
}

// Memory file types
export interface MemoryFile {
  name: string;
  path: string;
  isDirectory: boolean;
  modifiedAt: number;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
