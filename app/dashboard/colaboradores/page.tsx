"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, ChevronRight } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { supabase } from "@/lib/supabase/client";

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
    <div
      className={`${jakarta.variable} font-[family-name:var(--font-jakarta)] bg-[#102216] min-h-screen text-white pb-28`}
    >
      <header className="sticky top-0 z-50 bg-[#102216]/85 backdrop-blur-md border-b border-white/8">
        <div className="flex items-center px-4 h-14 justify-between max-w-md mx-auto">
          <Link href="/dashboard" className="h-10 w-10 flex items-center justify-start">
            <ArrowLeft size={22} className="text-white/70" />
          </Link>
          <h1 className="text-base font-bold">Colaboradores</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5">
        <Link
          href="/dashboard/colaboradores/novo"
          className="w-full h-14 bg-[#13ec5b] text-[#102216] font-bold rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(19,236,91,0.15)] mb-7"
        >
          <Plus size={20} strokeWidth={2.5} />
          Adicionar Colaborador
        </Link>

        <p className="text-xs font-bold uppercase tracking-wider text-[#13ec5b]/60 mb-4">
          Equipe ({list.length})
        </p>

        {loading ? (
          <p className="text-white/50 text-sm">Carregando...</p>
        ) : list.length === 0 ? (
          <p className="text-white/50 text-sm">Nenhum colaborador. Adicione o primeiro acima.</p>
        ) : (
          <div className="space-y-2">
            {list.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/colaboradores/${c.id}/servicos`}
                className="flex items-center justify-between p-4 bg-[#193322] border border-[#326744]/50 rounded-xl active:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#13ec5b]/30 to-[#193322] border-2 border-[#13ec5b]/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[#13ec5b]">{c.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-white/40">Toque para configurar serviços</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-white/25" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
