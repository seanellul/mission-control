import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseCronExpression } from "@/lib/utils";
import { Clock, Play, Pause } from "lucide-react";
import type { CronJob } from "@/types";

interface CronJobCardProps {
  job: CronJob;
}

export function CronJobCard({ job }: CronJobCardProps) {
  const nextRun = new Date(job.state.nextRunAtMs);
  const lastRun = job.state.lastRunAtMs ? new Date(job.state.lastRunAtMs) : null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                job.enabled ? "bg-accent/20" : "bg-muted"
              }`}
            >
              {job.enabled ? (
                <Play className="h-5 w-5 text-accent" />
              ) : (
                <Pause className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-base font-medium">{job.name}</CardTitle>
              <code className="text-xs text-muted-foreground font-mono">
                {job.schedule.expr}
              </code>
            </div>
          </div>
          <Badge variant={job.enabled ? "success" : "secondary"}>
            {job.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {job.payload.message.split("]")[1]?.trim().slice(0, 100) || job.payload.message.slice(0, 100)}...
        </p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{parseCronExpression(job.schedule.expr)}</span>
          </div>
          <div>
            <span className="font-medium">Next: </span>
            {nextRun.toLocaleString()}
          </div>
          {lastRun && job.state.lastStatus && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Last: </span>
              {lastRun.toLocaleString()} —{" "}
              <Badge
                variant={job.state.lastStatus === "ok" ? "success" : "destructive"}
                className="text-xs"
              >
                {job.state.lastStatus}
              </Badge>
            </div>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-border">
          <code className="text-xs text-muted-foreground">
            Model: {job.payload.model}
          </code>
        </div>
      </CardContent>
    </Card>
  );
}
