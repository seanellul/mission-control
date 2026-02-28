import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("archived")),
    githubUrl: v.optional(v.string()),
    color: v.string(),
  }).index("by_slug", ["slug"]),

  tasks: defineTable({
    projectSlug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("backlog"),
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),
    assignee: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    labels: v.optional(v.array(v.string())),
    parentTaskId: v.optional(v.id("tasks")),
    decisionId: v.optional(v.id("decisions")),
    agentRunId: v.optional(v.id("agentRuns")),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_project", ["projectSlug"])
    .index("by_status", ["status"])
    .index("by_parent", ["parentTaskId"]),

  decisions: defineTable({
    projectSlug: v.string(),
    title: v.string(),
    context: v.string(),
    options: v.array(v.string()),
    recommendation: v.optional(v.string()),
    status: v.union(
      v.literal("needs-sean"),
      v.literal("needs-agent"),
      v.literal("resolved"),
      v.literal("deferred")
    ),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
    resolution: v.optional(v.string()),
    comment: v.optional(v.string()),
  })
    .index("by_project", ["projectSlug"])
    .index("by_status", ["status"]),

  agentRuns: defineTable({
    agentId: v.string(),
    projectSlug: v.optional(v.string()),
    taskId: v.optional(v.id("tasks")),
    model: v.optional(v.string()),
    status: v.union(v.literal("running"), v.literal("done"), v.literal("failed")),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    summary: v.optional(v.string()),
    deliverables: v.optional(v.array(v.object({
      type: v.string(),
      title: v.string(),
      url: v.optional(v.string()),
    }))),
    errorMessage: v.optional(v.string()),
  })
    .index("by_project", ["projectSlug"])
    .index("by_status", ["status"]),

  memoryFiles: defineTable({
    filename: v.string(),
    content: v.string(),
    updatedAt: v.number(),
  }).index("by_filename", ["filename"]),

  activities: defineTable({
    projectSlug: v.optional(v.string()),
    type: v.union(
      v.literal("commit"),
      v.literal("decision"),
      v.literal("task"),
      v.literal("agent"),
      v.literal("note")
    ),
    actor: v.string(),
    message: v.string(),
    createdAt: v.number(),
  })
    .index("by_project", ["projectSlug"])
    .index("by_time", ["createdAt"]),
});
