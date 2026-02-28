import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { projectSlug: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const results = args.projectSlug
      ? await ctx.db
          .query("agentRuns")
          .withIndex("by_project", (qb) => qb.eq("projectSlug", args.projectSlug!))
          .collect()
      : await ctx.db.query("agentRuns").collect();

    results.sort((a, b) => b.startedAt - a.startedAt);

    if (args.limit) {
      return results.slice(0, args.limit);
    }
    return results;
  },
});

export const getRunning = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("agentRuns")
      .withIndex("by_status", (q) => q.eq("status", "running"))
      .collect();
  },
});

export const create = mutation({
  args: {
    agentId: v.string(),
    projectSlug: v.optional(v.string()),
    taskId: v.optional(v.id("tasks")),
    model: v.optional(v.string()),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentRuns", {
      ...args,
      status: "running",
      startedAt: Date.now(),
    });
  },
});

export const complete = mutation({
  args: {
    id: v.id("agentRuns"),
    status: v.union(v.literal("done"), v.literal("failed")),
    summary: v.optional(v.string()),
    deliverables: v.optional(v.array(v.object({
      type: v.string(),
      title: v.string(),
      url: v.optional(v.string()),
    }))),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      endedAt: Date.now(),
    });
  },
});

export const upsertByAgentId = mutation({
  args: {
    agentId: v.string(),
    projectSlug: v.optional(v.string()),
    taskId: v.optional(v.string()),
    model: v.optional(v.string()),
    status: v.union(v.literal("running"), v.literal("done"), v.literal("failed")),
    summary: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    deliverables: v.optional(v.array(v.object({
      type: v.string(),
      title: v.string(),
      url: v.optional(v.string()),
    }))),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agentRuns")
      .filter((q) => q.eq(q.field("agentId"), args.agentId))
      .first();

    const now = Date.now();
    if (existing) {
      const updates: Record<string, unknown> = {
        status: args.status,
      };
      if (args.summary !== undefined) updates.summary = args.summary;
      if (args.model !== undefined) updates.model = args.model;
      if (args.deliverables !== undefined) updates.deliverables = args.deliverables;
      if (args.errorMessage !== undefined) updates.errorMessage = args.errorMessage;
      if (args.status !== "running") updates.endedAt = now;

      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("agentRuns", {
        agentId: args.agentId,
        projectSlug: args.projectSlug,
        model: args.model,
        status: args.status,
        summary: args.summary,
        startedAt: args.startedAt ?? now,
        deliverables: args.deliverables,
        errorMessage: args.errorMessage,
      });
    }
  },
});
