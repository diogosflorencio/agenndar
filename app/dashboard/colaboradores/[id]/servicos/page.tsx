"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, Info, Save } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { supabase } from "@/lib/supabase/client";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

interface ServiceItem {
  id: string;
  name: string;
  duration: number;
  price: number;
  category?: string;
}

interface Collaborator {
  id: string;
  name: string;
  initials: string;
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        checked ? "bg-dash-primary" : "bg-dash-border"
      }`}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
      />
    </button>
  );
}

export default function VinculoServicosPage() {
  const params = useParams();
  const collaboratorId = params.id as string;

  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = supabase;
    if (!db || !collaboratorId) return;
    (async () => {
      const {
        data: { user: authUser },
      } = await db.auth.getUser();
      if (!authUser) return;
      const { data: userRow } = await db
        .from("users")
        .select("id")
        .eq("firebase_uid", authUser.id)
        .single();
      if (!userRow?.id) return;

      const { data: coll } = await db
        .from("collaborators")
        .select("id, name")
        .eq("id", collaboratorId)
        .eq("user_id", userRow.id)
        .single();
      if (!coll) return;
      setCollaborator({
        id: coll.id,
        name: coll.name,
        initials: (coll.name ?? "?")
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      });

      const { data: svcList } = await db
        .from("services")
        .select("id, name, duration_minutes, price")
        .eq("user_id", userRow.id)
        .eq("is_active", true)
        .order("name");
      setServices(
        (svcList ?? []).map((s) => ({
          id: s.id,
          name: s.name,
          duration: s.duration_minutes ?? 30,
          price: Number(s.price ?? 0),
          category: "SERVIÇOS",
        }))
      );

      const { data: links } = await db
        .from("service_collaborators")
        .select("service_id")
        .eq("collaborator_id", collaboratorId);
      setSelected(new Set((links ?? []).map((l: { service_id: string }) => l.service_id)));
      setLoading(false);
    })();
  }, [collaboratorId]);

  const categories = useMemo(() => {
    const filtered = services.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
    const map = new Map<string, ServiceItem[]>();
    for (const s of filtered) {
      const cat = s.category ?? "SERVIÇOS";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(s);
    }
    return map;
  }, [services, search]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleCategory = (ids: string[]) => {
    const allChecked = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      allChecked
        ? ids.forEach((id) => next.delete(id))
        : ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const handleSave = async () => {
    const db = supabase;
    if (!db) return;
    setSaving(true);
    try {
      await db
        .from("service_collaborators")
        .delete()
        .eq("collaborator_id", collaboratorId);
      if (selected.size > 0) {
        await db.from("service_collaborators").insert(
          [...selected].map((service_id) => ({
            service_id,
            collaborator_id: collaboratorId,
          }))
        );
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = selected.size;

  if (loading || !collaborator) {
    return (
      <div
        className={`${jakarta.variable} font-[family-name:var(--font-jakarta)] min-h-screen bg-dash-bg text-dash-text flex items-center justify-center`}
      >
        <p className="text-dash-text-muted">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className={`${jakarta.variable} font-[family-name:var(--font-jakarta)] min-h-screen bg-dash-bg text-dash-text pb-32`}
    >
      <DashboardPageHeader title="Vínculo de Equipe" backHref="/dashboard/colaboradores" />

      <main className="max-w-md mx-auto pb-4">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 h-12 bg-dash-surface border border-dash-border rounded-xl px-4">
            <Search size={16} className="text-dash-text-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar serviço..."
              className="flex-1 bg-transparent text-dash-text text-[15px] placeholder:text-dash-text-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="px-4 py-2">
          <p className="text-xs font-bold uppercase tracking-wider text-dash-text-muted">
            Serviços disponíveis
          </p>
        </div>

        <div className="mx-4 mb-4 p-1 bg-dash-primary/10 rounded-xl border border-dash-primary/25">
          <div className="flex items-center gap-3 bg-dash-surface rounded-lg px-4 py-3">
            <div className="h-12 w-12 rounded-full bg-dash-primary/20 border-2 border-dash-primary flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-dash-primary">
                {collaborator.initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-dash-text text-[15px]">{collaborator.name}</p>
              <p className="text-dash-primary text-xs font-semibold uppercase tracking-wider">
                Editando Serviços · {selectedCount} selecionado
                {selectedCount !== 1 ? "s" : ""}
              </p>
            </div>
            <CheckCircle2 size={20} className="text-dash-primary shrink-0" />
          </div>
        </div>

        <div className="mx-4 mb-5 p-3.5 bg-dash-surface border border-dash-border rounded-xl flex gap-3 items-start">
          <Info size={16} className="text-dash-primary shrink-0 mt-0.5" />
          <p className="text-dash-text-muted text-sm leading-relaxed">
            Clientes só verão este colaborador para os serviços selecionados
            abaixo.
          </p>
        </div>

        <div className="space-y-4">
          {Array.from(categories.entries()).map(([category, items]) => {
            const allChecked = items.every((s) => selected.has(s.id));
            return (
              <div key={category}>
                <div className="flex items-center justify-between px-4 py-2 bg-dash-surface/50">
                  <h3 className="text-xs font-bold text-dash-text-muted uppercase tracking-widest">
                    {category}
                  </h3>
                  <button
                    type="button"
                    onClick={() => toggleCategory(items.map((s) => s.id))}
                    className="text-dash-primary text-xs font-bold"
                  >
                    {allChecked ? "Desmarcar todos" : "Marcar todos"}
                  </button>
                </div>

                <div className="divide-y divide-dash-border">
                  {items.map((s) => (
                    <motion.div
                      key={s.id}
                      layout
                      className={`flex items-center justify-between px-4 py-4 transition-colors ${
                        selected.has(s.id) ? "bg-dash-primary/5" : "bg-transparent"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span
                          className={`font-semibold text-[15px] transition-colors ${
                            selected.has(s.id) ? "text-dash-text" : "text-dash-text-muted"
                          }`}
                        >
                          {s.name}
                        </span>
                        <span className="text-dash-text-muted text-xs mt-0.5">
                          {s.duration} min · R${" "}
                          {s.price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                      <Toggle
                        checked={selected.has(s.id)}
                        onChange={() => toggle(s.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          {categories.size === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-dash-text-muted text-sm">Nenhum serviço encontrado</p>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dash-bg/95 backdrop-blur-md border-t border-dash-border z-50">
        <div className="max-w-md mx-auto">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className={`w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              saved
                ? "bg-dash-surface text-dash-primary"
                : "bg-dash-primary text-white"
            }`}
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={18} /> Alterações salvas!
                </motion.span>
              ) : saving ? (
                <motion.span
                  key="saving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Salvando...
                </motion.span>
              ) : (
                <motion.span
                  key="save"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Save size={18} /> Salvar Alterações
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
