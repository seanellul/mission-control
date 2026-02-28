import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    projectSlug: v.optional(v.string()),
    model: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.projectSlug) {
      results = await ctx.db
        .query("usageRecords")
        .withIndex("by_project", (q) => q.eq("projectSlug", args.projectSlug!))
        .collect();
    } else {
      results = await ctx.db.query("usageRecords").collect();
    }

    if (args.model) {
      results = results.filter((r) => r.model === args.model);
    }

    results.sort((a, b) => b.createdAt - a.createdAt);

    return results.slice(0, args.limit || 100);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const records = await ctx.db.query("usageRecords").collect();

    let totalCost = 0;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCacheReadTokens = 0;
    let totalCacheWriteTokens = 0;
    let totalApiCalls = 0;

    const modelMap = new Map<string, { cost: number; apiCalls: number }>();
    const projectMap = new Map<string, { cost: number; apiCalls: number }>();

    for (const r of records) {
      totalCost += r.estimatedCost;
      totalInputTokens += r.inputTokens;
      totalOutputTokens += r.outputTokens;
      totalCacheReadTokens += r.cacheReadTokens;
      totalCacheWriteTokens += r.cacheWriteTokens;
      totalApiCalls += r.apiCalls;

      const modelEntry = modelMap.get(r.model) || { cost: 0, apiCalls: 0 };
      modelEntry.cost += r.estimatedCost;
      modelEntry.apiCalls += r.apiCalls;
      modelMap.set(r.model, modelEntry);

      const slug = r.projectSlug || "unknown";
      const projEntry = projectMap.get(slug) || { cost: 0, apiCalls: 0 };
      projEntry.cost += r.estimatedCost;
      projEntry.apiCalls += r.apiCalls;
      projectMap.set(slug, projEntry);
    }

    return {
      totalCost,
      totalInputTokens,
      totalOutputTokens,
      totalCacheReadTokens,
      totalCacheWriteTokens,
      totalApiCalls,
      byModel: Array.from(modelMap.entries()).map(([model, data]) => ({
        model,
        ...data,
      })),
      byProject: Array.from(projectMap.entries()).map(([projectSlug, data]) => ({
        projectSlug,
        ...data,
      })),
    };
  },
});

export const create = mutation({
  args: {
    agentId: v.string(),
    sessionId: v.optional(v.string()),
    model: v.string(),
    projectSlug: v.optional(v.string()),
    inputTokens: v.number(),
    outputTokens: v.number(),
    cacheReadTokens: v.number(),
    cacheWriteTokens: v.number(),
    apiCalls: v.number(),
    estimatedCost: v.number(),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Upsert by agentId — idempotent for repeated sync
    const existing = await ctx.db
      .query("usageRecords")
      .withIndex("by_agent", (q) => q.eq("agentId", args.agentId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        createdAt: existing.createdAt,
      });
      return existing._id;
    }

    return await ctx.db.insert("usageRecords", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
