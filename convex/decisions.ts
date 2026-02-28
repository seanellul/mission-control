import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { projectSlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.projectSlug) {
      return await ctx.db
        .query("decisions")
        .withIndex("by_project", (q) => q.eq("projectSlug", args.projectSlug!))
        .collect();
    }
    return await ctx.db.query("decisions").collect();
  },
});

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("needs-sean"),
      v.literal("needs-agent"),
      v.literal("resolved"),
      v.literal("deferred")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("decisions")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const needsSean = await ctx.db
      .query("decisions")
      .withIndex("by_status", (q) => q.eq("status", "needs-sean"))
      .collect();
    const needsAgent = await ctx.db
      .query("decisions")
      .withIndex("by_status", (q) => q.eq("status", "needs-agent"))
      .collect();
    return [...needsSean, ...needsAgent];
  },
});

export const create = mutation({
  args: {
    projectSlug: v.string(),
    title: v.string(),
    context: v.string(),
    options: v.array(v.string()),
    recommendation: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("needs-sean"),
        v.literal("needs-agent"),
        v.literal("resolved"),
        v.literal("deferred")
      )
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("decisions", {
      ...args,
      status: args.status || "needs-sean",
      createdAt: Date.now(),
    });
  },
});

export const resolve = mutation({
  args: {
    id: v.id("decisions"),
    resolution: v.string(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: "resolved",
      resolution: args.resolution,
      comment: args.comment,
      resolvedAt: Date.now(),
    });
  },
});

export const defer = mutation({
  args: {
    id: v.id("decisions"),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: "deferred",
      comment: args.comment,
    });
  },
});

export const addComment = mutation({
  args: {
    id: v.id("decisions"),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { comment: args.comment });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("decisions"),
    status: v.union(
      v.literal("needs-sean"),
      v.literal("needs-agent"),
      v.literal("resolved"),
      v.literal("deferred")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { status: args.status });
  },
});
