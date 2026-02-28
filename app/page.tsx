"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shell } from "@/components/layout/shell";
import { ProjectCard } from "@/components/projects/project-card";
import { DecisionCard } from "@/components/decisions/decision-card";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, ListChecks, Loader2, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { formatCost } from "@/lib/pricing";
import type { Project, Decision, Activity, Task, UsageStats } from "@/types";

export default function DashboardPage() {
  const projects = useQuery(api.projects.list) as Project[] | undefined;
  const decisions = useQuery(api.decisions.getPending) as Decision[] | undefined;
  const activities = useQuery(api.activities.getRecent, { limit: 10 }) as Activity[] | undefined;
  const allTasks = useQuery(api.tasks.list, {}) as Task[] | undefined;
  const usageStats = useQuery(api.usageRecords.getStats, {}) as UsageStats | undefined;

  const [showCreateTask, setShowCreateTask] = useState(false);

  const pendingDecisions = decisions?.filter(d => d.status === "needs-sean") || [];

  const taskStats = allTasks
    ? {
        total: allTasks.length,
        inProgress: allTasks.filter((t) => t.status === "in-progress").length,
        doneThisWeek: allTasks.filter((t) => {
          if (!t.completedAt) return false;
          const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          return t.completedAt > weekAgo;
        }).length,
        pending: pendingDecisions.length,
      }
    : null;

  const projectTaskCounts: Record<string, { done: number; total: number }> = {};
  if (allTasks) {
    for (const task of allTasks) {
      if (!projectTaskCounts[task.projectSlug]) {
        projectTaskCounts[task.projectSlug] = { done: 0, total: 0 };
      }
      projectTaskCounts[task.projectSlug].total++;
      if (task.status === "done") {
        projectTaskCounts[task.projectSlug].done++;
      }
    }
  }

  return (
    <Shell title="Dashboard" description="Overview of all projects and pending decisions">
      <div className="space-y-8">
        {taskStats && (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={<ListChecks className="h-5 w-5 text-muted-foreground" />}
              label="Total Tasks"
              value={taskStats.total}
            />
            <StatCard
              icon={<Loader2 className="h-5 w-5 text-accent" />}
              label="In Progress"
              value={taskStats.inProgress}
            />
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
              label="Done This Week"
              value={taskStats.doneThisWeek}
            />
            <StatCard
              icon={<Clock className="h-5 w-5 text-amber-500" />}
              label="Pending Decisions"
              value={taskStats.pending}
            />
            <StatCard
              icon={<DollarSign className="h-5 w-5 text-green-500" />}
              label="Est. Total Cost"
              value={usageStats ? formatCost(usageStats.totalCost) : "—"}
            />
          </div>
        )}

        {pendingDecisions.length > 0 && (
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h2 className="font-semibold text-amber-400">
                {pendingDecisions.length} Decision{pendingDecisions.length > 1 ? "s" : ""} Waiting
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingDecisions.slice(0, 3).map((decision) => (
                <DecisionCard key={decision._id} decision={decision} />
              ))}
            </div>
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Projects</h2>
            <Button size="sm" onClick={() => setShowCreateTask(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              New Task
            </Button>
          </div>
          {projects === undefined ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                No projects yet. Run the seed script to add sample data.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const projectDecisions = decisions?.filter(
                  (d) => d.projectSlug === project.slug
                ) || [];
                const counts = projectTaskCounts[project.slug];
                return (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    decisionCount={projectDecisions.length}
                    taskCount={counts?.total || 0}
                    tasksDone={counts?.done || 0}
                  />
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {activities === undefined ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-4">
              <ActivityFeed activities={activities} limit={10} />
            </div>
          )}
        </section>
      </div>

      <CreateTaskDialog open={showCreateTask} onOpenChange={setShowCreateTask} />
    </Shell>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
