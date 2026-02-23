"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  X,
  Check,
  Info,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { supabase } from "@/lib/supabase/client";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

function formatPrice(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

const DURATION_OPTIONS = [15, 20, 25, 30, 45, 60, 75, 90, 120];

function ServiceModal({
  service,
  onSave,
  onClose,
}: {
  service: Service | null;
  onSave: (s: Omit<Service, "id">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(service?.name ?? "");
  const [price, setPrice] = useState(String(service?.price ?? ""));
  const [duration, setDuration] = useState(String(service?.duration ?? "30"));

  const valid =
    name.trim().length >= 2 && Number(price) >= 0 && Number(duration) > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-[#102216] w-full max-w-md rounded-t-3xl border-t border-white/10 pb-safe"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between px-5 pb-4 border-b border-white/8">
          <h2 className="text-lg font-bold">
            {service ? "Editar Serviço" : "Novo Serviço"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-white/8"
          >
            <X size={16} className="text-white/60" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
              Nome do Serviço
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Corte Social"
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/25 text-[15px] font-medium focus:outline-none focus:border-[#13ec5b]/60 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Preço (R$)
              </label>
              <div className="relative">
                <DollarSign
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#13ec5b]/60"
                />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  min={0}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 text-white placeholder:text-white/25 text-[15px] font-medium focus:outline-none focus:border-[#13ec5b]/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Duração
              </label>
              <div className="relative">
                <Clock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#13ec5b]/60 z-10"
                />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-8 pr-8 text-white text-[15px] font-medium focus:outline-none focus:border-[#13ec5b]/60 transition-all appearance-none"
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option
                      key={d}
                      value={d}
                      className="bg-[#102216]"
                    >
                      {formatDuration(d)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              valid &&
              onSave({
                name: name.trim(),
                price: Number(price),
                duration: Number(duration),
              })
            }
            disabled={!valid}
            className={`w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              valid
                ? "bg-[#13ec5b] text-[#102216]"
                : "bg-white/8 text-white/25 cursor-not-allowed"
            }`}
          >
            <Check size={18} />
            {service ? "Salvar Alterações" : "Adicionar Serviço"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirm({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#193322] border border-white/10 rounded-2xl p-6 w-full max-w-sm"
      >
        <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-center mb-2">
          Remover serviço?
        </h3>
        <p className="text-sm text-white/50 text-center mb-6">
          &quot;<span className="text-white font-medium">{name}</span>&quot; será
          removido da sua lista. Agendamentos existentes não serão afetados.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl border border-white/10 font-semibold text-white/60 hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-12 rounded-xl bg-red-500/20 border border-red-500/30 font-bold text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Remover
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [modal, setModal] = useState<"add" | Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    if (!supabase) return;
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
    setUserId(userRow.id);
    const { data } = await supabase
      .from("services")
      .select("id, name, price, duration_minutes")
      .eq("user_id", userRow.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true });
    setServices(
      (data ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        price: Number(s.price ?? 0),
        duration: s.duration_minutes ?? 30,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSave = async (data: Omit<Service, "id">) => {
    if (!supabase || !userId) return;
    try {
      if (modal === "add") {
        await supabase.from("services").insert({
          user_id: userId,
          name: data.name,
          price: data.price,
          duration_minutes: data.duration,
          is_active: true,
        });
      } else if (modal && typeof modal === "object") {
        await supabase
          .from("services")
          .update({
            name: data.name,
            price: data.price,
            duration_minutes: data.duration,
            updated_at: new Date().toISOString(),
          })
          .eq("id", modal.id);
      }
      await loadServices();
      setModal(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Tente novamente.");
    }
  };

  const handleDelete = async (s: Service) => {
    if (!supabase) return;
    try {
      await supabase
        .from("services")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", s.id);
      setServices((prev) => prev.filter((x) => x.id !== s.id));
      setDeleting(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover. Tente novamente.");
    }
  };

  return (
    <div
      className={`${jakarta.variable} font-[family-name:var(--font-jakarta)] bg-[#102216] min-h-screen text-white pb-28`}
    >
      <header className="sticky top-0 z-50 bg-[#102216]/85 backdrop-blur-md border-b border-white/8">
        <div className="flex items-center px-4 h-14 justify-between max-w-md mx-auto">
          <Link
            href="/dashboard"
            className="h-10 w-10 flex items-center justify-start"
          >
            <ArrowLeft size={22} className="text-white/70" />
          </Link>
          <h1 className="text-base font-bold">Gestão de Serviços</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setModal("add")}
          className="w-full h-14 bg-[#13ec5b] text-[#102216] font-bold rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(19,236,91,0.15)] mb-7"
        >
          <Plus size={20} strokeWidth={2.5} />
          Adicionar Novo Serviço
        </motion.button>

        <p className="text-xs font-bold uppercase tracking-wider text-[#13ec5b]/60 mb-4">
          Seus Serviços ({services.length})
        </p>

        {loading ? (
          <p className="text-white/50 text-sm">Carregando...</p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {services.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                  className="bg-[#193322] border border-[#326744]/50 p-5 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white mb-1.5 truncate">
                      {s.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-[#13ec5b] font-bold text-lg leading-none">
                        {formatPrice(s.price)}
                      </span>
                      <div className="flex items-center gap-1 text-white/40 text-sm">
                        <Clock size={13} />
                        <span>{formatDuration(s.duration)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 ml-3">
                    <button
                      type="button"
                      onClick={() => setModal(s)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-[#13ec5b] transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(s)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500/15 text-white/50 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-8 p-4 bg-[#13ec5b]/5 rounded-2xl border border-[#13ec5b]/10 flex items-start gap-3">
          <Info size={18} className="text-[#13ec5b] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-white mb-1">
              Dica do Agenndar
            </p>
            <p className="text-xs text-white/45 leading-relaxed">
              Combine serviços populares em &quot;Combos&quot; para incentivar
              seus clientes a agendar pacotes completos e aumentar seu ticket
              médio.
            </p>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {(modal === "add" || (modal && typeof modal === "object")) && (
          <ServiceModal
            service={modal === "add" ? null : (modal as Service)}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
        {deleting && (
          <DeleteConfirm
            name={deleting.name}
            onConfirm={() => handleDelete(deleting)}
            onCancel={() => setDeleting(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
