"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Cpu, Zap, CreditCard } from "lucide-react";
import { formatCost, formatTokens } from "@/lib/pricing";
import type { UsageStats } from "@/types";

export function UsageStatsCards({ stats }: { stats: UsageStats }) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<CreditCard className="h-5 w-5 text-red-500" />}
        label="API Cost (billed)"
        value={formatCost(stats.apiCost)}
        tag="api"
      />
      <StatCard
        icon={<DollarSign className="h-5 w-5 text-blue-500" />}
        label="Claude Code (prepaid)"
        value={formatCost(stats.claudeCodeCost)}
        tag="claude-code"
      />
      <StatCard
        icon={<Cpu className="h-5 w-5 text-muted-foreground" />}
        label="Total Tokens"
        value={formatTokens(stats.totalInputTokens + stats.totalOutputTokens)}
      />
      <StatCard
        icon={<Zap className="h-5 w-5 text-amber-500" />}
        label="API Calls"
        value={stats.totalApiCalls.toLocaleString()}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tag,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tag?: "api" | "claude-code";
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
        {tag && (
          <div className="mt-2">
            <SourceBadge source={tag} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SourceBadge({ source }: { source: "api" | "claude-code" }) {
  if (source === "api") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400 uppercase tracking-wider">
        API — Direct Cost
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
      Claude Code — Prepaid
    </span>
  );
}
