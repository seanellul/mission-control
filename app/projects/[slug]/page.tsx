"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shell } from "@/components/layout/shell";
import { DecisionList } from "@/components/decisions/decision-list";
import { TaskList } from "@/components/tasks/task-list";
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Plus } from "lucide-react";
import type { Project, Decision, Task, Activity } from "@/types";

interface ProjectPageProps {
  params: { slug: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params;

  const project = useQuery(api.projects.getBySlug, { slug }) as Project | null | undefined;
  const decisions = useQuery(api.decisions.list, { projectSlug: slug }) as Decision[] | undefined;
  const tasks = useQuery(api.tasks.list, { projectSlug: slug }) as Task[] | undefined;
  const activities = useQuery(api.activities.list, { projectSlug: slug, limit: 20 }) as Activity[] | undefined;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  if (project === undefined) {
    return (
      <Shell title="Loading...">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32" />
        </div>
      </Shell>
    );
  }

  if (project === null) {
    return (
      <Shell title="Project Not Found">
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Project &quot;{slug}&quot; not found</p>
        </div>
      </Shell>
    );
  }

  const pendingDecisions = decisions?.filter(
    (d) => d.status === "needs-sean" || d.status === "needs-agent"
  ) || [];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  return (
    <Shell title={project.name} description={project.description}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-lg flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: project.color + "20", color: project.color }}
            >
              {project.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{project.name}</h1>
                <Badge variant={project.status === "active" ? "success" : "secondary"}>
                  {project.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          </div>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>

        <Tabs defaultValue="tasks">
          <TabsList>
            <TabsTrigger value="tasks">
              Tasks {tasks && `(${tasks.length})`}
            </TabsTrigger>
            <TabsTrigger value="decisions">
              Decisions {pendingDecisions.length > 0 && `(${pendingDecisions.length})`}
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-4">
            <div className="mb-4">
              <Button size="sm" onClick={() => setShowCreateTask(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                New Task
              </Button>
            </div>
            {tasks === undefined ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                showProject={false}
                onTaskClick={handleTaskClick}
              />
            )}
          </TabsContent>

          <TabsContent value="decisions" className="mt-4">
            {decisions === undefined ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <DecisionList decisions={decisions} showProject={false} />
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            {activities === undefined ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-4">
                <ActivityFeed activities={activities} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TaskDetailDialog
        task={selectedTask}
        open={showTaskDetail}
        onOpenChange={setShowTaskDetail}
      />

      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        defaultProjectSlug={slug}
      />
    </Shell>
  );
}
