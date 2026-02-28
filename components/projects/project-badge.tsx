import Link from "next/link";
import { getProjectColor } from "@/lib/utils";

interface ProjectBadgeProps {
  slug: string;
  size?: "sm" | "md";
}

const projectNames: Record<string, string> = {
  ernest: "Ernest",
  "word-solitaire": "Word Solitaire",
  "openclaw-infra": "OpenClaw Infra",
};

export function ProjectBadge({ slug, size = "md" }: ProjectBadgeProps) {
  const color = getProjectColor(slug);
  const name = projectNames[slug] || slug;

  return (
    <Link
      href={`/projects/${slug}`}
      className={`inline-flex items-center gap-1.5 rounded-full transition-opacity hover:opacity-80 ${
        size === "sm" ? "text-xs" : "text-sm"
      }`}
      style={{
        backgroundColor: color + "20",
        color: color,
        padding: size === "sm" ? "2px 8px" : "4px 12px",
      }}
    >
      <div
        className={`rounded-full ${size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"}`}
        style={{ backgroundColor: color }}
      />
      {name}
    </Link>
  );
}
