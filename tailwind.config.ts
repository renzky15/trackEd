import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#6D4C3D",
          "primary-content": "#FFFFFF",
          secondary: "#4A5859",
          "secondary-content": "#FFFFFF",
          accent: "#7D5A50",
          "accent-content": "#FFFFFF",
          neutral: "#2A2826",
          "neutral-content": "#FFFFFF",
          "base-100": "#1D1918",
          "base-200": "#242120",
          "base-300": "#2B2827",
          "base-content": "#E6E6E6",
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
          primary: "#D4A373",
          "primary-content": "#4A403A",
          secondary: "#CCD5AE",
          "secondary-content": "#4A403A",
          accent: "#E9EDC9",
          "accent-content": "#4A403A",
          neutral: "#FAEDCD",
          "neutral-content": "#4A403A",
          "base-100": "#FEFAE0",
          "base-200": "#F9F7E8",
          "base-300": "#F5F3E4",
          "base-content": "#4A403A",
          info: "#98A8B1",
          "info-content": "#1F2937",
          success: "#95A786",
          "success-content": "#1F2937",
          warning: "#E9B384",
          "warning-content": "#1F2937",
          error: "#BC6C25",
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
