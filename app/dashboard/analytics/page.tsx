"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Check,
  X,
  DollarSign,
  Calendar,
  ChevronRight,
  Award,
} from "lucide-react";
import Link from "next/link";
import { Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});
const mono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

type Period = "day" | "month" | "year";

const REVENUE_DATA: Record<
  Period,
  { label: string; value: number }[]
> = {
  day: [
    { label: "08h", value: 120 },
    { label: "10h", value: 280 },
    { label: "12h", value: 85 },
    { label: "14h", value: 350 },
    { label: "16h", value: 420 },
    { label: "18h", value: 190 },
  ],
  month: [
    { label: "01", value: 820 },
    { label: "05", value: 1240 },
    { label: "10", value: 980 },
    { label: "15", value: 1580 },
    { label: "20", value: 1320 },
    { label: "25", value: 1890 },
    { label: "30", value: 2100 },
  ],
  year: [
    { label: "Jan", value: 8200 },
    { label: "Fev", value: 9400 },
    { label: "Mar", value: 7800 },
    { label: "Abr", value: 11200 },
    { label: "Mai", value: 10500 },
    { label: "Jun", value: 12540 },
    { label: "Jul", value: 9800 },
    { label: "Ago", value: 13200 },
    { label: "Set", value: 11800 },
    { label: "Out", value: 14200 },
    { label: "Nov", value: 12540 },
    { label: "Dez", value: 0 },
  ],
};

const TOTALS: Record<Period, number> = {
  day: 1445,
  month: 12540,
  year: 121180,
};
const GROWTH: Record<Period, string> = {
  day: "+8.2%",
  month: "+12.5%",
  year: "+24.1%",
};

const TOP_CLIENTS = [
  {
    name: "Mariana Silva",
    visits: 8,
    value: 1250,
    growth: 12,
    rank: 1,
    color: "#F59E0B",
  },
  {
    name: "Ricardo Alves",
    visits: 5,
    value: 980,
    growth: 0,
    rank: 2,
    color: "#94A3B8",
  },
  {
    name: "Carlos Mendes",
    visits: 4,
    value: 760,
    growth: -3,
    rank: 3,
    color: "#CD7C3F",
  },
];

const STAFF = [
  { name: "João Silva", appointments: 92, value: 6400, pct: 85, target: 90 },
  { name: "Lucas Barros", appointments: 54, value: 4140, pct: 60, target: 65 },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dash-surface border border-dash-border rounded-xl px-3 py-2 shadow-xl">
      <p className="text-dash-text-muted text-xs mb-0.5">{label}</p>
      <p className="text-dash-primary font-bold text-sm">
        R$ {payload[0].value.toLocaleString("pt-BR")}
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month");

  const data = REVENUE_DATA[period];
  const total = TOTALS[period];
  const growth = GROWTH[period];

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4 },
    }),
  };

  return (
    <div className={`${jakarta.variable} ${mono.variable} font-[family-name:var(--font-jakarta)] min-h-screen bg-dash-bg text-dash-text pb-28`}>
      <DashboardPageHeader
        title="Estatísticas"
        right={<button type="button" className="p-2"><Calendar size={18} className="text-dash-text-muted" /></button>}
      />

      <main className="max-w-md mx-auto">
        <div className="px-4 py-4">
          <div className="flex h-11 bg-white/5 rounded-xl p-1 gap-1">
            {(["day", "month", "year"] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`flex-1 rounded-lg text-sm font-semibold transition-all ${
                  period === p
                    ? "bg-[#13ec5b] text-[#102216]"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {p === "day" ? "Dia" : p === "month" ? "Mês" : "Ano"}
              </button>
            ))}
          </div>
        </div>

        <motion.section
          key={period}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 mb-5"
        >
          <div className="bg-[#193322] border border-[#326744]/40 rounded-2xl p-5">
            <div className="mb-5">
              <p className="text-white/40 text-xs font-semibold mb-1">
                Receita Total
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-extrabold tracking-tight font-[family-name:var(--font-mono)] text-white`}
                >
                  R$ {total.toLocaleString("pt-BR")}
                </span>
                <span className="text-[#13ec5b] text-sm font-bold flex items-center gap-0.5">
                  <TrendingUp size={14} />
                  {growth}
                </span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#13ec5b"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="#13ec5b"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{
                      fill: "rgba(255,255,255,0.3)",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "rgba(255,255,255,0.2)",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#13ec5b"
                    strokeWidth={2.5}
                    fill="url(#grad)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#13ec5b",
                      strokeWidth: 0,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#13ec5b]" />
                <span className="text-xs text-white/40">Receita</span>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="px-4 mb-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Comparecimento",
                value: "94%",
                delta: "+2.1%",
                icon: Check,
                positive: true,
              },
              {
                label: "Cancelamento",
                value: "3.2%",
                delta: "-0.5%",
                icon: X,
                positive: false,
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="bg-[#193322] border border-[#326744]/40 rounded-2xl p-4"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                      s.positive ? "bg-[#13ec5b]/15" : "bg-red-500/15"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={
                        s.positive ? "text-[#13ec5b]" : "text-red-400"
                      }
                    />
                  </div>
                  <p className="text-white/40 text-xs font-semibold mb-1">
                    {s.label}
                  </p>
                  <p className="text-white text-xl font-extrabold font-[family-name:var(--font-mono)]">
                    {s.value}
                  </p>
                  <p
                    className={`text-[10px] font-bold mt-1 flex items-center gap-0.5 ${
                      s.positive ? "text-[#13ec5b]" : "text-red-400"
                    }`}
                  >
                    {s.positive ? (
                      <TrendingUp size={10} />
                    ) : (
                      <TrendingDown size={10} />
                    )}
                    {s.delta}
                  </p>
                </motion.div>
              );
            })}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              className="col-span-2 bg-[#193322] border border-[#326744]/40 rounded-2xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign size={13} className="text-[#13ec5b]/60" />
                  <p className="text-white/40 text-xs font-semibold">
                    Faturamento Bruto
                  </p>
                </div>
                <p className="text-white text-xl font-extrabold font-[family-name:var(--font-mono)]">
                  R$ {total.toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#13ec5b] text-xs font-bold mb-2">
                  {growth} vs anterior
                </p>
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="h-full bg-[#13ec5b] rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mb-5">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-lg font-bold">Top Clientes</h2>
            <button
              type="button"
              className="text-[#13ec5b] text-sm font-semibold flex items-center gap-1"
            >
              Ver todos <ChevronRight size={14} />
            </button>
          </div>

          <div className="px-4 space-y-2">
            {TOP_CLIENTS.map((c, i) => (
              <motion.div
                key={c.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex items-center gap-3 bg-[#193322] border border-[#326744]/40 p-3 rounded-xl"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-white text-sm">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div
                    className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[#193322]"
                    style={{
                      backgroundColor: c.color,
                      color: "#102216",
                    }}
                  >
                    {c.rank}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">
                    {c.name}
                  </p>
                  <p className="text-white/35 text-xs">
                    {c.visits} visitas este mês
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-white">
                    R$ {c.value.toLocaleString("pt-BR")}
                  </p>
                  {c.growth > 0 ? (
                    <p className="text-[#13ec5b] text-[10px] font-bold flex items-center justify-end gap-0.5">
                      <TrendingUp size={10} /> {c.growth}%
                    </p>
                  ) : c.growth < 0 ? (
                    <p className="text-red-400 text-[10px] font-bold flex items-center justify-end gap-0.5">
                      <TrendingDown size={10} /> {Math.abs(c.growth)}%
                    </p>
                  ) : (
                    <p className="text-white/30 text-[10px] font-bold">
                      Estável
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-lg font-bold">Performance Staff</h2>
            <Award size={18} className="text-[#13ec5b]/50" />
          </div>

          <div className="px-4 space-y-4">
            {STAFF.map((s, i) => (
              <motion.div
                key={s.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#13ec5b]/20 to-white/5 flex items-center justify-center text-[11px] font-bold text-[#13ec5b]">
                      {s.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {s.name}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      s.pct >= s.target ? "text-[#13ec5b]" : "text-white/50"
                    }`}
                  >
                    R$ {s.value.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        s.pct >= s.target ? "#13ec5b" : "rgba(19,236,91,0.35)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <p className="text-[10px] text-white/30">
                    {s.appointments} agendamentos
                  </p>
                  <p className="text-[10px] text-white/30">
                    Meta: {s.target}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
