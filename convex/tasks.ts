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

export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("backlog"),
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const getSubtasks = query({
  args: { parentTaskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_parent", (q) => q.eq("parentTaskId", args.parentTaskId))
      .collect();
  },
});

export const countByProject = query({
  args: { projectSlug: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectSlug", args.projectSlug))
      .collect();

    return {
      backlog: tasks.filter((t) => t.status === "backlog").length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      total: tasks.length,
    };
  },
});

export const create = mutation({
  args: {
    projectSlug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("backlog"),
        v.literal("todo"),
        v.literal("in-progress"),
        v.literal("done")
      )
    ),
    assignee: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    labels: v.optional(v.array(v.string())),
    parentTaskId: v.optional(v.id("tasks")),
    decisionId: v.optional(v.id("decisions")),
    agentRunId: v.optional(v.id("agentRuns")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      status: args.status || "backlog",
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("backlog"),
        v.literal("todo"),
        v.literal("in-progress"),
        v.literal("done")
      )
    ),
    assignee: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))
    ),
    labels: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Task not found");

    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    if (fields.title !== undefined) updates.title = fields.title;
    if (fields.description !== undefined) updates.description = fields.description;
    if (fields.assignee !== undefined) updates.assignee = fields.assignee;
    if (fields.priority !== undefined) updates.priority = fields.priority;
    if (fields.labels !== undefined) updates.labels = fields.labels;

    if (fields.status !== undefined) {
      updates.status = fields.status;
      if (fields.status === "done" && existing.status !== "done") {
        updates.completedAt = Date.now();
      } else if (fields.status !== "done" && existing.status === "done") {
        updates.completedAt = undefined;
      }
    }

    return await ctx.db.patch(id, updates);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("backlog"),
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Task not found");

    const updates: Record<string, unknown> = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.status === "done" && existing.status !== "done") {
      updates.completedAt = Date.now();
    } else if (args.status !== "done" && existing.status === "done") {
      updates.completedAt = undefined;
    }

    return await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
