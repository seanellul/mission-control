"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  Bot,
  Clock,
  Brain,
  Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Decisions", href: "/decisions", icon: GitBranch },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Cron", href: "/cron", icon: Clock },
  { name: "Memory", href: "/memory", icon: Brain },
];

const projects = [
  { name: "Ernest", slug: "ernest", color: "#3b82f6" },
  { name: "Word Solitaire", slug: "word-solitaire", color: "#22c55e" },
  { name: "OpenClaw Infra", slug: "openclaw-infra", color: "#a855f7" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-56 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-sm font-bold text-accent-foreground">MC</span>
          </div>
          <span className="font-semibold text-foreground">Mission Control</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
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
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Projects
        </div>
        <div className="mt-2 space-y-1">
          {projects.map((project) => {
            const isActive = pathname === `/projects/${project.slug}`;
            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
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
  );
}
