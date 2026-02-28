"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectBadge } from "@/components/projects/project-badge";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { formatRelativeTime } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, MessageSquare, Send, ListPlus } from "lucide-react";
import type { Decision } from "@/types";
import type { Id } from "@/convex/_generated/dataModel";

interface DecisionCardProps {
  decision: Decision;
  showProject?: boolean;
}

export function DecisionCard({ decision, showProject = true }: DecisionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFollowUpPrompt, setShowFollowUpPrompt] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const resolve = useMutation(api.decisions.resolve);
  const defer = useMutation(api.decisions.defer);
  const addComment = useMutation(api.decisions.addComment);

  const isPending = decision.status === "needs-sean" || decision.status === "needs-agent";

  const handleResolve = async () => {
    if (!selectedOption) return;
    setIsSubmitting(true);
    try {
      await resolve({
        id: decision._id as Id<"decisions">,
        resolution: selectedOption,
        comment: comment.trim() || undefined,
      });
      setShowFollowUpPrompt(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDefer = async () => {
    setIsSubmitting(true);
    try {
      await defer({
        id: decision._id as Id<"decisions">,
        comment: comment.trim() || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment({
        id: decision._id as Id<"decisions">,
        comment: comment.trim(),
      });
      setComment("");
      setShowCommentBox(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusConfig = {
    "needs-sean": { label: "Needs Sean", icon: Clock, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    "needs-agent": { label: "Needs Agent", icon: Clock, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
    resolved: { label: "Resolved", icon: CheckCircle, color: "text-green-400 border-green-500/30 bg-green-500/10" },
    deferred: { label: "Deferred", icon: XCircle, color: "text-muted-foreground border-border bg-muted/30" },
  };

  const s = statusConfig[decision.status];
  const StatusIcon = s.icon;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
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
            <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${s.color}`}>
              <StatusIcon className="h-3 w-3" />
              {s.label}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {decision.context}
          </p>

          {isPending && decision.options.length > 0 && (
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
                        : "border-border hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {decision.recommendation === option && (
                        <span className="text-xs text-blue-400 border border-blue-500/30 rounded px-1.5 py-0.5">
                          Recommended
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isPending && (
            <div className="space-y-2">
              {showCommentBox ? (
                <div className="space-y-2">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add context, ask a question, or give direction before approving..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!comment.trim() || isSubmitting}
                      className="flex items-center gap-1.5"
                    >
                      <Send className="h-3 w-3" />
                      Save comment
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setShowCommentBox(false); setComment(""); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCommentBox(true)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {decision.comment ? "Edit comment" : "Add comment or context"}
                </button>
              )}
            </div>
          )}

          {decision.comment && !showCommentBox && (
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Comment</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{decision.comment}</p>
            </div>
          )}

          {isPending && (
            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={handleResolve}
                disabled={!selectedOption || isSubmitting}
                size="sm"
                className="flex-1"
              >
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDefer}
                disabled={isSubmitting}
              >
                Defer
              </Button>
            </div>
          )}

          {showFollowUpPrompt && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
              <p className="text-sm text-foreground mb-2">Create a follow-up task?</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setShowFollowUpPrompt(false);
                    setShowCreateTask(true);
                  }}
                >
                  <ListPlus className="h-3.5 w-3.5 mr-1.5" />
                  Create Task
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFollowUpPrompt(false)}
                >
                  Skip
                </Button>
              </div>
            </div>
          )}

          {decision.status === "resolved" && decision.resolution && !showFollowUpPrompt && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span><span className="font-medium">Resolved:</span> {decision.resolution}</span>
              </div>
              {decision.comment && (
                <p className="mt-1.5 text-xs text-green-400/70 pl-6">{decision.comment}</p>
              )}
            </div>
          )}

          {decision.status === "deferred" && (
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0" />
              <span>Deferred{decision.comment ? `: ${decision.comment}` : ""}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        defaultProjectSlug={decision.projectSlug}
        defaultDecisionId={decision._id}
      />
    </>
  );
}
