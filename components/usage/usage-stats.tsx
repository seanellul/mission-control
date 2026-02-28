"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Cpu, Zap, TrendingDown } from "lucide-react";
import { formatCost, formatTokens } from "@/lib/pricing";
import type { UsageStats } from "@/types";

export function UsageStatsCards({ stats }: { stats: UsageStats }) {
  const avgCostPerRun =
    stats.byModel.reduce((sum, m) => sum + m.apiCalls, 0) > 0
      ? stats.totalCost /
        stats.byModel.reduce((sum, m) => sum + m.apiCalls, 0)
      : 0;

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<DollarSign className="h-5 w-5 text-green-500" />}
        label="Total Cost"
        value={formatCost(stats.totalCost)}
      />
      <StatCard
        icon={<Cpu className="h-5 w-5 text-blue-500" />}
        label="Total Tokens"
        value={formatTokens(stats.totalInputTokens + stats.totalOutputTokens)}
      />
      <StatCard
        icon={<Zap className="h-5 w-5 text-amber-500" />}
        label="API Calls"
        value={stats.totalApiCalls.toLocaleString()}
      />
      <StatCard
        icon={<TrendingDown className="h-5 w-5 text-purple-500" />}
        label="Avg Cost/Run"
        value={formatCost(avgCostPerRun)}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
