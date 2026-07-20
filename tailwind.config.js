/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#D2001A",
          hover: "#B0001A",
        },
        secondary: {
          DEFAULT: "#FFDE00",
        },
        app: {
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          card: "var(--color-card)",
          text: "var(--color-text)",
          muted: "var(--color-text-muted)",
          border: "var(--color-border)",
        },
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};
