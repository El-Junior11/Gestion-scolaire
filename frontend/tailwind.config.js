/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2A4A",
          light: "#2A3D63",
          dark: "#121D33",
        },
        forest: {
          DEFAULT: "#2F6B4F",
          light: "#3E8767",
          dark: "#22513C",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#DFC15E",
        },
        brick: {
          DEFAULT: "#B3402A",
          light: "#D65C41",
        },
        paper: "#F7F6F1",
        surface: "#FFFFFF",
        line: "#E4E1D6",
        muted: "#6F6B5E",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      // Échelle de texte explicite : chaque taille porte sa propre hauteur de ligne
      // et son espacement de lettres, pour un texte lisible et cohérent partout.
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0" }],
        sm: ["0.875rem", { lineHeight: "1.55", letterSpacing: "0" }],
        base: ["1rem", { lineHeight: "1.65", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.55", letterSpacing: "0" }],
        xl: ["1.25rem", { lineHeight: "1.45", letterSpacing: "-0.005em" }],
        "2xl": ["1.5rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        "4xl": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27, 42, 74, 0.06), 0 1px 1px rgba(27, 42, 74, 0.04)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};