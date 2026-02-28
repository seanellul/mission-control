import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingProjects = await ctx.db.query("projects").collect();
    if (existingProjects.length > 0) {
      return { message: "Already seeded", seeded: false };
    }

    // Seed projects
    const ernestId = await ctx.db.insert("projects", {
      slug: "ernest",
      name: "Ernest",
      description: "AI app branding service — transforms your app idea into a complete brand identity",
      status: "active",
      githubUrl: "https://github.com/seanellul/ernest",
      color: "#3b82f6",
    });

    const wordSolitaireId = await ctx.db.insert("projects", {
      slug: "word-solitaire",
      name: "Word Solitaire",
      description: "Strategic word puzzle game with solitaire mechanics",
      status: "active",
      githubUrl: "https://github.com/seanellul/word-solitaire",
      color: "#22c55e",
    });

    const infraId = await ctx.db.insert("projects", {
      slug: "openclaw-infra",
      name: "OpenClaw Infra",
      description: "Agent infrastructure, orchestration, and automation tools",
      status: "active",
      color: "#a855f7",
    });

    // Seed decisions for Ernest
    await ctx.db.insert("decisions", {
      projectSlug: "ernest",
      title: "Approve brand name (Ernest)",
      context:
        "The AI has suggested ERNEST as the brand name for the app branding service. This name evokes trust, classic reliability, and earnestness. It's memorable, works as both a noun and adjective, and has strong .com availability.",
      options: ["Keep ERNEST", "Explore alternatives", "A/B test both"],
      recommendation: "Keep ERNEST",
      status: "needs-sean",
      createdAt: Date.now() - 86400000, // 1 day ago
    });

    await ctx.db.insert("decisions", {
      projectSlug: "ernest",
      title: "Pricing model",
      context:
        "Need to decide on monetization strategy. Key considerations: competitor pricing ($50-300 one-time), target market (indie developers, startups), perceived value of AI-generated branding.",
      options: ["Freemium + $99/yr Pro", "One-time $199", "Usage-based pricing"],
      recommendation: "Freemium, $99/yr Pro",
      status: "needs-sean",
      createdAt: Date.now() - 43200000, // 12 hours ago
    });

    await ctx.db.insert("decisions", {
      projectSlug: "ernest",
      title: "Launch strategy",
      context:
        "Ernest is feature-complete and ready for users. Need to choose go-to-market approach. Current beta has 12 users with positive feedback.",
      options: ["Soft launch (beta users)", "Public launch with 4-week plan", "Product Hunt launch"],
      recommendation: "Public launch, 4-week plan",
      status: "needs-sean",
      createdAt: Date.now() - 3600000, // 1 hour ago
    });

    // Seed some sample tasks
    await ctx.db.insert("tasks", {
      projectSlug: "ernest",
      title: "Finalize landing page copy",
      status: "in-progress",
      assignee: "Agent",
      priority: "high",
      createdAt: Date.now() - 7200000,
    });

    await ctx.db.insert("tasks", {
      projectSlug: "word-solitaire",
      title: "Add daily challenge mode",
      status: "todo",
      priority: "medium",
      createdAt: Date.now() - 172800000,
    });

    await ctx.db.insert("tasks", {
      projectSlug: "openclaw-infra",
      title: "Set up Mission Control dashboard",
      status: "in-progress",
      assignee: "Agent",
      priority: "high",
      createdAt: Date.now() - 3600000,
    });

    // Seed some activities
    await ctx.db.insert("activities", {
      projectSlug: "ernest",
      type: "decision",
      actor: "Agent",
      message: "Created decision: Launch strategy",
      createdAt: Date.now() - 3600000,
    });

    await ctx.db.insert("activities", {
      projectSlug: "openclaw-infra",
      type: "agent",
      actor: "System",
      message: "Started: Building Mission Control v1",
      createdAt: Date.now() - 1800000,
    });

    await ctx.db.insert("activities", {
      type: "note",
      actor: "System",
      message: "Morning brief sent to Telegram",
      createdAt: Date.now() - 14400000,
    });

    return { message: "Seeded successfully", seeded: true };
  },
});
