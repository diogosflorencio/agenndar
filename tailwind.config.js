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
        // Tema global (verde escuro)
        "primary-glow": "#34d399",
        "bg-deep": "#020617",
        card: "#0f172a",
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
        background: {
          dark: "#020403",
          light: "#f6f8f6",
          DEFAULT: "#0B120E",
        },
        surface: {
          DEFAULT: "#0f1c15",
          light: "#14221A",
          border: "#1a2e24",
          "app-bg": "#0B120E",
          "app-surface": "#14221A",
          "app-border": "#213428",
        },
        text: {
          muted: "#8fa898",
          DEFAULT: "#ffffff",
          secondary: "#cbd5e1",
        },
        // Dashboard (tema claro) – use em páginas dentro de .theme-dashboard
        dash: {
          bg: "var(--dash-bg)",
          surface: "var(--dash-surface)",
          "surface-hover": "var(--dash-surface-hover)",
          border: "var(--dash-border)",
          text: "var(--dash-text)",
          "text-muted": "var(--dash-text-muted)",
          primary: "var(--dash-primary)",
          "primary-bg": "var(--dash-primary-bg)",
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

