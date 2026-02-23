"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { supabase } from "@/lib/supabase/client";

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
    <div
      className={`${jakarta.variable} font-[family-name:var(--font-jakarta)] bg-[#102216] min-h-screen text-white`}
    >
      <header className="sticky top-0 z-50 bg-[#102216]/85 backdrop-blur-md border-b border-white/8">
        <div className="flex items-center px-4 h-14 max-w-md mx-auto">
          <Link href="/dashboard/colaboradores" className="h-10 w-10 flex items-center justify-start">
            <ArrowLeft size={22} className="text-white/70" />
          </Link>
          <h1 className="text-base font-bold flex-1 text-center pr-10">Novo Colaborador</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className="w-full h-12 bg-[#193322] border border-[#326744]/50 rounded-xl px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-[#13ec5b]/60"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
              Telefone (opcional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+55 (11) 99999-9999"
              className="w-full h-12 bg-[#193322] border border-[#326744]/50 rounded-xl px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-[#13ec5b]/60"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full h-14 bg-[#13ec5b] text-[#102216] font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Criar e configurar serviços"}
          </button>
        </form>
      </main>
    </div>
  );
}
