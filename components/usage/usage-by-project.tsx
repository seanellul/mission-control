"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCost } from "@/lib/pricing";
import type { UsageStats } from "@/types";

export function UsageByProject({ stats }: { stats: UsageStats }) {
  const maxCost = Math.max(...stats.byProject.map((p) => p.cost), 0.01);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Cost by Project</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.byProject.length === 0 ? (
          <p className="text-sm text-muted-foreground">No usage data yet</p>
        ) : (
          stats.byProject
            .sort((a, b) => b.cost - a.cost)
            .map((entry) => (
              <div key={entry.projectSlug} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">
                    {entry.projectSlug}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCost(entry.cost)} ({entry.apiCalls} calls)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{
                      width: `${(entry.cost / maxCost) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
        )}
      </CardContent>
    </Card>
  );
}
