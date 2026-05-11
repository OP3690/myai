/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a14",
          soft: "#11111d",
          card: "#161628",
        },
        accent: {
          DEFAULT: "#7c5cff",
          glow: "#a78bfa",
          cyan: "#22d3ee",
        },
        ink: {
          DEFAULT: "#e7e7f0",
          dim: "#9b9bae",
          fade: "#62627a",
        },
        severity: {
          error: "#ef4444",
          warn: "#f59e0b",
          info: "#22d3ee",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124, 92, 255, 0.45)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(1200px 600px at 50% -10%, rgba(124,92,255,0.25), transparent 60%), radial-gradient(800px 500px at 100% 0%, rgba(34,211,238,0.15), transparent 60%)",
      },
    },
  },
  plugins: [],
};
