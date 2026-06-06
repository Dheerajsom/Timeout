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
        ink: "#07080a",
        panel: "#101318",
        line: "#242a33",
        muted: "#cbd5e1",
        hardwood: "#c78d50",
        signal: "#ff4f5a",
        teal: "#26d0b8",
      },
      boxShadow: {
        glow: "0 0 60px rgba(38, 208, 184, 0.14)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
