"use client";

import { CronJobCard } from "./cron-job-card";
import type { CronJob } from "@/types";

interface CronCalendarProps {
  jobs: CronJob[];
}

export function CronCalendar({ jobs }: CronCalendarProps) {
  // Group jobs by their rough schedule pattern
  const sortedJobs = [...jobs].sort(
    (a, b) => a.state.nextRunAtMs - b.state.nextRunAtMs
  );

  const now = Date.now();
  const upcomingJobs = sortedJobs.filter((j) => j.state.nextRunAtMs > now && j.enabled);
  const disabledJobs = sortedJobs.filter((j) => !j.enabled);

  return (
    <div className="space-y-6">
      {upcomingJobs.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Upcoming ({upcomingJobs.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingJobs.map((job) => (
              <CronJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {disabledJobs.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Disabled ({disabledJobs.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {disabledJobs.map((job) => (
              <CronJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {jobs.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">No cron jobs configured</p>
        </div>
      )}
    </div>
  );
}
