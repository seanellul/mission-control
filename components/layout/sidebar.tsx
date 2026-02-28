"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  LayoutDashboard,
  GitBranch,
  Bot,
  Clock,
  Brain,
  BarChart3,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import type { Project } from "@/types";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Decisions", href: "/decisions", icon: GitBranch },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Cron", href: "/cron", icon: Clock },
  { name: "Memory", href: "/memory", icon: Brain },
  { name: "Usage", href: "/usage", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [showCreateProject, setShowCreateProject] = useState(false);

  const projects = useQuery(api.projects.list) as Project[] | undefined;
  const activeProjects = projects?.filter((p) => p.status !== "archived") || [];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={close}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2" onClick={close}>
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">MC</span>
            </div>
            <span className="font-semibold text-foreground">Mission Control</span>
          </Link>
          <button
            onClick={close}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-2 py-4">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Projects
            </span>
            <button
              onClick={() => setShowCreateProject(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="New project"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {activeProjects.map((project) => {
              const isActive = pathname === `/projects/${project.slug}`;
              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
      />
    </>
  );
}
