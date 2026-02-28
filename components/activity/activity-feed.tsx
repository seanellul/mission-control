import { ProjectBadge } from "@/components/projects/project-badge";
import { formatRelativeTime } from "@/lib/utils";
import { GitCommit, GitBranch, CheckSquare, Bot, FileText } from "lucide-react";
import type { Activity } from "@/types";

interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
}

export function ActivityFeed({ activities, limit }: ActivityFeedProps) {
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  const typeIcon = {
    commit: GitCommit,
    decision: GitBranch,
    task: CheckSquare,
    agent: Bot,
    note: FileText,
  };

  const typeColor = {
    commit: "text-green-500",
    decision: "text-amber-500",
    task: "text-blue-500",
    agent: "text-purple-500",
    note: "text-muted-foreground",
  };

  if (displayActivities.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {displayActivities.map((activity, index) => {
        const Icon = typeIcon[activity.type];
        const iconColor = typeColor[activity.type];
        const isLast = index === displayActivities.length - 1;

        return (
          <div key={activity._id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full bg-muted flex items-center justify-center ${iconColor}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border my-1" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">
                  {activity.actor}
                </span>
                {activity.projectSlug && (
                  <ProjectBadge slug={activity.projectSlug} size="sm" />
                )}
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(activity.createdAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {activity.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
