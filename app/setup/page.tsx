"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  Building2,
  Scissors,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Shield,
  Sparkles,
  Zap,
  ChevronRight,
  Clock,
  BarChart3,
  Star,
} from "lucide-react";
import { Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import { supabase } from "@/lib/supabase/client";

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

// ─── Pricing logic (mirror server-side in production) ─────────────────────
// Users never see tier names — only final price + infra description
type PricingTier = "starter" | "growth" | "pro" | "scale";

interface PricingResult {
  tier: PricingTier;
  monthlyPrice: number;
  infrastructure: string;
  highlight: string;
  features: { title: string; sub: string }[];
}

function calculatePlan(
  teamSize: string,
  dailyVolume: number,
  avgTicket: number
): PricingResult {
  const collaborators =
    teamSize === "1" ? 1 : teamSize === "2-5" ? 3 : 7;
  const load = collaborators * dailyVolume;

  if (load <= 10 && avgTicket < 80) {
    return {
      tier: "starter",
      monthlyPrice: 49.9,
      infrastructure: "Infraestrutura compartilhada otimizada",
      highlight: "Ideal para quem está começando a digitalizar o negócio",
      features: [
        { title: "Agendamentos ilimitados", sub: "Sem limite de marcações por mês" },
        { title: "Página pública personalizada", sub: "Seu link profissional para clientes" },
        { title: "Notificações automáticas", sub: "Push e alertas em tempo real" },
      ],
    };
  }
  if (load <= 30 && avgTicket < 200) {
    return {
      tier: "growth",
      monthlyPrice: 89.9,
      infrastructure: "Infraestrutura dedicada com alta disponibilidade",
      highlight: "Para negócios em crescimento que não podem parar",
      features: [
        { title: "Tudo do plano anterior", sub: "Mais recursos incluídos" },
        { title: "Analytics completo 90 dias", sub: "Histórico detalhado por cliente e serviço" },
        { title: "Relatórios exportáveis", sub: "CSV e PDF com dados financeiros" },
      ],
    };
  }
  if (load <= 70) {
    return {
      tier: "pro",
      monthlyPrice: 149.9,
      infrastructure: "Infraestrutura dedicada de alta performance",
      highlight: "Para equipes consolidadas com volume expressivo",
      features: [
        { title: "Tudo do plano anterior", sub: "Recursos completos incluídos" },
        { title: "Colaboradores ilimitados", sub: "Cadastre toda a equipe sem restrições" },
        { title: "Suporte prioritário", sub: "Atendimento em até 2h via WhatsApp" },
      ],
    };
  }
  return {
    tier: "scale",
    monthlyPrice: 229.9,
    infrastructure: "Infraestrutura enterprise com SLA garantido",
    highlight: "Para operações de alto volume com exigência máxima",
    features: [
      { title: "Tudo do plano anterior", sub: "Suite completa de recursos" },
      { title: "SLA 99.9% de uptime", sub: "Garantia contratual de disponibilidade" },
      { title: "Gerente de conta dedicado", sub: "Acompanhamento personalizado do negócio" },
    ],
  };
}

// Map internal tier to DB enum (starter|growth|enterprise)
function tierToDb(tier: PricingTier): "starter" | "growth" | "enterprise" {
  if (tier === "starter") return "starter";
  if (tier === "growth") return "growth";
  return "enterprise"; // pro | scale
}

// ─── Types ───────────────────────────────────────────────────────────────

interface OnboardingData {
  businessName: string;
  phone: string;
  teamSize: string;
  dailyVolume: number;
  avgTicket: number;
}

// ─── Step indicator ──────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor:
              i <= current ? "#13ec5b" : "rgba(255,255,255,0.15)",
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

// ─── Page wrapper ────────────────────────────────────────────────────────

function StepPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col flex-1 min-h-0"
    >
      {children}
    </motion.div>
  );
}

// ─── STEP 1: Business Info ───────────────────────────────────────────────

function Step1({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (k: keyof OnboardingData, v: string) => void;
  onNext: () => void;
}) {
  const valid =
    data.businessName.trim().length >= 2 && data.phone.trim().length >= 10;

  return (
    <StepPage>
      <div className="px-6 pt-4 pb-6">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-white mb-2">
          Vamos configurar
          <br />
          seu espaço
        </h1>
        <p className="text-sm text-white/50 leading-relaxed">
          Preencha os dados básicos para criar sua página pública e começar a
          receber agendamentos.
        </p>
      </div>

      <div className="flex flex-col gap-4 px-6 flex-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            Nome do Negócio
          </label>
          <div className="relative">
            <Scissors
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              value={data.businessName}
              onChange={(e) => onChange("businessName", e.target.value)}
              placeholder="Ex: Barbearia do João"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white placeholder:text-white/25 text-[15px] font-medium focus:outline-none focus:border-[#13ec5b]/60 focus:bg-white/8 transition-all"
            />
          </div>
          {data.businessName.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] text-[#13ec5b]/70 font-medium pl-1"
            >
              agenndar.com.br/
              {data.businessName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
            </motion.p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            WhatsApp de Contato
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+55 (11) 99999-9999"
            className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/25 text-[15px] font-medium focus:outline-none focus:border-[#13ec5b]/60 focus:bg-white/8 transition-all"
          />
          <p className="text-[11px] text-white/30 pl-1">
            Usado para suporte e confirmações — nunca compartilhado com clientes
          </p>
        </div>
      </div>

      <div className="px-6 pt-6 pb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={!valid}
          className={`w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            valid
              ? "bg-[#13ec5b] text-[#102216] shadow-[0_0_24px_rgba(19,236,91,0.25)]"
              : "bg-white/8 text-white/25 cursor-not-allowed"
          }`}
        >
          Continuar <ArrowRight size={18} />
        </motion.button>

        <div className="flex items-center justify-center gap-2 mt-5">
          <Shield size={13} className="text-[#13ec5b]/50" />
          <p className="text-[11px] text-white/30">
            Seus dados estão protegidos e criptografados
          </p>
        </div>
      </div>
    </StepPage>
  );
}

// ─── STEP 2: Team Size ───────────────────────────────────────────────────

function Step2({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (k: keyof OnboardingData, v: string) => void;
  onNext: () => void;
}) {
  const options = [
    {
      value: "1",
      label: "Trabalho sozinho(a)",
      sub: "Sou o único profissional do espaço",
      icon: User,
    },
    {
      value: "2-5",
      label: "2 a 5 profissionais",
      sub: "Tenho uma equipe pequena",
      icon: Users,
    },
    {
      value: "5+",
      label: "Mais de 5 profissionais",
      sub: "Equipe consolidada ou em expansão",
      icon: Building2,
    },
  ];

  return (
    <StepPage>
      <div className="px-6 pt-4 pb-6">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-white mb-2">
          Como é a estrutura
          <br />
          do seu negócio?
        </h1>
        <p className="text-sm text-white/50 leading-relaxed">
          Isso nos ajuda a preparar a infraestrutura certa para o volume que você
          vai gerar.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-6 flex-1">
        {options.map((opt) => {
          const Icon = opt.icon;
          const selected = data.teamSize === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange("teamSize", opt.value)}
              className={`relative flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                selected
                  ? "border-[#13ec5b]/50 bg-[rgba(19,236,91,0.08)]"
                  : "border-white/8 bg-white/4 hover:bg-white/8"
              }`}
            >
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  selected ? "bg-[#13ec5b] text-[#102216]" : "bg-white/8 text-white/50"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <p
                  className={`font-semibold text-[15px] ${
                    selected ? "text-white" : "text-white/80"
                  }`}
                >
                  {opt.label}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{opt.sub}</p>
              </div>
              <div
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected ? "border-[#13ec5b] bg-[#13ec5b]" : "border-white/20"
                }`}
              >
                {selected && (
                  <CheckCircle2 size={12} className="text-[#102216]" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="px-6 pt-6 pb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={!data.teamSize}
          className={`w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            data.teamSize
              ? "bg-[#13ec5b] text-[#102216] shadow-[0_0_24px_rgba(19,236,91,0.25)]"
              : "bg-white/8 text-white/25 cursor-not-allowed"
          }`}
        >
          Continuar <ArrowRight size={18} />
        </motion.button>
      </div>
    </StepPage>
  );
}

// ─── STEP 3: Volume & Ticket ─────────────────────────────────────────────

function Step3({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (k: keyof OnboardingData, v: number) => void;
  onNext: () => void;
}) {
  return (
    <StepPage>
      <div className="px-6 pt-4 pb-6">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-white mb-2">
          Conte um pouco
          <br />
          sobre seu movimento
        </h1>
        <p className="text-sm text-white/50 leading-relaxed">
          Com essas informações, preparamos a capacidade ideal para o seu negócio
          funcionar sem travamentos.
        </p>
      </div>

      <div className="flex flex-col gap-5 px-6 flex-1">
        <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-[#13ec5b]/15 flex items-center justify-center shrink-0">
              <Clock size={16} className="text-[#13ec5b]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">
                Quantos atendimentos você faz por dia?
              </p>
              <p className="text-xs text-white/35 mt-0.5">
                Em média, considerando todos os profissionais
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span
              className={`text-5xl font-extrabold tracking-tight font-[family-name:var(--font-mono)] text-[#13ec5b]`}
            >
              {data.dailyVolume}
            </span>
            <span className="text-lg text-white/30 font-medium ml-1">
              atend./dia
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={80}
            step={1}
            value={data.dailyVolume}
            onChange={(e) => onChange("dailyVolume", Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#13ec5b] bg-white/10"
          />
          <div className="flex justify-between text-[11px] text-white/25 font-medium mt-2">
            <span>1</span>
            <span>80+</span>
          </div>
        </div>

        <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-[#13ec5b]/15 flex items-center justify-center shrink-0">
              <BarChart3 size={16} className="text-[#13ec5b]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">
                Qual o valor médio por serviço?
              </p>
              <p className="text-xs text-white/35 mt-0.5">
                O ticket médio cobrado por atendimento
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-2xl font-bold text-[#13ec5b]/70">R$</span>
            <span
              className={`text-5xl font-extrabold tracking-tight font-[family-name:var(--font-mono)] text-[#13ec5b]`}
            >
              {data.avgTicket}
            </span>
            <span className="text-lg text-white/30 font-medium">,00</span>
          </div>
          <input
            type="range"
            min={15}
            max={500}
            step={5}
            value={data.avgTicket}
            onChange={(e) => onChange("avgTicket", Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#13ec5b] bg-white/10"
          />
          <div className="flex justify-between text-[11px] text-white/25 font-medium mt-2">
            <span>R$ 15</span>
            <span>R$ 500+</span>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 pb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-[#13ec5b] text-[#102216] shadow-[0_0_24px_rgba(19,236,91,0.25)] transition-all"
        >
          Ver meu plano ideal <Sparkles size={17} />
        </motion.button>
      </div>
    </StepPage>
  );
}

// ─── STEP 4: Plan Result ──────────────────────────────────────────────────

function Step4({
  data,
  plan,
  onFinish,
  onFree,
  loading,
}: {
  data: OnboardingData;
  plan: PricingResult;
  onFinish: () => void;
  onFree: () => void;
  loading: boolean;
}) {
  return (
    <StepPage>
      <div className="px-6 pt-4 pb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#13ec5b]/20 to-[#13ec5b]/5 border border-[#13ec5b]/20 flex items-center justify-center">
            <Sparkles size={22} className="text-[#13ec5b]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#13ec5b] uppercase tracking-wider">
              Plano ideal encontrado
            </p>
            <h1 className="text-[22px] font-extrabold text-white leading-tight">
              Infraestrutura pronta para {data.businessName.split(" ")[0]}
            </h1>
          </div>
        </div>
        <p className="text-sm text-white/45 leading-relaxed">{plan.highlight}</p>
      </div>

      <div className="mx-6 flex-1">
        <div className="relative bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#13ec5b] px-3 py-1.5 rounded-bl-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#102216]">
              Recomendado
            </p>
          </div>

          <div className="p-5 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-[#13ec5b]" />
              <p className="text-xs font-semibold text-[#13ec5b]">
                {plan.infrastructure}
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mb-5">
              {plan.features.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#13ec5b]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={11} className="text-[#13ec5b]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Investimento mensal</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-extrabold text-white">
                    R$ {plan.monthlyPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <p className="text-[11px] text-white/30 mt-0.5">
                  ≈ R$ {(plan.monthlyPrice / 30).toFixed(2).replace(".", ",")}{" "}
                  por dia de operação
                </p>
              </div>
              <div className="text-right">
                <div className="bg-[#13ec5b]/10 border border-[#13ec5b]/20 rounded-xl px-3 py-2">
                  <p className="text-[11px] font-bold text-[#13ec5b]">
                    7 dias grátis
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    sem cartão de crédito
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 px-1">
          <div className="flex items-center gap-1.5">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white/40">4.9/5 de satisfação</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Shield size={12} className="text-[#13ec5b]/60" />
            <span className="text-xs text-white/40">Garantia de 7 dias</span>
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 pb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onFinish}
          disabled={loading}
          className="w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-[#13ec5b] text-[#102216] shadow-[0_4px_24px_rgba(19,236,91,0.3)] transition-all disabled:opacity-50"
        >
          {loading
            ? "Salvando..."
            : "Começar agora — 7 dias grátis"}{" "}
          <ChevronRight size={18} />
        </motion.button>
        <button
          type="button"
          onClick={onFree}
          disabled={loading}
          className="w-full h-11 mt-2 rounded-xl text-sm text-white/30 hover:text-white/50 transition-colors flex items-center justify-center disabled:opacity-50"
        >
          Continuar com o plano básico gratuito
        </button>
      </div>
    </StepPage>
  );
}

// ─── Slug helper ──────────────────────────────────────────────────────────

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return base || "meu-negocio";
}

// ─── Main Onboarding ──────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    businessName: "",
    phone: "",
    teamSize: "",
    dailyVolume: 10,
    avgTicket: 80,
  });

  const setField = useCallback((k: keyof OnboardingData, v: string | number) => {
    setData((prev) => ({ ...prev, [k]: v }));
  }, []);

  const plan = calculatePlan(data.teamSize, data.dailyVolume, data.avgTicket);

  const saveAndRedirect = useCallback(
    async (skipPaidPlan: boolean) => {
      if (!supabase) {
        alert(
          "Configuração do Supabase não encontrada. Configure as variáveis de ambiente."
        );
        return;
      }

      setLoading(true);
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push("/login");
          return;
        }

        const slug = slugify(data.businessName);

        const { data: userRow, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("firebase_uid", authUser.id)
          .maybeSingle();

        if (userError) throw userError;

        let userId: string;

        if (userRow?.id) {
          userId = userRow.id;
          await supabase
            .from("users")
            .update({
              business_name: data.businessName.trim(),
              phone: data.phone.trim(),
              slug,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        } else {
          const uniqueSlug = slug + "-" + Date.now().toString(36);
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
              firebase_uid: authUser.id,
              email: authUser.email ?? "",
              business_name: data.businessName.trim(),
              phone: data.phone.trim(),
              slug: uniqueSlug,
            })
            .select("id")
            .single();
          if (insertError) throw insertError;
          if (!newUser?.id) throw new Error("Falha ao criar usuário");
          userId = newUser.id;
        }

        const { error: onboardingError } = await supabase
          .from("user_onboarding")
          .upsert(
            {
              user_id: userId,
              team_size: data.teamSize as "1" | "2-5" | "5+",
              daily_appointments: data.dailyVolume,
              average_ticket: data.avgTicket,
              recommended_plan: tierToDb(plan.tier),
              recommended_price: plan.monthlyPrice,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (onboardingError && onboardingError.code !== "42P01") {
          console.warn("user_onboarding upsert:", onboardingError);
        }

        router.push("/dashboard");
      } catch (err) {
        console.error("Onboarding save error:", err);
        alert("Erro ao salvar. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [data, plan.tier, plan.monthlyPrice, router]
  );

  const handleFinish = () => saveAndRedirect(false);
  const handleFree = () => saveAndRedirect(true);

  const totalSteps = 4;
  const stepLabel = [
    "Sobre o negócio",
    "Tamanho da equipe",
    "Volume de trabalho",
    "Seu plano",
  ][step];

  return (
    <div
      className={`${jakarta.variable} ${mono.variable} font-[family-name:var(--font-jakarta)] min-h-screen bg-[#102216] text-white flex flex-col lg:flex-row`}
    >
      {/* Painel visual — desktop: lateral esquerda; mobile: oculto */}
      <aside className="hidden lg:flex lg:w-[42%] xl:w-[45%] lg:min-h-screen flex-col relative overflow-hidden bg-gradient-to-br from-[#0d2818] via-[#102216] to-[#0a1f12]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(19,236,91,0.12),transparent)]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#13ec5b]/10 blur-[80px]" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-emerald-500/10 blur-[60px]" />
        {/* Formas decorativas */}
        <div className="absolute top-[15%] right-[20%] w-20 h-20 border border-white/10 rounded-2xl rotate-12" />
        <div className="absolute top-[45%] left-[15%] w-3 h-3 rounded-full bg-white/20" />
        <div className="absolute top-[55%] right-[25%] w-2 h-2 rounded-full bg-[#13ec5b]/40" />
        <div className="absolute bottom-[25%] left-[20%] w-24 h-24 border border-white/5 rounded-3xl -rotate-6" />
        <div className="absolute bottom-[35%] right-[15%] w-16 h-16 border border-white/8 rounded-xl rotate-12" />
        <div className="relative z-10 flex flex-col flex-1 justify-center px-12 xl:px-16 py-16">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="h-9 w-9 rounded-lg bg-[#13ec5b]/20 border border-[#13ec5b]/30 flex items-center justify-center">
              <Scissors size={18} className="text-[#13ec5b]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Agenndar</span>
          </div>
          <h2 className="text-2xl xl:text-3xl font-extrabold leading-tight tracking-tight text-white max-w-sm mb-4">
            Um ambiente pensado para o seu negócio crescer
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Em poucos passos você configura sua agenda, serviços e começa a receber agendamentos no celular dos seus clientes.
          </p>
        </div>
      </aside>

      {/* Coluna do formulário — vertical fino no desktop */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 lg:flex lg:items-center lg:justify-center lg:py-8">
        <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 lg:flex-initial lg:max-h-[90vh] lg:overflow-y-auto lg:shadow-xl lg:rounded-2xl lg:border lg:border-white/10 lg:bg-[#0d2316]">
          <div className="flex items-center justify-between px-4 pt-6 pb-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => step > 0 && setStep((s) => s - 1)}
              className={`h-10 w-10 flex items-center justify-start transition-opacity ${
                step === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <ArrowLeft size={22} className="text-white/70" />
            </button>

            <div className="flex flex-col items-center gap-1.5">
              <StepDots current={step} total={totalSteps} />
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                {stepLabel}
              </p>
            </div>

            <div className="w-10" />
          </div>

          <div
            className="flex flex-col flex-1 min-h-0 w-full"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 && (
                <Step1
                  key="s1"
                  data={data}
                  onChange={(k, v) => setField(k, v)}
                  onNext={() => setStep(1)}
                />
              )}
              {step === 1 && (
                <Step2
                  key="s2"
                  data={data}
                  onChange={(k, v) => setField(k, v)}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <Step3
                  key="s3"
                  data={data}
                  onChange={(k, v) => setField(k, v as number)}
                  onNext={() => setStep(3)}
                />
              )}
              {step === 3 && (
                <Step4
                  key="s4"
                  data={data}
                  plan={plan}
                  onFinish={handleFinish}
                  onFree={handleFree}
                  loading={loading}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
