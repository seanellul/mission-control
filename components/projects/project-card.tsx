import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, GitBranch } from "lucide-react";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  decisionCount?: number;
  taskCount?: number;
}

export function ProjectCard({ project, decisionCount = 0, taskCount = 0 }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="group cursor-pointer transition-colors hover:border-muted-foreground">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: project.color + "20", color: project.color }}
              >
                {project.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {project.name}
                </h3>
                <Badge
                  variant={project.status === "active" ? "success" : "secondary"}
                  className="text-xs"
                >
                  {project.status}
                </Badge>
              </div>
            </div>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {decisionCount > 0 && (
              <div className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                <span>{decisionCount} decisions</span>
              </div>
            )}
            {taskCount > 0 && (
              <div className="flex items-center gap-1">
                <span>{taskCount} tasks</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
