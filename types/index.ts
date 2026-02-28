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
export type TaskStatus = "backlog" | "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  _id: string;
  projectSlug: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
  priority: TaskPriority;
  labels?: string[];
  parentTaskId?: string;
  decisionId?: string;
  agentRunId?: string;
  completedAt?: number;
  createdAt: number;
  updatedAt?: number;
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
  comment?: string;
}

// Agent types
export type AgentStatus = "running" | "done" | "failed";

export interface Deliverable {
  type: string;
  title: string;
  url?: string;
}

export interface AgentRun {
  _id: string;
  agentId: string;
  projectSlug?: string;
  taskId?: string;
  model?: string;
  status: AgentStatus;
  startedAt: number;
  endedAt?: number;
  summary?: string;
  deliverables?: Deliverable[];
  errorMessage?: string;
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

// Usage tracking types
export type UsageSource = "api" | "claude-code";

export interface UsageRecord {
  _id: string;
  agentId: string;
  sessionId?: string;
  model: string;
  source?: UsageSource;
  projectSlug?: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  apiCalls: number;
  estimatedCost: number;
  startedAt: number;
  endedAt?: number;
  createdAt: number;
}

export interface UsageStats {
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCacheReadTokens: number;
  totalCacheWriteTokens: number;
  totalApiCalls: number;
  apiCost: number;
  claudeCodeCost: number;
  byModel: { model: string; cost: number; apiCalls: number }[];
  byProject: { projectSlug: string; cost: number; apiCalls: number }[];
}
