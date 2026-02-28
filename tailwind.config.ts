import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        secondary: "#FF6584",
        accent: "#43E97B",
        background: "#F8F9FF",
        surface: "#FFFFFF",
        foreground: "#1A1A2E",
        muted: "#6B7280",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(108, 99, 255, 0.07), 0 10px 20px -2px rgba(108, 99, 255, 0.04)",
        "card": "0 4px 20px -2px rgba(26, 26, 46, 0.08), 0 0 0 1px rgba(26, 26, 46, 0.04)",
        "card-hover": "0 20px 40px -10px rgba(26, 26, 46, 0.15), 0 0 0 1px rgba(108, 99, 255, 0.08)",
        "glow": "0 0 30px -5px rgba(108, 99, 255, 0.25)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
