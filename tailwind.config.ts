import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      colors: {
        // Strictly neutral Apple / X aesthetic
        gain: "#34C759",
        loss: "#FF3B30",
        accent: "#0A84FF",
        apple: {
          lightBg: "#F2F2F7",
          darkBg: "#000000",
          cardLight: "#FFFFFF",
          cardDark: "#16181C",
          borderLight: "rgba(0, 0, 0, 0.08)",
          borderDark: "rgba(255, 255, 255, 0.10)",
        },
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
