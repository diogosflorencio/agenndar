"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { supabase } from "@/lib/supabase/client";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export default function NovoColaboradorPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !name.trim()) return;
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: userRow } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", user.id)
        .single();
      if (!userRow?.id) return;
      const { data: newColl } = await supabase
        .from("collaborators")
        .insert({
          user_id: userRow.id,
          name: name.trim(),
          phone: phone.trim() || null,
          is_active: true,
        })
        .select("id")
        .single();
      if (newColl?.id) router.push(`/dashboard/colaboradores/${newColl.id}/servicos`);
      else router.push("/dashboard/colaboradores");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${jakarta.variable} font-[family-name:var(--font-jakarta)] min-h-screen bg-dash-bg text-dash-text pb-24`}>
      <DashboardPageHeader title="Novo Colaborador" backHref="/dashboard/colaboradores" />
      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider block mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className="w-full h-12 bg-dash-surface border border-dash-border rounded-xl px-4 text-dash-text placeholder:text-dash-text-muted focus:outline-none focus:border-dash-primary"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider block mb-2">
              Telefone (opcional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+55 (11) 99999-9999"
              className="w-full h-12 bg-dash-surface border border-dash-border rounded-xl px-4 text-dash-text placeholder:text-dash-text-muted focus:outline-none focus:border-dash-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full h-14 bg-dash-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Criar e configurar serviços"}
          </button>
        </form>
      </main>
    </div>
  );
}
