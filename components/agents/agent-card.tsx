import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectBadge } from "@/components/projects/project-badge";
import { AgentStatus } from "./agent-status";
import { formatRelativeTime, formatTime } from "@/lib/utils";
import { Clock, Bot } from "lucide-react";
import type { AgentRun } from "@/types";

interface AgentCardProps {
  agentRun: AgentRun;
}

export function AgentCard({ agentRun }: AgentCardProps) {
  const duration = agentRun.endedAt
    ? Math.round((agentRun.endedAt - agentRun.startedAt) / 1000)
    : Math.round((Date.now() - agentRun.startedAt) / 1000);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Bot className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">
                {agentRun.agentId}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {agentRun.projectSlug && (
                  <ProjectBadge slug={agentRun.projectSlug} size="sm" />
                )}
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(agentRun.startedAt)}
                </span>
              </div>
            </div>
          </div>
          <AgentStatus status={agentRun.status} />
        </div>
      </CardHeader>
      <CardContent>
        {agentRun.summary && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {agentRun.summary}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(duration)}</span>
          </div>
          {agentRun.endedAt && (
            <span>Ended at {formatTime(agentRun.endedAt)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
