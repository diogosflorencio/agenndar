"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const db = getSupabaseClient();
    if (!db) {
      router.replace("/login?error=config");
      return;
    }
    const checkUser = () => {
      db.auth.getUser().then(({ data: { user } }) => {
        if (!user) {
          setStatus("error");
          setTimeout(() => router.replace("/login"), 2000);
          return;
        }
        db.from("users").select("id").eq("firebase_uid", user.id).maybeSingle().then(({ data }) => {
          setStatus("done");
          if (data) router.replace(next);
          else router.replace("/setup");
        });
      });
    };
    const t = setTimeout(checkUser, 800);
    const { data: { subscription } } = db.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        clearTimeout(t);
        checkUser();
      }
    });
    return () => {
      clearTimeout(t);
      subscription.unsubscribe();
    };
  }, [router, next]);

  return (
    <div className="min-h-screen bg-[var(--global-bg)] flex flex-col items-center justify-center gap-4 text-white">
      {status === "loading" && <Loader2 size={40} className="animate-spin text-primary" />}
      {status === "loading" && <p className="text-white/60">Confirmando login...</p>}
      {status === "error" && <p className="text-red-400">Falha ao entrar. Redirecionando...</p>}
    </div>
  );
}
