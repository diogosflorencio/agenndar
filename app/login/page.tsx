"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

const DEMO_EMAIL = "demo@agenndar.com";
const DEMO_PASSWORD = "demo123";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [loading, setLoading] = useState<"idle" | "google" | "demo">("idle");
  const [error, setError] = useState<string | null>(null);
  const [demoEmail, setDemoEmail] = useState(DEMO_EMAIL);
  const [demoPassword, setDemoPassword] = useState(DEMO_PASSWORD);

  useEffect(() => {
    if (errorParam === "config") setError("Serviço não configurado. Verifique as variáveis de ambiente.");
  }, [errorParam]);

  async function handleGoogleLogin() {
    const db = getSupabaseClient();
    if (!db) {
      setError("Supabase não configurado.");
      return;
    }
    setError(null);
    setLoading("google");
    const { error: err } = await db.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (err) {
      setError(err.message || "Falha ao entrar com Google.");
      setLoading("idle");
    }
  }

  async function handleDemoLogin(e: React.FormEvent) {
    e.preventDefault();
    const db = getSupabaseClient();
    if (!db) {
      setError("Supabase não configurado.");
      return;
    }
    setError(null);
    setLoading("demo");
    const { data, error: err } = await db.auth.signInWithPassword({
      email: demoEmail.trim(),
      password: demoPassword,
    });
    setLoading("idle");
    if (err) {
      setError(err.message === "Invalid login credentials" ? "E-mail ou senha incorretos. Crie o usuário demo no Supabase (Auth) e execute o seed." : err.message);
      return;
    }
    if (data.user) {
      const { data: dbUser } = await db
        .from("users")
        .select("id")
        .eq("firebase_uid", data.user.id)
        .maybeSingle();
      if (dbUser) router.replace(next);
      else router.replace("/setup");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--global-bg)] text-white flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      <header className="relative z-10 flex items-center h-14 px-4 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Voltar</span>
        </Link>
      </header>
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Entrar no Agenndar</h1>
            <p className="text-white/50 text-sm mt-2">Acesse sua conta para gerenciar agendamentos</p>
          </div>
          {error && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-4">
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading !== "idle"}
              className="w-full h-14 rounded-2xl bg-white text-slate-800 font-semibold flex items-center justify-center gap-3 hover:bg-white/95 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading === "google" ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading === "google" ? "Entrando..." : "Entrar com Google"}
            </motion.button>
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-xs text-white/40 font-medium">ou</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>
            <form onSubmit={handleDemoLogin} className="space-y-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Acesso demo (teste)</p>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  placeholder="E-mail"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
              <button
                type="submit"
                disabled={loading !== "idle"}
                className="w-full h-12 rounded-xl bg-primary/20 text-primary font-semibold border border-primary/30 hover:bg-primary/30 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading === "demo" ? <Loader2 size={18} className="animate-spin" /> : null}
                Entrar (demo)
              </button>
            </form>
          </div>
          <p className="text-center text-white/35 text-xs mt-6">
            Para usar o demo: crie um usuário em Supabase Auth (e-mail/senha) e execute o seed com o mesmo UID.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--global-bg)] text-white flex flex-col items-center justify-center">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
