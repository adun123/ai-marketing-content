import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        primary: "#2563EB",
        secondary: "#7C3AED",
        accent: "#10B981",
      },
    },
  },
  plugins: [],
};
export default config;
