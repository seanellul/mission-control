import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d1117",
        foreground: "#c9d1d9",
        muted: {
          DEFAULT: "#21262d",
          foreground: "#8b949e",
        },
        accent: {
          DEFAULT: "#58a6ff",
          foreground: "#ffffff",
        },
        border: "#30363d",
        card: {
          DEFAULT: "#161b22",
          foreground: "#c9d1d9",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        project: {
          ernest: "#3b82f6",
          wordsolitaire: "#22c55e",
          infra: "#a855f7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
