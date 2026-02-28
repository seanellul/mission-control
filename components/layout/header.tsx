"use client";

import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSidebar } from "./sidebar-context";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { toggle } = useSidebar();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggle}
          className="shrink-0 rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="hidden text-sm text-muted-foreground sm:block">{description}</p>
          )}
        </div>
      </div>
      <div className="hidden items-center gap-4 sm:flex">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-48 pl-9 lg:w-64"
          />
        </div>
      </div>
    </header>
  );
}
