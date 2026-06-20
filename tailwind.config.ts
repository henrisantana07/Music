import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors using CSS variables
        "ember-base": "var(--bg-base)",
        "ember-surface": "var(--bg-surface)",
        "ember-elevated": "var(--bg-elevated)",
        "ember-accent-from": "var(--accent-from)",
        "ember-accent-to": "var(--accent-to)",
        "ember-accent-solid": "var(--accent-solid)",
        "ember-accent-muted": "var(--accent-muted)",
        "ember-text-primary": "var(--text-primary)",
        "ember-text-secondary": "var(--text-secondary)",
        "ember-text-disabled": "var(--text-disabled)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      transitionDuration: {
        "250": "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
