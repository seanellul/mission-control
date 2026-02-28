"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shell } from "@/components/layout/shell";
import { ProjectCard } from "@/components/projects/project-card";
import { DecisionCard } from "@/components/decisions/decision-card";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import type { Project, Decision, Activity } from "@/types";

export default function DashboardPage() {
  const projects = useQuery(api.projects.list) as Project[] | undefined;
  const decisions = useQuery(api.decisions.getPending) as Decision[] | undefined;
  const activities = useQuery(api.activities.getRecent, { limit: 10 }) as Activity[] | undefined;

  const pendingDecisions = decisions?.filter(d => d.status === "needs-sean") || [];

  return (
    <Shell title="Dashboard" description="Overview of all projects and pending decisions">
      <div className="space-y-8">
        {/* Urgent Decisions Banner */}
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

        {/* Projects Grid */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Projects</h2>
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
                return (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    decisionCount={projectDecisions.length}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Activity Feed */}
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
    </Shell>
  );
}
