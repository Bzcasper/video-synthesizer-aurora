/** @format */

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        inter: ["Inter", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
        spaceGrotesk: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced Aurora color system - 5-color gradient palette
        aurora: {
          blue: "#00A6FF",
          purple: "#8A2BE2",
          green: "#00FFAA",
          cyan: "#00FFFF",
          orange: "#FF6B35",
          black: "#0A0A0A",
          white: "#F5F5F5",
        },
        // Semantic colors for states
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
          950: "#052E16",
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
        },
        info: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        // Enhanced neutral scale with WCAG AA compliance
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
        // Surface system with multiple background layers
        surface: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#09090B",
        },
      },
      spacing: {
        // 8-step spacing scale for simplicity (4px to 64px)
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        10: "40px",
        16: "64px",
        // Keep some legacy spacing for backward compatibility
        "fib-3": "12px", // maps to new 3
        "fib-4": "16px", // maps to new 4
        "fib-5": "24px", // maps to new 6
        "fib-6": "32px", // maps to new 8
        golden: "61.8%",
      },
      fontSize: {
        // 8-step typography scale with consistent line heights (12px to 72px)
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
        "4xl": ["36px", { lineHeight: "40px" }],
        "5xl": ["48px", { lineHeight: "1" }],
        "6xl": ["60px", { lineHeight: "1" }],
        "7xl": ["72px", { lineHeight: "1" }],
        // Legacy mappings for backward compatibility
        "fib-xs": ["12px", { lineHeight: "16px" }],
        "fib-sm": ["14px", { lineHeight: "20px" }],
        "fib-base": ["16px", { lineHeight: "24px" }],
        "fib-lg": ["18px", { lineHeight: "28px" }],
        "fib-xl": ["20px", { lineHeight: "28px" }],
        "fib-2xl": ["24px", { lineHeight: "32px" }],
      },
      transitionDuration: {
        golden: "618ms",
      },
      width: {
        "golden-lg": "61.8%",
        "golden-sm": "38.2%",
      },
      height: {
        "golden-lg": "61.8vh",
        "golden-sm": "38.2vh",
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
        "aurora-wave": {
          "0%, 100%": { transform: "rotate(-3deg) scale(1.05)" },
          "50%": { transform: "rotate(3deg) scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(0.97)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "particle-float": {
          "0%, 100%": {
            transform: "translate(0px, 0px) rotate(0deg)",
            opacity: "0.8",
          },
          "50%": {
            transform: "translate(10px, -10px) rotate(180deg)",
            opacity: "1",
          },
        },
        "spin-slow": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "aurora-wave": "aurora-wave 15s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "particle-float": "particle-float 8s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0, 166, 255, 0.5)",
        "neon-purple": "0 0 20px rgba(138, 43, 226, 0.5)",
        "neon-green": "0 0 20px rgba(0, 255, 170, 0.5)",
        "neon-cyan": "0 0 20px rgba(0, 255, 255, 0.5)",
        "neon-orange": "0 0 20px rgba(255, 107, 53, 0.5)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
