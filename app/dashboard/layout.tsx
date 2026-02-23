"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import DashboardThemeProvider from "@/components/dashboard/DashboardThemeProvider";
import ThemeToggle from "@/components/dashboard/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const db = getSupabaseClient();
    if (!db) {
      setChecking(false);
      router.replace("/login?error=config");
      return;
    }
    db.auth.getUser().then(({ data: { user } }) => {
      setChecking(false);
      if (user) {
        setAllowed(true);
      } else {
        const params = new URLSearchParams({ next: pathname ?? "/dashboard" });
        router.replace(`/login?${params.toString()}`);
      }
    });
  }, [router, pathname]);

  if (checking || !allowed) {
    return (
      <div className="theme-dashboard min-h-screen antialiased">
        {checking ? (
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--dash-bg)" }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[var(--dash-primary)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm" style={{ color: "var(--dash-text-muted)" }}>Carregando...</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <DashboardThemeProvider className="flex flex-col">
      <div className="flex-1 pb-24">{children}</div>
      <div className="fixed bottom-24 right-4 z-40">
        <ThemeToggle />
      </div>
      <BottomNavigation />
    </DashboardThemeProvider>
  );
}

function BottomNavigation() {
  const pathname = usePathname();
  const navItems = [
    { icon: "grid_view", label: "Início", href: "/dashboard" },
    { icon: "calendar_month", label: "Agenda", href: "/dashboard/disponibilidade" },
    { icon: "content_cut", label: "Serviços", href: "/dashboard/servicos" },
    { icon: "groups", label: "Equipe", href: "/dashboard/colaboradores" },
    { icon: "person", label: "Conta", href: "/dashboard/conta" },
  ];
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-dash-surface/95 backdrop-blur-md border-t border-dash-border px-4 py-3 pb-8 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1.5 flex-1 group"
            >
              <span
                className={`material-symbols-outlined text-[24px] transition-colors ${
                  active ? "text-dash-primary" : "text-dash-text-muted group-hover:text-dash-text"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "font-bold text-dash-primary" : "text-dash-text-muted group-hover:text-dash-text"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="h-4 w-full fixed bottom-0 bg-dash-surface/95 backdrop-blur-md z-50 pointer-events-none" />
    </>
  );
}
