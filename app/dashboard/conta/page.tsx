"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Edit2,
  Shield,
  ChevronRight,
  Users,
  Scissors,
  QrCode,
  Download,
  Check,
  Copy,
  ExternalLink,
  Save,
} from "lucide-react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase/client";
import BottomNavigation from "@/components/dashboard/BottomNavigation";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const baseUrl =
  typeof process.env.NEXT_PUBLIC_APP_URL === "string"
    ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
    : "https://agenndar.com.br";

function QRCodeDisplay({ slug, color }: { slug: string; color: string }) {
  const url = `${baseUrl}/${slug}`;
  return (
    <div
      className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border border-slate-100 relative overflow-hidden p-2"
      style={{ backgroundColor: "white" }}
    >
      <QRCodeSVG
        value={url}
        size={192}
        fgColor={color}
        bgColor="#ffffff"
        level="M"
      />
    </div>
  );
}

const QR_THEMES = [
  { color: "#13ec5b", bg: "#102216", label: "Verde" },
  { color: "#3B82F6", bg: "#0f172a", label: "Azul" },
  { color: "#8B5CF6", bg: "#1a0a2e", label: "Roxo" },
  { color: "#F97316", bg: "#1a0a00", label: "Laranja" },
  { color: "#ffffff", bg: "#0f172a", label: "Branco" },
];

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function ContaPage() {
  const [businessName, setBusinessName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [qrTheme, setQrTheme] = useState(0);
  const [includePhone, setIncludePhone] = useState(true);
  const [includeAddress, setIncludeAddress] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const publicUrl = `${baseUrl}/${slug}`;

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("users")
        .select("business_name, phone, slug, avatar_url")
        .eq("firebase_uid", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setBusinessName(data.business_name ?? "");
            setSlug(data.slug ?? "");
            setPhone(data.phone ?? "");
            setAvatarUrl(data.avatar_url ?? null);
          }
        });
    });
  }, []);

  const handleSlugChange = (v: string) => {
    setSlug(slugify(v));
  };

  const handleSave = async () => {
    if (!supabase) {
      alert("Supabase não configurado.");
      return;
    }
    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      alert("Link público inválido. Use apenas letras, números e hífens.");
      return;
    }
    setLoading(true);
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        alert("Faça login para salvar.");
        return;
      }
      const { error } = await supabase
        .from("users")
        .update({
          business_name: businessName.trim(),
          phone: phone.trim(),
          slug: cleanSlug,
          updated_at: new Date().toISOString(),
        })
        .eq("firebase_uid", authUser.id);

      if (error) {
        if (error.code === "23505") alert("Este link já está em uso. Escolha outro.");
        else throw error;
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    // Placeholder: react-to-print ou html2canvas
    window.print();
  };

  return (
    <div className={`${jakarta.variable} font-[family-name:var(--font-jakarta)] min-h-screen pb-32 bg-dash-bg text-dash-text`}>
      <header className="sticky top-0 z-50 bg-dash-surface/95 backdrop-blur-md border-b border-dash-border">
        <div className="flex items-center px-4 h-14 justify-between max-w-md mx-auto">
          <Link href="/dashboard" className="h-10 w-10 flex items-center justify-start text-dash-text-muted hover:text-dash-text">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-base font-bold text-dash-text">Personalização</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <section className="flex flex-col items-center py-8 px-6">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full border-4 border-dash-primary/30 bg-dash-primary-bg flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-dash-primary">{businessName ? businessName.charAt(0).toUpperCase() : "?"}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-dash-primary text-white p-2 rounded-full border-4 border-dash-bg"
            >
              <Edit2 size={12} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={() => {
                /* TODO: upload to Supabase Storage bucket avatars */
              }}
            />
          </div>

          <p className="text-xl font-extrabold text-dash-text">{businessName || "Seu negócio"}</p>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 mt-1 text-dash-primary text-sm font-medium"
          >
            <span>@{slug || "seu-link"}</span>
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </section>

        <section className="px-4 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-dash-text-muted mb-3 px-1">Informações da Conta</h2>
          <div className="bg-dash-surface border border-dash-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-dash-border">
              <label className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider block mb-2">Nome do Estabelecimento</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-transparent text-dash-text text-[15px] font-semibold focus:outline-none placeholder:text-dash-text-muted"
                placeholder="Nome do negócio"
              />
            </div>
            <div className="p-4 border-b border-dash-border">
              <label className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider block mb-2">Link Público</label>
              <div className="flex items-center gap-0">
                <span className="text-dash-text-muted text-sm font-medium shrink-0">agenndar.com.br/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="flex-1 bg-transparent text-dash-primary text-[15px] font-semibold focus:outline-none min-w-0"
                  placeholder="seu-link"
                />
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-dash-text-muted hover:text-dash-text ml-2 shrink-0">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
            <div className="p-4">
              <label className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider block mb-2">WhatsApp de Contato</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-dash-text text-[15px] font-semibold focus:outline-none placeholder:text-dash-text-muted"
                placeholder="+55 (11) 99999-9999"
              />
            </div>
          </div>
        </section>

        <section className="px-4 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-dash-text-muted mb-3 px-1">Seu QR Code</h2>
          <div className="bg-dash-surface border border-dash-border rounded-2xl p-5">
            <div className="flex justify-center mb-5">
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: QR_THEMES[qrTheme].bg }}
              >
                <QRCodeDisplay
                  slug={slug || "seu-link"}
                  color={QR_THEMES[qrTheme].color}
                />
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-dash-text-muted mb-3">
                Tema do QR Code
              </p>
              <div className="flex gap-2.5">
                {QR_THEMES.map((t, i) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setQrTheme(i)}
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all ${
                      qrTheme === i ? "border-dash-primary scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: t.bg }}
                    title={t.label}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-dash-text-muted mb-3">
                Personalizar Impressão (PDF)
              </p>
              <div className="space-y-3">
                {[
                  {
                    label: "Incluir telefone no rodapé",
                    value: includePhone,
                    set: setIncludePhone,
                  },
                  {
                    label: "Incluir endereço físico",
                    value: includeAddress,
                    set: setIncludeAddress,
                  },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => item.set(!item.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && item.set(!item.value)
                      }
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        item.value
                          ? "bg-dash-primary border-dash-primary"
                          : "border-dash-border"
                      }`}
                    >
                      {item.value && (
                        <Check size={11} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm text-dash-text-muted">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="w-full h-12 bg-dash-surface-hover border border-dash-border hover:bg-dash-border/50 text-dash-text font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
              onClick={handleDownloadPDF}
            >
              <Download size={16} />
              Gerar PDF para Impressão
            </button>
          </div>
        </section>

        <section className="px-4 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-dash-text-muted mb-3 px-1">Gestão do Negócio</h2>

          <div className="space-y-2">
            {[
              {
                href: "/dashboard/colaboradores",
                icon: Users,
                title: "Gestão de Colaboradores",
                sub: "Equipe, permissões e escalas",
              },
              {
                href: "/dashboard/servicos",
                icon: Scissors,
                title: "Gestão de Serviços",
                sub: "Preços, duração e categorias",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-4 bg-dash-surface border border-dash-border rounded-xl active:opacity-70 transition-opacity hover:bg-dash-surface-hover"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-dash-primary-bg flex items-center justify-center">
                      <Icon size={18} className="text-dash-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-dash-text">
                        {item.title}
                      </p>
                      <p className="text-xs text-dash-text-muted mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-dash-text-muted" />
                </Link>
              );
            })}
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 px-4 mb-4">
          <Shield size={13} className="text-dash-primary/70" />
          <p className="text-[11px] text-dash-text-muted">
            Seus dados estão protegidos e criptografados
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dash-surface/95 backdrop-blur-md border-t border-dash-border z-50">
        <div className="max-w-md mx-auto">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={loading}
            className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              saved
                ? "bg-dash-surface-hover text-dash-primary"
                : "bg-dash-primary text-white shadow-lg"
            }`}
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Check size={18} /> Alterações salvas!
                </motion.div>
              ) : (
                <motion.div
                  key="save"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Save size={18} /> Salvar Alterações
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <BottomNavigation currentRoute="conta" />
    </div>
  );
}
