import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        ivory: "#F4F2F3",
        mauve: "#C0A9BD",
        sage: "#94A7AE",
        deep: "#47676A",
        "deep-light": "#5A7E82",
        "deep-dark": "#354F52",
        // Logo accent (forest green from the SP monogram)
        forest: "#0F5F2E",
        "forest-dark": "#0A4321",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #F4F2F3 0%, #C0A9BD 50%, #94A7AE 100%)",
        "gradient-mesh":
          "radial-gradient(at 20% 10%, #C0A9BD 0, transparent 50%), radial-gradient(at 80% 90%, #94A7AE 0, transparent 50%), radial-gradient(at 50% 50%, #F4F2F3 0, transparent 70%)",
        "gradient-deep":
          "linear-gradient(135deg, #47676A 0%, #354F52 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(192, 169, 189, 0.4)",
        "glow-sage": "0 0 40px rgba(148, 167, 174, 0.4)",
        "glow-deep": "0 0 60px rgba(71, 103, 106, 0.3)",
        glass: "0 8px 32px rgba(71, 103, 106, 0.12)",
        "glass-lg": "0 20px 50px rgba(71, 103, 106, 0.18)",
        lift: "0 20px 40px -12px rgba(71, 103, 106, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        shimmer: "shimmer 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
