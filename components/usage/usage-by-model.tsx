"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MODEL_LABELS, formatCost } from "@/lib/pricing";
import type { UsageStats } from "@/types";

const MODEL_COLORS: Record<string, string> = {
  "claude-haiku-4-5-20251001": "#22c55e",
  "claude-sonnet-4-6": "#3b82f6",
  "claude-opus-4-6": "#a855f7",
};

export function UsageByModel({ stats }: { stats: UsageStats }) {
  const maxCost = Math.max(...stats.byModel.map((m) => m.cost), 0.01);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Cost by Model</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.byModel.length === 0 ? (
          <p className="text-sm text-muted-foreground">No usage data yet</p>
        ) : (
          stats.byModel
            .sort((a, b) => b.cost - a.cost)
            .map((entry) => (
              <div key={entry.model} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {MODEL_LABELS[entry.model] || entry.model}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCost(entry.cost)} ({entry.apiCalls} calls)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(entry.cost / maxCost) * 100}%`,
                      backgroundColor:
                        MODEL_COLORS[entry.model] || "#6b7280",
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
