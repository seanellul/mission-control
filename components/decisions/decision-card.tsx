"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectBadge } from "@/components/projects/project-badge";
import { formatRelativeTime, getStatusColor } from "@/lib/utils";
import { CheckCircle, Clock, ArrowRight, XCircle } from "lucide-react";
import type { Decision } from "@/types";
import type { Id } from "@/convex/_generated/dataModel";

interface DecisionCardProps {
  decision: Decision;
  showProject?: boolean;
}

export function DecisionCard({ decision, showProject = true }: DecisionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const resolve = useMutation(api.decisions.resolve);
  const defer = useMutation(api.decisions.defer);

  const handleResolve = async () => {
    if (!selectedOption) return;
    setIsResolving(true);
    try {
      await resolve({
        id: decision._id as Id<"decisions">,
        resolution: selectedOption,
      });
    } finally {
      setIsResolving(false);
    }
  };

  const handleDefer = async () => {
    setIsResolving(true);
    try {
      await defer({ id: decision._id as Id<"decisions"> });
    } finally {
      setIsResolving(false);
    }
  };

  const statusBadge = {
    "needs-sean": { variant: "warning" as const, label: "Needs Sean", icon: Clock },
    "needs-agent": { variant: "info" as const, label: "Needs Agent", icon: Clock },
    resolved: { variant: "success" as const, label: "Resolved", icon: CheckCircle },
    deferred: { variant: "secondary" as const, label: "Deferred", icon: XCircle },
  };

  const status = statusBadge[decision.status];
  const StatusIcon = status.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold leading-tight">
              {decision.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              {showProject && <ProjectBadge slug={decision.projectSlug} size="sm" />}
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(decision.createdAt)}
              </span>
            </div>
          </div>
          <Badge variant={status.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {decision.context}
        </p>

        {decision.status !== "resolved" && decision.status !== "deferred" && (
          <>
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Options
              </div>
              <div className="space-y-2">
                {decision.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                      selectedOption === option
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {decision.recommendation === option && (
                        <Badge variant="info" className="text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={handleResolve}
                disabled={!selectedOption || isResolving}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={handleDefer}
                disabled={isResolving}
              >
                Defer
              </Button>
            </div>
          </>
        )}

        {decision.status === "resolved" && decision.resolution && (
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Resolved:</span>
              <span>{decision.resolution}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
