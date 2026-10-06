import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        serif: [
          "Playfair Display",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif",
        ],
      },
      colors: {
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
        surface: {
          borderLight: "rgba(0, 0, 0, 0.08)",
          borderDark: "rgba(255, 255, 255, 0.10)",
          cardLight: "#FFFFFF",
          cardDark: "#16181C",
        },
      },
      backdropBlur: {
        glass: "20px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 80s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
