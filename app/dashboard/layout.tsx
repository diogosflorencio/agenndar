"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

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
    const supabase = getSupabaseClient();
    if (!supabase) {
      setChecking(false);
      router.replace("/login?error=config");
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
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
    <div className="theme-dashboard min-h-screen antialiased">
      {children}
    </div>
  );
}
