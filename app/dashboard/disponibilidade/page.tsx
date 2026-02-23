"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Copy,
  HelpCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus_Jakarta_Sans } from "next/font/google";
import { supabase } from "@/lib/supabase/client";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

interface Break {
  id: string;
  start: string;
  end: string;
}

interface DayConfig {
  startTime: string;
  endTime: string;
  breaks: Break[];
  isOff: boolean;
}

function defaultConfig(): DayConfig {
  return {
    startTime: "09:00",
    endTime: "19:00",
    breaks: [{ id: "1", start: "12:00", end: "13:00" }],
    isOff: false,
  };
}

function BreakCard({
  brk,
  onUpdate,
  onDelete,
}: {
  brk: Break;
  onUpdate: (id: string, field: "start" | "end", value: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 bg-[#193322]/50 p-4 rounded-xl border border-dashed border-[#326744]/70"
    >
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-[9px] uppercase font-bold text-white/30 mb-1">
            Início
          </p>
          <input
            type="time"
            value={brk.start}
            onChange={(e) => onUpdate(brk.id, "start", e.target.value)}
            className="bg-transparent text-white font-semibold text-sm focus:outline-none w-full"
          />
        </div>
        <ChevronRight size={14} className="text-white/20 shrink-0" />
        <div className="flex-1">
          <p className="text-[9px] uppercase font-bold text-white/30 mb-1">
            Fim
          </p>
          <input
            type="time"
            value={brk.end}
            onChange={(e) => onUpdate(brk.id, "end", e.target.value)}
            className="bg-transparent text-white font-semibold text-sm focus:outline-none w-full"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDelete(brk.id)}
        className="text-white/25 hover:text-red-400 transition-colors shrink-0"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}

export default function DisponibilidadePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [configs, setConfigs] = useState<Record<string, DayConfig>>({});
  const [buffer, setBuffer] = useState(15);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busyDays, setBusyDays] = useState<number[]>([]);

  const today = startOfDay(new Date());

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
        .then(({ data: u }) => {
          if (u?.id) setUserId(u.id);
        });
    });
  }, []);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });
    const firstDow = getDay(start);
    return { allDays, firstDow };
  }, [currentMonth]);

  const dateKey = (d: Date) => format(d, "yyyy-MM-dd");

  const getConfig = (d: Date): DayConfig =>
    configs[dateKey(d)] ?? defaultConfig();

  const updateConfig = (d: Date, patch: Partial<DayConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [dateKey(d)]: { ...getConfig(d), ...patch },
    }));
  };

  const cfg = getConfig(selectedDate);

  const updateBreak = (id: string, field: "start" | "end", value: string) => {
    const newBreaks = cfg.breaks.map((b) =>
      b.id === id ? { ...b, [field]: value } : b
    );
    updateConfig(selectedDate, { breaks: newBreaks });
  };
  const addBreak = () => {
    updateConfig(selectedDate, {
      breaks: [
        ...cfg.breaks,
        {
          id: Date.now().toString(),
          start: "15:00",
          end: "15:30",
        },
      ],
    });
  };
  const deleteBreak = (id: string) => {
    updateConfig(selectedDate, {
      breaks: cfg.breaks.filter((b) => b.id !== id),
    });
  };

  const handleSave = async () => {
    const db = supabase;
    if (!db || !userId) return;
    setSaving(true);
    try {
      const key = dateKey(selectedDate);
      const c = configs[key] ?? defaultConfig();
      const dayOfWeek = getDay(selectedDate);

      if (c.isOff) {
        await db.from("availability_overrides").upsert(
          {
            user_id: userId,
            date: key,
            is_available: false,
            start_time: null,
            end_time: null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,date" }
        );
      } else {
        await db.from("availability_overrides").upsert(
          {
            user_id: userId,
            date: key,
            is_available: true,
            start_time: c.startTime,
            end_time: c.endTime,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,date" }
        );
      }

      const { data: settings } = await db
        .from("user_settings")
        .select("id")
        .eq("user_id", userId)
        .single();
      if (settings?.id) {
        await db
          .from("user_settings")
          .update({ buffer_minutes: buffer, updated_at: new Date().toISOString() })
          .eq("id", settings.id);
      } else {
        await db.from("user_settings").insert({
          user_id: userId,
          buffer_minutes: buffer,
        });
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

  const handleApplyAll = async () => {
    const db = supabase;
    if (!db || !userId) return;
    const dayOfWeek = getDay(selectedDate);
    const c = configs[dateKey(selectedDate)] ?? defaultConfig();
    if (c.isOff) {
      alert("Marque o dia como aberto antes de aplicar a todos.");
      return;
    }
    try {
      await db.from("availability").upsert(
        {
          user_id: userId,
          day_of_week: dayOfWeek,
          start_time: c.startTime,
          end_time: c.endTime,
          is_available: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,day_of_week" }
      );
      alert("Configuração aplicada a todos os dias da semana!");
    } catch (err) {
      console.error(err);
      alert("Erro ao aplicar. Tente novamente.");
    }
  };

  const selectedLabel = format(selectedDate, "EEEE, dd MMM", { locale: ptBR });

  return (
    <div
      className={`${jakarta.variable} font-[family-name:var(--font-jakarta)] bg-[#102216] min-h-screen text-white pb-32`}
    >
      <header className="sticky top-0 z-50 bg-[#102216]/85 backdrop-blur-md border-b border-white/8">
        <div className="flex items-center px-4 h-14 justify-between max-w-md mx-auto">
          <Link
            href="/dashboard"
            className="h-10 w-10 flex items-center justify-start"
          >
            <ArrowLeft size={22} className="text-white/70" />
          </Link>
          <h1 className="text-base font-bold">Configurar Disponibilidade</h1>
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center"
          >
            <HelpCircle size={18} className="text-white/40" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <div className="p-4">
          <div className="bg-[#193322] border border-[#326744]/50 rounded-2xl p-3">
            <div className="flex items-center justify-between px-2 py-2 mb-1">
              <button
                type="button"
                onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/8 transition-colors"
              >
                <ChevronLeft size={18} className="text-white/60" />
              </button>
              <p className="font-bold text-sm capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </p>
              <button
                type="button"
                onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/8 transition-colors"
              >
                <ChevronRight size={18} className="text-white/60" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center mb-1">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                <p
                  key={i}
                  className="text-[10px] font-bold text-white/30 py-2"
                >
                  {d}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-7 text-center">
              {Array.from({ length: days.firstDow }).map((_, i) => (
                <div key={`empty-${i}`} className="h-11" />
              ))}

              {days.allDays.map((day) => {
                const isPast =
                  isBefore(day, today) && !isToday(day);
                const isSelected = isSameDay(day, selectedDate);
                const dayConfig = configs[dateKey(day)];
                const isOff = dayConfig?.isOff ?? false;

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => !isPast && setSelectedDate(day)}
                    disabled={isPast}
                    className={`h-11 relative flex items-center justify-center text-sm font-medium transition-all ${
                      isPast
                        ? "text-white/15 cursor-default"
                        : isSelected
                        ? "text-[#102216]"
                        : isOff
                        ? "text-white/25"
                        : "text-white hover:bg-white/8"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="cal-sel"
                        className="absolute inset-1 rounded-xl bg-[#13ec5b]"
                        transition={{
                          type: "spring",
                          damping: 28,
                          stiffness: 300,
                        }}
                      />
                    )}
                    {isToday(day) && !isSelected && (
                      <div className="absolute inset-1 rounded-xl border border-[#13ec5b]/40 bg-[#13ec5b]/8" />
                    )}
                    <span className="relative z-10 font-semibold">
                      {format(day, "d")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold capitalize">
              {selectedLabel}
            </h2>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                  cfg.isOff
                    ? "bg-red-500/15 text-red-400"
                    : "bg-[#13ec5b]/15 text-[#13ec5b]"
                }`}
              >
                {cfg.isOff ? "Folga" : "Aberto"}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateConfig(selectedDate, { isOff: !cfg.isOff })
                }
                className={`h-7 px-3 rounded-lg text-[11px] font-bold border transition-colors ${
                  cfg.isOff
                    ? "border-[#13ec5b]/30 text-[#13ec5b] hover:bg-[#13ec5b]/10"
                    : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                }`}
              >
                {cfg.isOff ? "Marcar aberto" : "Marcar folga"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {!cfg.isOff && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    {
                      label: "Entrada",
                      field: "startTime" as const,
                      value: cfg.startTime,
                    },
                    {
                      label: "Saída",
                      field: "endTime" as const,
                      value: cfg.endTime,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-[#193322] border border-[#326744]/50 rounded-xl p-4"
                    >
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">
                        {item.label}
                      </p>
                      <input
                        type="time"
                        value={item.value}
                        onChange={(e) =>
                          updateConfig(selectedDate, {
                            [item.field]: e.target.value,
                          })
                        }
                        className="bg-transparent text-white text-lg font-bold focus:outline-none w-full"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-[#193322] border border-[#326744]/50 rounded-xl p-4 flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Clock size={13} className="text-[#13ec5b]/60" />
                      <p className="text-sm font-semibold text-white">
                        Buffer de Atendimento
                      </p>
                    </div>
                    <p className="text-xs text-white/35">
                      Intervalo entre agendamentos
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBuffer((b) => Math.max(0, b - 5))}
                      className="w-8 h-8 rounded-full border border-[#326744] flex items-center justify-center text-white/60 hover:bg-white/8 transition-colors"
                    >
                      <span className="text-lg leading-none">−</span>
                    </button>
                    <span className="text-white font-bold w-14 text-center text-sm">
                      {buffer === 0 ? "Sem" : `${buffer} min`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBuffer((b) => Math.min(60, b + 5))}
                      className="w-8 h-8 rounded-full border border-[#326744] bg-[#13ec5b] flex items-center justify-center text-[#102216] font-bold transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold">Pausas e Intervalos</h3>
                    <button
                      type="button"
                      onClick={addBreak}
                      className="flex items-center gap-1 text-[#13ec5b] text-sm font-bold"
                    >
                      <Plus size={15} /> Nova Pausa
                    </button>
                  </div>

                  <div className="space-y-2">
                    <AnimatePresence>
                      {cfg.breaks.map((b) => (
                        <BreakCard
                          key={b.id}
                          brk={b}
                          onUpdate={updateBreak}
                          onDelete={deleteBreak}
                        />
                      ))}
                    </AnimatePresence>
                    {cfg.breaks.length === 0 && (
                      <p className="text-center text-white/25 text-sm py-4">
                        Nenhuma pausa configurada
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyAll}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-[#13ec5b]/20 text-[#13ec5b] font-bold hover:bg-[#13ec5b]/5 transition-colors text-sm mb-2"
                >
                  <Copy size={15} />
                  Aplicar a todos os dias da semana
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#102216]/95 backdrop-blur-md border-t border-white/8 z-50">
        <div className="max-w-md mx-auto">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className={`w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              saved
                ? "bg-white/8 text-[#13ec5b]"
                : "bg-[#13ec5b] text-[#102216] shadow-[0_0_24px_rgba(19,236,91,0.2)]"
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
                  <Check size={18} /> Configurações salvas!
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
                    className="w-4 h-4 border-2 border-[#102216]/30 border-t-[#102216] rounded-full"
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
                  <Check size={18} /> Salvar Configurações
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
