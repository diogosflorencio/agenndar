"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  BadgeCheck,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Scissors,
  Users,
  Phone,
  User,
  CalendarCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  format,
  addDays,
  startOfDay,
  isBefore,
  isToday,
  addWeeks,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus_Jakarta_Sans, Syne, DM_Mono } from "next/font/google";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  getAvailableSlots,
  createAppointmentAction,
} from "@/app/[slug]/actions";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700", "800"],
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});
const mono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

type Provider = {
  id: string;
  business_name: string;
  slug: string;
  avatar_url: string | null;
  phone?: string;
  city?: string;
  verified?: boolean;
  rating?: number;
  review_count?: number;
};

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number | null;
  tag?: string | null;
};

type Collaborator = {
  id: string;
  name: string;
  role?: string | null;
  service_ids: string[];
};

const COLLAB_GRADIENTS = [
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-700",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-500",
];

const fmt = (v: number) =>
  `R$\u00a0${v.toFixed(2).replace(".", ",")}`;
const initials = (n: string) =>
  n
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const DOW = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function NewCustomerModal({
  onSave,
}: {
  onSave: (name: string, phone: string) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const valid =
    name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 z-50 flex items-end justify-center backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-[#0e2318] w-full max-w-md rounded-t-3xl border-t border-white/10 px-5 pt-4 pb-10"
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl bg-[#13ec5b]/12 flex items-center justify-center">
            <Sparkles size={18} className="text-[#13ec5b]" />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-[17px]">
              Primeiro acesso
            </h2>
            <p className="text-white/35 text-xs mt-0.5">
              Como podemos te chamar?
            </p>
          </div>
        </div>
        <div className="space-y-3 mb-6">
          {[
            {
              icon: User,
              label: "Seu nome",
              val: name,
              set: setName,
              type: "text",
              ph: "João Silva",
            },
            {
              icon: Phone,
              label: "WhatsApp",
              val: phone,
              set: setPhone,
              type: "tel",
              ph: "+55 (11) 99999-9999",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="relative">
                <Icon
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type={f.type}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.ph}
                  className="w-full h-14 bg-white/[0.05] border border-white/[0.08] rounded-2xl pl-11 pr-4 text-white placeholder:text-white/20 text-[15px] font-medium focus:outline-none focus:border-[#13ec5b]/50 transition-all"
                />
              </div>
            );
          })}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => valid && onSave(name, phone)}
          disabled={!valid}
          className={`w-full h-14 rounded-2xl font-bold text-base transition-all ${
            valid
              ? "bg-[#13ec5b] text-[#0e2318] shadow-[0_0_20px_rgba(19,236,91,0.25)]"
              : "bg-white/6 text-white/20 cursor-not-allowed"
          }`}
        >
          Continuar para agendar
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function ConfirmModal({
  service,
  collab,
  date,
  time,
  onConfirm,
  onClose,
  loading,
  success,
  error,
}: {
  service: Service;
  collab: Collaborator | null;
  date: Date;
  time: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
  success: boolean;
  error: string | null;
}) {
  const [h, m] = time.split(":").map(Number);
  const endD = new Date();
  endD.setHours(h, m + service.duration_minutes);
  const endT = format(endD, "HH:mm");
  const dateStr = format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
  const ci = collab ? 0 : 0;
  const collabGradient = collab
    ? COLLAB_GRADIENTS[ci % COLLAB_GRADIENTS.length]
    : "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 z-50 flex items-end justify-center backdrop-blur-[2px]"
      onClick={(e) =>
        !loading &&
        !success &&
        e.target === e.currentTarget &&
        onClose()
      }
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-[#0e2318] w-full max-w-md rounded-t-3xl border-t border-white/10 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 px-6 text-center"
            >
              <div className="relative w-24 h-24 mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 14 }}
                  className="absolute inset-0 rounded-full bg-[#13ec5b]/10"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    delay: 0.08,
                  }}
                  className="absolute inset-3 rounded-full bg-[#13ec5b]/20 flex items-center justify-center"
                >
                  <CalendarCheck size={36} className="text-[#13ec5b]" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-[family-name:var(--font-syne)] font-bold mb-1">
                Agendado!
              </h2>
              <p className="text-white/40 text-sm mb-1">
                {service.name}
                {collab ? ` · ${collab.name}` : ""}
              </p>
              <p className="text-[#13ec5b] font-semibold text-sm capitalize">
                {dateStr}
              </p>
              <p className="text-[#13ec5b]/60 text-xs mt-0.5 font-[family-name:var(--font-mono)]">
                {time} – {endT}
              </p>
              <p className="text-white/20 text-xs mt-5">
                Você receberá uma notificação de lembrete
              </p>
              <button
                onClick={onClose}
                className="mt-7 w-full h-14 bg-[#13ec5b] text-[#0e2318] font-bold rounded-2xl text-base"
              >
                Perfeito!
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-1" />
              <div className="px-5 pb-8 pt-3">
                <h2 className="font-[family-name:var(--font-syne)] font-bold text-[20px] mb-5">
                  Confirmar agendamento
                </h2>
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden mb-5 divide-y divide-white/[0.06]">
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-xl bg-[#13ec5b]/10 flex items-center justify-center shrink-0">
                      <Scissors size={16} className="text-[#13ec5b]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[15px]">{service.name}</p>
                      <p className="text-white/35 text-xs mt-0.5 font-[family-name:var(--font-mono)]">
                        {service.duration_minutes} min
                      </p>
                    </div>
                    <span className="font-bold font-[family-name:var(--font-mono)] text-white">
                      {service.price != null ? fmt(Number(service.price)) : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                      <Clock size={15} className="text-white/40" />
                    </div>
                    <div>
                      <p className="font-semibold text-[15px] capitalize">
                        {dateStr}
                      </p>
                      <p className="text-white/35 text-xs mt-0.5 font-[family-name:var(--font-mono)]">
                        {time} – {endT}
                      </p>
                    </div>
                  </div>
                  {collab && (
                    <div className="flex items-center gap-3 p-4">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${collabGradient} flex items-center justify-center shrink-0`}
                      >
                        <span className="text-white text-xs font-bold font-[family-name:var(--font-syne)]">
                          {initials(collab.name)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-[15px]">
                          {collab.name}
                        </p>
                        <p className="text-white/35 text-xs">
                          {collab.role ?? "Profissional"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                      <AlertCircle
                        size={15}
                        className="text-red-400 shrink-0"
                      />
                      <p className="text-red-300 text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="h-14 px-5 rounded-2xl border border-white/[0.08] font-semibold text-white/35 shrink-0 hover:bg-white/[0.04] transition-colors"
                  >
                    Voltar
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 h-14 bg-[#13ec5b] text-[#0e2318] font-bold rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(19,236,91,0.2)] disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      <>
                        <Check size={17} strokeWidth={2.5} />
                        Confirmar
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function PublicBookingPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(false);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCollab, setSelectedCollab] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const today = startOfDay(new Date());
  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        addDays(addWeeks(today, weekOffset), i)
      ),
    [weekOffset, today]
  );

  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!slug || !supabase) {
      setPageLoading(false);
      setPageError(true);
      return;
    }
    (async () => {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, business_name, slug, avatar_url, phone")
        .eq("slug", slug)
        .maybeSingle();
      if (userError || !userData) {
        setPageError(true);
        setPageLoading(false);
        return;
      }
      const prov: Provider = {
        id: userData.id,
        business_name: userData.business_name ?? "",
        slug: userData.slug ?? "",
        avatar_url: userData.avatar_url ?? null,
        phone: userData.phone ?? undefined,
      };
      setProvider(prov);

      const { data: svcData } = await supabase
        .from("services")
        .select("id, name, duration_minutes, price")
        .eq("user_id", userData.id)
        .eq("is_active", true);
      const svcs: Service[] = (svcData ?? []).map((s) => ({
        id: s.id,
        name: s.name ?? "",
        duration_minutes: s.duration_minutes ?? 30,
        price: s.price,
        tag: null,
      }));
      setServices(svcs);
      if (svcs.length > 0 && !selectedService) setSelectedService(svcs[0].id);

      const { data: collabRows } = await supabase
        .from("collaborators")
        .select("id, name, phone")
        .eq("user_id", userData.id)
        .eq("is_active", true);
      const { data: scRows } = await supabase
        .from("service_collaborators")
        .select("collaborator_id, service_id")
        .in(
          "collaborator_id",
          (collabRows ?? []).map((c) => c.id)
        );
      const serviceIdsByCollab: Record<string, string[]> = {};
      (collabRows ?? []).forEach((c) => {
        serviceIdsByCollab[c.id] = [];
      });
      (scRows ?? []).forEach((r: { collaborator_id: string; service_id: string }) => {
        if (!serviceIdsByCollab[r.collaborator_id]) return;
        serviceIdsByCollab[r.collaborator_id].push(r.service_id);
      });
      const collabs: Collaborator[] = (collabRows ?? []).map((c) => ({
        id: c.id,
        name: c.name ?? "",
        role: null,
        service_ids: serviceIdsByCollab[c.id] ?? [],
      }));
      setCollaborators(collabs);
      setPageLoading(false);
    })();
  }, [slug, supabase]);

  const service = services.find((s) => s.id === selectedService) ?? null;
  const availableCollabs = useMemo(
    () =>
      selectedService
        ? collaborators.filter((c) =>
            c.service_ids.includes(selectedService)
          )
        : [],
    [selectedService, collaborators]
  );
  const collab = collaborators.find((c) => c.id === selectedCollab) ?? null;

  useEffect(() => {
    if (selectedCollab && selectedService) {
      const ok = collaborators.find((c) => c.id === selectedCollab)?.service_ids.includes(selectedService);
      if (!ok) setSelectedCollab(null);
    }
  }, [selectedService, selectedCollab, collaborators]);

  useEffect(() => {
    if (!provider || !selectedService || !service) return;
    setSlotsLoading(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    getAvailableSlots(
      provider.id,
      selectedCollab,
      dateStr,
      service.duration_minutes
    ).then(({ slots }) => {
      setSlots(slots);
      setSlotsLoading(false);
    });
  }, [provider?.id, selectedService, selectedCollab, selectedDate, service?.duration_minutes]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setIsLoggedIn(false);
        setClientId(null);
        return;
      }
      supabase
        .from("clients")
        .select("id")
        .eq("firebase_uid", user.id)
        .maybeSingle()
        .then(({ data }) => {
          setIsLoggedIn(!!data);
          setClientId(data?.id ?? null);
        });
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setIsLoggedIn(false);
        setClientId(null);
        setShowNameModal(false);
        return;
      }
      supabase
        .from("clients")
        .select("id")
        .eq("firebase_uid", session.user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setClientId(data.id);
            setIsLoggedIn(true);
            setShowNameModal(false);
          } else {
            setClientId(null);
            setIsLoggedIn(true);
            setShowNameModal(true);
          }
        });
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSelectService = useCallback(
    (id: string) => {
      setSelectedService(id);
      const stillOk = collaborators.find((c) => c.id === selectedCollab)?.service_ids.includes(id);
      if (!stillOk) setSelectedCollab(null);
    },
    [selectedCollab, collaborators]
  );

  const canBook = !!(
    selectedService &&
    selectedDate &&
    selectedTime &&
    provider &&
    service
  );
  const canBookAndLoggedIn = canBook && isLoggedIn && clientId;

  const handleLogin = useCallback(async () => {
    if (!supabase || !canBook) return;
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
    setAuthLoading(false);
    if (error) {
      setBookingError("Falha ao entrar. Tente novamente.");
      return;
    }
  }, [supabase, canBook]);

  const handleSaveCustomer = useCallback(
    async (name: string, phone: string) => {
      if (!supabase) return;
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;
      const normalizedPhone = phone.replace(/\D/g, "");
      const { data: newClient, error } = await supabase
        .from("clients")
        .insert({
          firebase_uid: authUser.id,
          email: authUser.email ?? null,
          name: name.trim(),
          phone: normalizedPhone,
        })
        .select("id")
        .single();
      if (error || !newClient) {
        setBookingError("Erro ao salvar dados. Tente novamente.");
        return;
      }
      setClientId(newClient.id);
      setIsLoggedIn(true);
      setShowNameModal(false);
      setShowConfirm(true);
    },
    [supabase]
  );

  const handleConfirm = useCallback(async () => {
    if (!provider || !service || !selectedTime || !clientId) return;
    setBookingLoading(true);
    setBookingError(null);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const result = await createAppointmentAction(
      clientId,
      provider.id,
      service.id,
      selectedCollab,
      dateStr,
      selectedTime,
      service.duration_minutes
    );
    setBookingLoading(false);
    if (result.success) {
      setBookingSuccess(true);
    } else if (result.error === "slot_taken") {
      setBookingError("Horário ocupado, escolha outro.");
    } else {
      setBookingError("Não foi possível confirmar. Tente novamente.");
    }
  }, [provider, service, selectedTime, selectedDate, selectedCollab, clientId]);

  if (pageLoading) {
    return (
      <div
        className={`${syne.variable} ${jakarta.variable} ${mono.variable} font-[family-name:var(--font-jakarta)] bg-[#0b1e12] min-h-screen text-white flex items-center justify-center`}
      >
        <Loader2 size={32} className="animate-spin text-[#13ec5b]" />
      </div>
    );
  }
  if (pageError || !provider) {
    return (
      <div
        className={`${syne.variable} ${jakarta.variable} ${mono.variable} font-[family-name:var(--font-jakarta)] bg-[#0b1e12] min-h-screen text-white flex flex-col items-center justify-center gap-4 px-6`}
      >
        <p className="text-lg font-semibold">Página não encontrada</p>
        <Link
          href="/"
          className="text-[#13ec5b] hover:underline font-medium"
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`${syne.variable} ${jakarta.variable} ${mono.variable} font-[family-name:var(--font-jakarta)] bg-[#0b1e12] min-h-screen text-white pb-44`}
    >
      <div className="fixed top-0 left-0 right-0 h-[280px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[420px] h-[240px] bg-[#13ec5b]/5 rounded-full blur-[70px]" />
      </div>

      <header className="sticky top-0 z-40 bg-[#0b1e12]/80 backdrop-blur-lg border-b border-white/[0.06]">
        <div className="flex items-center h-14 px-4 max-w-md mx-auto">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-start text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <span className="flex-1 text-center text-sm font-semibold text-white/60 tracking-tight">
            Agendamento
          </span>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <section className="flex flex-col items-center pt-8 pb-6 px-5">
          <div className="relative mb-5">
            <div className="w-[96px] h-[96px] rounded-[26px] border border-[#13ec5b]/15 bg-gradient-to-br from-[#13ec5b]/15 to-[#193322] flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(19,236,91,0.08)]">
              {provider.avatar_url ? (
                <Image
                  src={provider.avatar_url}
                  alt=""
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Scissors size={40} className="text-[#13ec5b]/40" />
              )}
            </div>
            {provider.verified && (
              <div className="absolute -bottom-2 -right-2 bg-[#13ec5b] rounded-full p-1.5 border-[2.5px] border-[#0b1e12]">
                <BadgeCheck size={13} className="text-[#0b1e12]" strokeWidth={2.5} />
              </div>
            )}
          </div>
          <h1 className="font-[family-name:var(--font-syne)] font-bold text-[22px] text-center leading-tight mb-1">
            {provider.business_name}
          </h1>
          {provider.city && (
            <div className="flex items-center gap-1.5 text-xs text-white/35 mb-3">
              <MapPin size={11} />
              <span>{provider.city}</span>
            </div>
          )}
          {provider.rating != null && (
            <div className="flex items-center gap-1.5 text-xs">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-white/70">{provider.rating}</span>
              {provider.review_count != null && (
                <span className="text-white/35">
                  ({provider.review_count} avaliações)
                </span>
              )}
            </div>
          )}
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent mx-5 mb-7" />

        <section className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 px-5 mb-3">
            Selecione o Serviço
          </p>
          <div className="px-4 space-y-2">
            {services.map((s) => {
              const active = selectedService === s.id;
              return (
                <motion.button
                  key={s.id}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleSelectService(s.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                    active
                      ? "bg-[#13ec5b]/[0.07] border-[#13ec5b]/30"
                      : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center transition-all ${
                      active ? "bg-[#13ec5b]" : "border border-white/20"
                    }`}
                  >
                    {active && (
                      <Check
                        size={13}
                        className="text-[#0b1e12]"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-semibold text-[15px] ${
                          active ? "text-white" : "text-white/65"
                        }`}
                      >
                        {s.name}
                      </span>
                      {s.tag && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full leading-none ${
                            active
                              ? "bg-[#13ec5b]/18 text-[#13ec5b]"
                              : "bg-white/[0.07] text-white/35"
                          }`}
                        >
                          {s.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-white/30">
                      <Clock size={10} />
                      <span className="font-[family-name:var(--font-mono)]">
                        {s.duration_minutes} min
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-bold text-[15px] shrink-0 font-[family-name:var(--font-mono)] ${
                      active ? "text-[#13ec5b]" : "text-white/45"
                    }`}
                  >
                    {s.price != null ? fmt(Number(s.price)) : "—"}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {availableCollabs.length > 0 && (
          <section className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 px-5 mb-4">
              Escolha o Profissional
            </p>
            <div
              className="flex gap-5 px-5 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {availableCollabs.map((c, i) => {
                const sel = selectedCollab === c.id;
                return (
                  <motion.button
                    key={c.id}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSelectedCollab(sel ? null : c.id)}
                    className="flex flex-col items-center gap-2 shrink-0 min-w-[68px]"
                  >
                    <div
                      className={`relative w-[58px] h-[58px] rounded-full transition-all duration-200 ${
                        sel
                          ? "ring-2 ring-[#13ec5b] ring-offset-2 ring-offset-[#0b1e12]"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-full h-full rounded-full bg-gradient-to-br ${
                          COLLAB_GRADIENTS[i % COLLAB_GRADIENTS.length]
                        } flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-sm font-[family-name:var(--font-syne)]">
                          {initials(c.name)}
                        </span>
                      </div>
                      {sel && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-0.5 -right-0.5 bg-[#13ec5b] border-2 border-[#0b1e12] w-5 h-5 rounded-full flex items-center justify-center"
                        >
                          <Check
                            size={10}
                            className="text-[#0b1e12]"
                            strokeWidth={3}
                          />
                        </motion.div>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-semibold transition-colors ${
                        sel ? "text-white" : "text-white/35"
                      }`}
                    >
                      {c.name}
                    </span>
                  </motion.button>
                );
              })}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedCollab(null)}
                className="flex flex-col items-center gap-2 shrink-0 min-w-[68px]"
              >
                <div
                  className={`relative w-[58px] h-[58px] rounded-full transition-all duration-200 ${
                    selectedCollab === null
                      ? "ring-2 ring-[#13ec5b] ring-offset-2 ring-offset-[#0b1e12]"
                      : ""
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-white/[0.07] flex items-center justify-center">
                    <Users size={20} className="text-white/40" />
                  </div>
                  {selectedCollab === null && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-0.5 -right-0.5 bg-[#13ec5b] border-2 border-[#0b1e12] w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      <Check
                        size={10}
                        className="text-[#0b1e12]"
                        strokeWidth={3}
                      />
                    </motion.div>
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold transition-colors ${
                    selectedCollab === null ? "text-white" : "text-white/35"
                  }`}
                >
                  Qualquer
                </span>
              </motion.button>
            </div>
            {collab && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-white/30 px-5 mt-2 font-medium"
              >
                {collab.role ?? "Profissional"}
              </motion.p>
            )}
          </section>
        )}

        <section className="mb-8">
          <div className="flex items-center justify-between px-5 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Data do Agendamento
            </p>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => weekOffset > 0 && setWeekOffset((w) => w - 1)}
                disabled={weekOffset === 0}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/8 disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[11px] text-white/30 font-medium w-[72px] text-center capitalize">
                {format(weekDays[0], "MMM yyyy", { locale: ptBR })}
              </span>
              <button
                onClick={() => setWeekOffset((w) => w + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div
            className="flex gap-2 px-4 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {weekDays.map((day) => {
              const isPast =
                isBefore(day, today) && !isToday(day);
              const isSel = isSameDay(day, selectedDate);
              const isTod = isToday(day);
              return (
                <motion.button
                  key={day.toISOString()}
                  whileTap={{ scale: 0.91 }}
                  disabled={isPast}
                  onClick={() => setSelectedDate(day)}
                  className={`relative flex flex-col items-center justify-center min-w-[52px] h-[70px] rounded-2xl shrink-0 transition-all duration-200 ${
                    isPast
                      ? "opacity-20 cursor-not-allowed"
                      : isSel
                        ? "bg-[#13ec5b] shadow-[0_4px_14px_rgba(19,236,91,0.25)]"
                        : isTod
                          ? "bg-[#13ec5b]/10 border border-[#13ec5b]/20"
                          : "bg-white/[0.04] hover:bg-white/[0.08]"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
                      isSel ? "text-[#0b1e12]" : "text-white/30"
                    }`}
                  >
                    {DOW[day.getDay()]}
                  </span>
                  <span
                    className={`text-[17px] font-[family-name:var(--font-syne)] font-bold ${
                      isSel ? "text-[#0b1e12]" : "text-white"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {isTod && !isSel && (
                    <div className="absolute bottom-2 w-1 h-1 bg-[#13ec5b] rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {service && (
          <section className="px-4">
            <div className="flex items-center justify-between px-1 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                Horários Disponíveis
              </p>
              <span className="text-[10px] text-white/20 font-[family-name:var(--font-mono)]">
                {service.duration_minutes}min / slot
              </span>
            </div>
            {slotsLoading ? (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 rounded-xl bg-white/[0.06] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots.length === 0 ? (
                  <p className="col-span-4 text-sm text-white/40 py-4 text-center">
                    Nenhum horário disponível nesta data.
                  </p>
                ) : (
                  slots.map((slot) => {
                    const active = selectedTime === slot;
                    return (
                      <motion.button
                        key={slot}
                        whileTap={{ scale: 0.89 }}
                        onClick={() =>
                          setSelectedTime(active ? null : slot)
                        }
                        className={`flex items-center justify-center py-3.5 rounded-xl text-[13px] font-semibold transition-all font-[family-name:var(--font-mono)] ${
                          active
                            ? "bg-[#13ec5b]/10 border border-[#13ec5b] text-[#13ec5b] shadow-[0_0_10px_rgba(19,236,91,0.15)]"
                            : "bg-white/[0.04] border border-white/[0.06] text-white/55 hover:bg-white/[0.08] hover:text-white hover:border-white/15"
                        }`}
                      >
                        {slot}
                      </motion.button>
                    );
                  })
                )}
              </div>
            )}
          </section>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="h-8 bg-gradient-to-t from-[#0b1e12] to-transparent pointer-events-none" />
        <div className="bg-[#0b1e12]/95 backdrop-blur-lg border-t border-white/[0.06] px-4 pt-3 pb-10">
          <div className="max-w-md mx-auto">
            <AnimatePresence>
              {canBook && service && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end justify-between mb-3 px-1"
                >
                  <div>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em] mb-0.5">
                      Total estimado
                    </p>
                    <p className="text-2xl font-bold font-[family-name:var(--font-mono)]">
                      {service.price != null
                        ? fmt(Number(service.price))
                        : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/30 capitalize">
                      {format(selectedDate, "EEE, dd MMM", { locale: ptBR })}
                    </p>
                    <p className="text-sm font-semibold text-[#13ec5b]">
                      {selectedTime} ·{" "}
                      {collab?.name ?? "Qualquer profissional"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {canBookAndLoggedIn ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => canBook && setShowConfirm(true)}
                disabled={!canBook}
                className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                  canBook
                    ? "bg-[#13ec5b] text-[#0b1e12] shadow-[0_4px_22px_rgba(19,236,91,0.25)]"
                    : "bg-white/6 text-white/20 cursor-not-allowed"
                }`}
              >
                <Check size={18} strokeWidth={2.5} /> Confirmar Agendamento
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogin}
                  disabled={authLoading || !canBook}
                  className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all ${
                    canBook
                      ? "bg-white text-slate-900 shadow-[0_4px_20px_rgba(255,255,255,0.12)]"
                      : "bg-white/8 text-white/20 cursor-not-allowed"
                  }`}
                >
                  {authLoading ? (
                    <Loader2
                      size={20}
                      className="animate-spin text-slate-400"
                    />
                  ) : (
                    <svg
                      className="w-5 h-5 shrink-0"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  {authLoading
                    ? "Entrando..."
                    : "Entrar com Google para Agendar"}
                </motion.button>
                {canBook && (
                  <p className="text-center text-[11px] text-white/18 mt-2">
                    Um clique · Dados protegidos · Sem senha
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showNameModal && (
          <NewCustomerModal onSave={handleSaveCustomer} />
        )}
        {showConfirm && selectedTime && service && (
          <ConfirmModal
            service={service}
            collab={collab}
            date={selectedDate}
            time={selectedTime}
            onConfirm={handleConfirm}
            onClose={() => {
              if (!bookingLoading) {
                setShowConfirm(false);
                setBookingSuccess(false);
                setBookingError(null);
              }
            }}
            loading={bookingLoading}
            success={bookingSuccess}
            error={bookingError}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
