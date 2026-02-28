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
    status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
    assignee: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    createdAt: v.number(),
  })
    .index("by_project", ["projectSlug"])
    .index("by_status", ["status"]),

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
  })
    .index("by_project", ["projectSlug"])
    .index("by_status", ["status"]),

  agentRuns: defineTable({
    agentId: v.string(),
    projectSlug: v.optional(v.string()),
    status: v.union(v.literal("running"), v.literal("done"), v.literal("failed")),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    summary: v.optional(v.string()),
  })
    .index("by_project", ["projectSlug"])
    .index("by_status", ["status"]),

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
