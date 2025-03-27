import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fff7d9",
        maroon: "#871f13",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#871f13",
          "primary-content": "#FFFFFF",
          secondary: "#fff7d9",
          "secondary-content": "#871f13",
          accent: "#871f13",
          "accent-content": "#FFFFFF",
          neutral: "#fff7d9",
          "neutral-content": "#871f13",
          "base-100": "#FFFFFF",
          "base-200": "#fff7d9",
          "base-300": "#fff7d9",
          "base-content": "#871f13",
          info: "#0EA5E9",
          "info-content": "#FFFFFF",
          success: "#22C55E",
          "success-content": "#FFFFFF",
          warning: "#F59E0B",
          "warning-content": "#1F2937",
          error: "#DC2626",
          "error-content": "#FFFFFF",
        },
      },
      {
        dark: {
          primary: "#871f13",
          "primary-content": "#FFFFFF",
          secondary: "#4A3B3B",
          "secondary-content": "#FFFFFF",
          accent: "#871f13",
          "accent-content": "#FFFFFF",
          neutral: "#2A1F1F",
          "neutral-content": "#FFFFFF",
          "base-100": "#1A1414",
          "base-200": "#241B1B",
          "base-300": "#2E2222",
          "base-content": "#fff7d9",
          info: "#0EA5E9",
          "info-content": "#FFFFFF",
          success: "#22C55E",
          "success-content": "#FFFFFF",
          warning: "#F59E0B",
          "warning-content": "#1F2937",
          error: "#DC2626",
          "error-content": "#FFFFFF",
        },
      },
      {
        caramel: {
          primary: "#871f13",
          "primary-content": "#FFFFFF",
          secondary: "#4A3B3B",
          "secondary-content": "#FFFFFF",
          accent: "#871f13",
          "accent-content": "#FFFFFF",
          neutral: "#2A1F1F",
          "neutral-content": "#FFFFFF",
          "base-100": "#1A1414",
          "base-200": "#241B1B",
          "base-300": "#2E2222",
          "base-content": "#fff7d9",
          info: "#0EA5E9",
          "info-content": "#FFFFFF",
          success: "#22C55E",
          "success-content": "#FFFFFF",
          warning: "#F59E0B",
          "warning-content": "#1F2937",
          error: "#DC2626",
          "error-content": "#FFFFFF",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
    themeRoot: ":root",
  },
};

export default config;
