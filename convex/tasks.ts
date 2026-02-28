import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { projectSlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.projectSlug) {
      return await ctx.db
        .query("tasks")
        .withIndex("by_project", (q) => q.eq("projectSlug", args.projectSlug!))
        .collect();
    }
    return await ctx.db.query("tasks").collect();
  },
});

export const getByStatus = query({
  args: { status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const create = mutation({
  args: {
    projectSlug: v.string(),
    title: v.string(),
    status: v.optional(v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done"))),
    assignee: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      status: args.status || "todo",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
