import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        game: ["Nunito", "ui-rounded", "system-ui", "sans-serif"],
        display: ["Nunito", "ui-rounded", "system-ui", "sans-serif"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        // Game custom colors
        coin: "oklch(var(--coin-yellow))",
        "farm-green": "oklch(var(--farm-green))",
        "sky-blue": "oklch(var(--sky-blue))",
        "sun-orange": "oklch(var(--sun-orange))",
        "rebirth-purple": "oklch(var(--rebirth-purple))",
        "customer-pink": "oklch(var(--customer-pink))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        "4xl": "4rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        game: "0 6px 0 oklch(0.65 0.15 88), 0 10px 20px oklch(0 0 0 / 0.15)",
        "game-green": "0 6px 0 oklch(0.5 0.2 145), 0 10px 20px oklch(0 0 0 / 0.15)",
        "game-blue": "0 6px 0 oklch(0.55 0.12 230), 0 10px 20px oklch(0 0 0 / 0.15)",
        "game-orange": "0 6px 0 oklch(0.55 0.2 45), 0 10px 20px oklch(0 0 0 / 0.15)",
        "game-purple": "0 6px 0 oklch(0.45 0.2 290), 0 10px 20px oklch(0 0 0 / 0.15)",
        card: "0 4px 0 oklch(0.82 0.06 90), 0 8px 24px oklch(0 0 0 / 0.08)",
        "card-hover": "0 6px 0 oklch(0.72 0.1 90), 0 12px 32px oklch(0 0 0 / 0.12)",
        glow: "0 0 30px oklch(0.86 0.2 88 / 0.5)",
        "glow-green": "0 0 30px oklch(0.72 0.19 145 / 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
