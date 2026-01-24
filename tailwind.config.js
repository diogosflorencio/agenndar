/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores primárias
        primary: {
          DEFAULT: "#13ec5b",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#13ec5b",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Cores de background
        background: {
          dark: "#020403",
          light: "#f6f8f6",
          DEFAULT: "#0B120E",
        },
        // Cores de superfície
        surface: {
          DEFAULT: "#0f1c15",
          light: "#14221A",
          border: "#1a2e24",
          "app-bg": "#0B120E",
          "app-surface": "#14221A",
          "app-border": "#213428",
        },
        // Cores de texto
        text: {
          muted: "#8fa898",
          DEFAULT: "#ffffff",
          secondary: "#cbd5e1",
        },
        // Cores de status
        status: {
          success: "#10b981",
          error: "#ef4444",
          warning: "#f59e0b",
          info: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(19, 236, 91, 0.4)",
        "glow-lg": "0 0 30px -5px rgba(19, 236, 91, 0.5)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)",
        "card-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss/plugin")(function ({ addUtilities }) {
    addUtilities({
      ".no-scrollbar": {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    });
  })],
};

