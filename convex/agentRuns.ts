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

    // Sort by startedAt descending
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      summary: args.summary,
      endedAt: Date.now(),
    });
  },
});
