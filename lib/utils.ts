import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function getProjectColor(slug: string): string {
  const colors: Record<string, string> = {
    ernest: "#3b82f6",
    "word-solitaire": "#22c55e",
    "openclaw-infra": "#a855f7",
  };
  return colors[slug] || "#6b7280";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Decision statuses
    "needs-sean": "#f59e0b",
    "needs-agent": "#3b82f6",
    resolved: "#22c55e",
    deferred: "#6b7280",
    // Task statuses
    backlog: "#94a3b8",
    todo: "#6b7280",
    "in-progress": "#3b82f6",
    done: "#22c55e",
    // Agent statuses
    running: "#3b82f6",
    failed: "#ef4444",
  };
  return colors[status] || "#6b7280";
}

export function parseCronExpression(expr: string): string {
  const parts = expr.split(" ");
  if (parts.length !== 5) return expr;

  const [minute, hour, , , ] = parts;

  if (minute === "0" && hour !== "*") {
    return `Daily at ${hour}:00 UTC`;
  }
  if (minute.startsWith("*/")) {
    const interval = minute.slice(2);
    if (hour.includes("-")) {
      return `Every ${interval}min (${hour} UTC)`;
    }
    return `Every ${interval}min`;
  }
  return expr;
}
