"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { supabase } from "@/lib/supabase/client";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

interface Collaborator {
  id: string;
  name: string;
  phone: string | null;
  initials: string;
}

export default function ColaboradoresPage() {
  const [list, setList] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = supabase;
    if (!db) return;
    db.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      db
        .from("users")
        .select("id")
        .eq("firebase_uid", user.id)
        .single()
        .then(({ data: userRow }) => {
          if (!userRow?.id) return;
          db
            .from("collaborators")
            .select("id, name, phone")
            .eq("user_id", userRow.id)
            .eq("is_active", true)
            .order("name")
            .then(({ data }) => {
              setList(
                (data ?? []).map((c) => ({
                  id: c.id,
                  name: c.name,
                  phone: c.phone ?? null,
                  initials: (c.name ?? "?")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase(),
                }))
              );
              setLoading(false);
            });
        });
    });
  }, []);

  return (
    <div className={`${jakarta.variable} font-[family-name:var(--font-jakarta)] min-h-screen bg-dash-bg text-dash-text pb-28`}>
      <DashboardPageHeader title="Colaboradores" />
      <main className="max-w-md mx-auto px-4 pt-5">
        <Link
          href="/dashboard/colaboradores/novo"
          className="w-full h-14 bg-dash-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg mb-7"
        >
          <Plus size={20} strokeWidth={2.5} />
          Adicionar Colaborador
        </Link>

        <p className="text-xs font-bold uppercase tracking-wider text-dash-primary mb-4">
          Equipe ({list.length})
        </p>

        {loading ? (
          <p className="text-dash-text-muted text-sm">Carregando...</p>
        ) : list.length === 0 ? (
          <p className="text-dash-text-muted text-sm">Nenhum colaborador. Adicione o primeiro acima.</p>
        ) : (
          <div className="space-y-2">
            {list.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/colaboradores/${c.id}/servicos`}
                className="flex items-center justify-between p-4 bg-dash-surface border border-dash-border rounded-xl active:opacity-70 transition-opacity hover:bg-dash-surface-hover"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-dash-primary-bg border-2 border-dash-primary/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-dash-primary">{c.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-dash-text">{c.name}</p>
                    <p className="text-xs text-dash-text-muted">Toque para configurar serviços</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-dash-text-muted" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
