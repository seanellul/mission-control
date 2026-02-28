"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shell } from "@/components/layout/shell";
import { AgentCard } from "@/components/agents/agent-card";
import { AgentStatus } from "@/components/agents/agent-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AgentRun } from "@/types";

interface FileSystemAgent {
  id: string;
  status: string;
  log?: string;
  startedAt?: number;
}

export default function AgentsPage() {
  const agentRuns = useQuery(api.agentRuns.list, { limit: 50 }) as AgentRun[] | undefined;
  const [fsAgents, setFsAgents] = useState<FileSystemAgent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFileSystemAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent-logs");
      if (res.ok) {
        const data = await res.json();
        setFsAgents(data.agents || []);
      }
    } catch (err) {
      console.error("Failed to fetch agent logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileSystemAgents();
    const interval = setInterval(fetchFileSystemAgents, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const runningAgents = agentRuns?.filter((a) => a.status === "running") || [];

  return (
    <Shell title="Agents" description="Monitor running agents and view run history">
      <div className="space-y-6">
        {/* Running Agents Summary */}
        <Card className={runningAgents.length > 0 ? "border-accent" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-5 w-5" />
                Currently Running
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={fetchFileSystemAgents}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {runningAgents.length === 0 && fsAgents.filter((a) => a.status === "running").length === 0 ? (
              <p className="text-sm text-muted-foreground">No agents currently running</p>
            ) : (
              <div className="space-y-2">
                {runningAgents.map((agent) => (
                  <div
                    key={agent._id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5 text-accent" />
                      <span className="font-medium">{agent.agentId}</span>
                    </div>
                    <AgentStatus status="running" />
                  </div>
                ))}
                {fsAgents
                  .filter((a) => a.status === "running")
                  .map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Bot className="h-5 w-5 text-accent" />
                        <span className="font-medium font-mono text-sm">{agent.id}</span>
                      </div>
                      <AgentStatus status="running" />
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agent History */}
        <Tabs defaultValue="database">
          <TabsList>
            <TabsTrigger value="database">Database History</TabsTrigger>
            <TabsTrigger value="filesystem">File System</TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="mt-4">
            {agentRuns === undefined ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : agentRuns.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No agent runs recorded</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {agentRuns.map((agent) => (
                  <AgentCard key={agent._id} agentRun={agent} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="filesystem" className="mt-4">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : fsAgents.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  No agent files found in /tmp
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {fsAgents.map((agent) => (
                  <Card key={agent.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-mono">
                          {agent.id}
                        </CardTitle>
                        <AgentStatus
                          status={
                            agent.status === "running"
                              ? "running"
                              : agent.status === "done"
                              ? "done"
                              : "failed"
                          }
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {agent.log && (
                        <pre className="text-xs text-muted-foreground bg-muted rounded p-2 overflow-auto max-h-32">
                          {agent.log}
                        </pre>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
