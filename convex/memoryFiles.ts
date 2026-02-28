import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsert = mutation({
  args: {
    filename: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("memoryFiles")
      .withIndex("by_filename", (q) => q.eq("filename", args.filename))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("memoryFiles", {
        filename: args.filename,
        content: args.content,
        updatedAt: Date.now(),
      });
    }
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("memoryFiles").order("desc").collect();
  },
});

export const get = query({
  args: { filename: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memoryFiles")
      .withIndex("by_filename", (q) => q.eq("filename", args.filename))
      .first();
  },
});
