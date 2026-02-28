# Mission Control

A dashboard for managing projects, decisions, agents, and schedules. Built with Next.js 14, Convex, Tailwind CSS, and shadcn/ui.

## Features

- **Dashboard** - Overview of all projects with pending decisions highlighted
- **Decisions Board** - Cross-project decision management with approve/defer workflow
- **Projects** - Per-project view with decisions, tasks, and activity
- **Agents** - Monitor running agents and view run history
- **Cron** - Visual cron job calendar with run status
- **Memory** - Browse and view agent memory files

## Tech Stack

- **Next.js 14** (App Router)
- **Convex** (Real-time database)
- **Tailwind CSS** (Styling)
- **shadcn/ui** (UI components)
- **TypeScript** (Type safety)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Convex

```bash
npx convex dev
```

This will:
- Create a Convex project (if new)
- Generate the `convex/_generated` files
- Start the Convex development server

### 3. Configure environment

Copy `.env.example` to `.env.local` and add your Convex URL:

```bash
cp .env.example .env.local
```

The Convex URL is printed when you run `npx convex dev`.

### 4. Seed the database

Run the seed function in the Convex dashboard, or use:

```bash
npx convex run seed:seedData
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

These endpoints can be used by agents to create data programmatically:

### POST /api/decisions

Create a new decision:

```bash
curl -X POST http://localhost:3000/api/decisions \
  -H "Content-Type: application/json" \
  -d '{
    "projectSlug": "ernest",
    "title": "Choose deployment platform",
    "context": "Need to decide where to deploy the app.",
    "options": ["Vercel", "Cloudflare", "Self-hosted"],
    "recommendation": "Vercel"
  }'
```

### POST /api/tasks

Create a new task:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "projectSlug": "ernest",
    "title": "Write unit tests",
    "priority": "high",
    "assignee": "Agent"
  }'
```

### POST /api/activity

Log an activity:

```bash
curl -X POST http://localhost:3000/api/activity \
  -H "Content-Type: application/json" \
  -d '{
    "projectSlug": "ernest",
    "type": "agent",
    "actor": "BuildAgent",
    "message": "Completed deployment to staging"
  }'
```

### GET /api/cron-jobs

Get configured cron jobs (reads from `~/.openclaw/cron/jobs.json`).

### GET /api/agent-logs

Get agent status and logs from `/tmp/agent-*.status` files.

### GET /api/memory

Get memory file listing or content:

```bash
# List files
curl http://localhost:3000/api/memory

# Get file content
curl http://localhost:3000/api/memory?file=MEMORY.md
```

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variable: `NEXT_PUBLIC_CONVEX_URL`
4. Deploy

### Convex Production

```bash
npx convex deploy
```

## Project Structure

```
mission-control/
├── app/                    # Next.js app router pages
│   ├── api/               # API route handlers
│   ├── projects/[slug]/   # Per-project view
│   ├── decisions/         # Decisions board
│   ├── agents/            # Agent monitoring
│   ├── cron/              # Cron calendar
│   └── memory/            # Memory viewer
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── layout/           # Page layout components
│   ├── decisions/        # Decision-related components
│   ├── projects/         # Project-related components
│   ├── tasks/            # Task-related components
│   ├── agents/           # Agent-related components
│   ├── cron/             # Cron-related components
│   ├── memory/           # Memory-related components
│   └── activity/         # Activity feed components
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   ├── projects.ts       # Project mutations/queries
│   ├── tasks.ts          # Task mutations/queries
│   ├── decisions.ts      # Decision mutations/queries
│   ├── agentRuns.ts      # Agent run mutations/queries
│   ├── activities.ts     # Activity mutations/queries
│   └── seed.ts           # Seed data
├── lib/                  # Utilities
└── types/                # TypeScript types
```

## License

MIT
