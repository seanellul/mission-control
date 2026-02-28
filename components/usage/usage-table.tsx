"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MODEL_LABELS, formatCost, formatTokens } from "@/lib/pricing";
import { SourceBadge } from "./usage-stats";
import type { UsageRecord } from "@/types";

export function UsageTable({ records }: { records: UsageRecord[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Runs</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground">No usage records yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Agent</th>
                  <th className="pb-2 pr-4 font-medium">Source</th>
                  <th className="pb-2 pr-4 font-medium">Model</th>
                  <th className="pb-2 pr-4 font-medium text-right">In</th>
                  <th className="pb-2 pr-4 font-medium text-right">Out</th>
                  <th className="pb-2 pr-4 font-medium text-right">Cache %</th>
                  <th className="pb-2 pr-4 font-medium text-right">Cost</th>
                  <th className="pb-2 font-medium text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const totalInput =
                    r.inputTokens + r.cacheReadTokens + r.cacheWriteTokens;
                  const cacheHitPct =
                    totalInput > 0
                      ? Math.round((r.cacheReadTokens / totalInput) * 100)
                      : 0;
                  const durationMs =
                    r.endedAt && r.startedAt ? r.endedAt - r.startedAt : null;

                  return (
                    <tr
                      key={r._id}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-2 pr-4 font-mono text-xs">
                        {r.agentId}
                      </td>
                      <td className="py-2 pr-4">
                        <SourceBadge source={r.source || "claude-code"} />
                      </td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                          {MODEL_LABELS[r.model] || r.model}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right font-mono text-xs">
                        {formatTokens(r.inputTokens)}
                      </td>
                      <td className="py-2 pr-4 text-right font-mono text-xs">
                        {formatTokens(r.outputTokens)}
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <span
                          className={
                            cacheHitPct > 70
                              ? "text-green-500"
                              : cacheHitPct > 30
                                ? "text-amber-500"
                                : "text-muted-foreground"
                          }
                        >
                          {cacheHitPct}%
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right font-mono text-xs font-medium">
                        {formatCost(r.estimatedCost)}
                      </td>
                      <td className="py-2 text-right text-xs text-muted-foreground">
                        {durationMs ? formatDuration(durationMs) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "<1m";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}h ${remainMins}m`;
}
