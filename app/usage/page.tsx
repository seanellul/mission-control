"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shell } from "@/components/layout/shell";
import { UsageStatsCards } from "@/components/usage/usage-stats";
import { UsageByModel } from "@/components/usage/usage-by-model";
import { UsageByProject } from "@/components/usage/usage-by-project";
import { UsageTable } from "@/components/usage/usage-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageRecord, UsageStats } from "@/types";

export default function UsagePage() {
  const records = useQuery(api.usageRecords.list, { limit: 50 }) as
    | UsageRecord[]
    | undefined;
  const stats = useQuery(api.usageRecords.getStats, {}) as
    | UsageStats
    | undefined;

  return (
    <Shell title="Usage" description="API token usage and cost tracking">
      <div className="space-y-6">
        {stats === undefined ? (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <UsageStatsCards stats={stats} />
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {stats === undefined ? (
            <>
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </>
          ) : (
            <>
              <UsageByModel stats={stats} />
              <UsageByProject stats={stats} />
            </>
          )}
        </div>

        {records === undefined ? (
          <Skeleton className="h-64" />
        ) : (
          <UsageTable records={records} />
        )}
      </div>
    </Shell>
  );
}
