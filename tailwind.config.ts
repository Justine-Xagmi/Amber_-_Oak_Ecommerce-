import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Botanical-ink palette: deep conifer greens + warm brass, deliberately
        // not the cream/terracotta or near-black/neon defaults.
        parchment: {
          DEFAULT: "#EFEAE0",
          50: "#FAF8F4",
          100: "#F4F0E8",
          200: "#EFEAE0",
          300: "#E3DCCC",
          400: "#D2C7AF",
        },
        ink: {
          DEFAULT: "#171F1B",
          50: "#3C4A41",
          100: "#2C3830",
          200: "#212A24",
          300: "#171F1B",
          400: "#101613",
          500: "#0B0F0D",
        },
        brass: {
          DEFAULT: "#AD8A54",
          100: "#EDE1CB",
          200: "#D9C298",
          300: "#C4A46F",
          400: "#AD8A54",
          500: "#8C6D3F",
          600: "#6B5230",
        },
        clay: {
          DEFAULT: "#8A5A44",
          400: "#A16C51",
          500: "#8A5A44",
          600: "#6F4736",
        },
        moss: {
          DEFAULT: "#4C5D45",
          400: "#5E7256",
          500: "#4C5D45",
        },
        success: "#4C7A5E",
        danger: "#A6473A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "rise-in": "rise-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
