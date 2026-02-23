"use client";

import { useDashboardTheme } from "./DashboardThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const ctx = useDashboardTheme();
  if (!ctx) return null;
  const isDark = ctx.theme === "dark";
  return (
    <button
      type="button"
      onClick={ctx.toggleTheme}
      className="p-2 rounded-xl bg-dash-surface-hover border border-dash-border text-dash-text-muted hover:text-dash-text transition-colors"
      aria-label={isDark ? "Usar tema claro" : "Usar tema escuro"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
