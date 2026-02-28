"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shell } from "@/components/layout/shell";
import { DecisionList } from "@/components/decisions/decision-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Decision, DecisionStatus } from "@/types";

export default function DecisionsPage() {
  const decisions = useQuery(api.decisions.list, {}) as Decision[] | undefined;

  const counts = decisions
    ? {
        "needs-sean": decisions.filter((d) => d.status === "needs-sean").length,
        "needs-agent": decisions.filter((d) => d.status === "needs-agent").length,
        resolved: decisions.filter((d) => d.status === "resolved").length,
        deferred: decisions.filter((d) => d.status === "deferred").length,
      }
    : { "needs-sean": 0, "needs-agent": 0, resolved: 0, deferred: 0 };

  return (
    <Shell
      title="Decisions"
      description="Cross-project decision board — approve, defer, or delegate"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Needs Sean"
            count={counts["needs-sean"]}
            icon={AlertCircle}
            color="text-amber-500"
            bgColor="bg-amber-500/10"
          />
          <StatCard
            label="Needs Agent"
            count={counts["needs-agent"]}
            icon={Clock}
            color="text-blue-500"
            bgColor="bg-blue-500/10"
          />
          <StatCard
            label="Resolved"
            count={counts.resolved}
            icon={CheckCircle2}
            color="text-green-500"
            bgColor="bg-green-500/10"
          />
          <StatCard
            label="Deferred"
            count={counts.deferred}
            icon={XCircle}
            color="text-muted-foreground"
            bgColor="bg-muted"
          />
        </div>

        {/* Decisions by Status */}
        <Tabs defaultValue="needs-sean">
          <TabsList>
            <TabsTrigger value="needs-sean">
              Needs Sean {counts["needs-sean"] > 0 && `(${counts["needs-sean"]})`}
            </TabsTrigger>
            <TabsTrigger value="needs-agent">
              Needs Agent {counts["needs-agent"] > 0 && `(${counts["needs-agent"]})`}
            </TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="deferred">Deferred</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          {decisions === undefined ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="needs-sean" className="mt-4">
                <DecisionList decisions={decisions} filter="needs-sean" />
              </TabsContent>
              <TabsContent value="needs-agent" className="mt-4">
                <DecisionList decisions={decisions} filter="needs-agent" />
              </TabsContent>
              <TabsContent value="resolved" className="mt-4">
                <DecisionList decisions={decisions} filter="resolved" />
              </TabsContent>
              <TabsContent value="deferred" className="mt-4">
                <DecisionList decisions={decisions} filter="deferred" />
              </TabsContent>
              <TabsContent value="all" className="mt-4">
                <DecisionList decisions={decisions} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Shell>
  );
}

interface StatCardProps {
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

function StatCard({ label, count, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <div className={`rounded-lg border border-border p-4 ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{count}</p>
        </div>
        <Icon className={`h-8 w-8 ${color} opacity-50`} />
      </div>
    </div>
  );
}
