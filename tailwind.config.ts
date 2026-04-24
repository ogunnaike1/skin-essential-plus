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
        ivory: "#FCFBFC",
        mauve: "#8A6F88",
        sage: "#4F7288",
        deep: "#47676A",
        "deep-light": "#5A7E82",
        "deep-dark": "#354F52",
        // Logo accent (forest green from the SP monogram)
        forest: "#0F5F2E",
        "forest-dark": "#0A4321",
        // Pre-blended SOLID tints (never translucent).
        // Calibrated for the new palette:
        //   ~15% palette + 85% ivory = -tint
        //   ~30% palette + 70% ivory = -wash
        "mauve-tint": "#EFE9EF",
        "mauve-wash": "#E1D6E1",
        "sage-tint": "#E7EBEF",
        "sage-wash": "#D2DAE0",
        "deep-tint": "#E6EAEA",
        "deep-wash": "#D0D7D7",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #FCFBFC 0%, #8A6F88 50%, #4F7288 100%)",
        "gradient-mesh":
          "radial-gradient(at 20% 10%, #8A6F88 0, transparent 50%), radial-gradient(at 80% 90%, #4F7288 0, transparent 50%), radial-gradient(at 50% 50%, #FCFBFC 0, transparent 70%)",
        "gradient-deep":
          "linear-gradient(135deg, #47676A 0%, #354F52 100%)",
      },
      boxShadow: {
        // Shadow rgbas updated to match the new palette colors
        glow: "0 0 40px rgba(138, 111, 136, 0.4)",        // mauve #8A6F88
        "glow-sage": "0 0 40px rgba(79, 114, 136, 0.4)",  // sage #4F7288
        "glow-deep": "0 0 60px rgba(71, 103, 106, 0.3)",  // deep #47676A (unchanged)
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