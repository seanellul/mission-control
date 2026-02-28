"use client";

import { DecisionCard } from "./decision-card";
import type { Decision, DecisionStatus } from "@/types";

interface DecisionListProps {
  decisions: Decision[];
  filter?: DecisionStatus;
  showProject?: boolean;
}

export function DecisionList({ decisions, filter, showProject = true }: DecisionListProps) {
  const filteredDecisions = filter
    ? decisions.filter((d) => d.status === filter)
    : decisions;

  // Sort by createdAt descending (newest first)
  const sortedDecisions = [...filteredDecisions].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  if (sortedDecisions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No decisions found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedDecisions.map((decision) => (
        <DecisionCard
          key={decision._id}
          decision={decision}
          showProject={showProject}
        />
      ))}
    </div>
  );
}
