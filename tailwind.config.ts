import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0d12",
        panel: "#12161d",
        raised: "#171c24",
        line: "rgba(255,255,255,0.09)",
        muted: "#9aa4b2",
        court: "#f97316",
        gold: "#fbbf24",
        win: "#34d399",
        loss: "#fb7185",
      },
      boxShadow: {
        stage: "0 24px 80px rgba(0,0,0,0.45)",
        cta: "0 10px 30px rgba(249,115,22,0.28)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "Barlow Condensed",
          "Arial Narrow",
          "ui-sans-serif",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
