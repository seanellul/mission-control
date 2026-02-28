import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    projectSlug: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.projectSlug) {
      results = await ctx.db
        .query("activities")
        .withIndex("by_project", (q) => q.eq("projectSlug", args.projectSlug!))
        .collect();
    } else {
      results = await ctx.db.query("activities").collect();
    }

    // Sort by createdAt descending
    results.sort((a, b) => b.createdAt - a.createdAt);

    if (args.limit) {
      return results.slice(0, args.limit);
    }
    return results;
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("activities")
      .withIndex("by_time")
      .order("desc")
      .take(args.limit || 20);
    return results;
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
