"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast";
import { Loader } from "lucide-react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    // Check if already logged in
    checkSession();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_IN" && session) {
          router.push(searchParams.get("from") || "/");
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router, searchParams]);

  async function checkSession() {
    if (!supabase) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push(searchParams.get("from") || "/");
    }
  }

  async function handleGoogleLogin() {
    try {
      if (!supabase) {
        toast.error("Configuração não concluída. Por favor, tente mais tarde.");
        return;
      }

      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login com Google");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl gradient-accent mx-auto flex items-center justify-center text-4xl">
            🔥
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            Ember Music
          </h1>
          <p className="text-[var(--text-secondary)]">
            Streaming de música com licença Creative Commons
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--bg-surface)] rounded-lg p-8 space-y-6 border border-[var(--bg-elevated)]">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Bem-vindo
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Faça login para descobrir novas músicas e criar suas playlists
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full gradient-accent text-[var(--bg-base)] font-semibold py-3 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Entrar com Google
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--bg-elevated)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--bg-surface)] text-[var(--text-secondary)]">
                Ou continue como
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full border border-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold py-3 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
          >
            Visualizar como Convidado
          </button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 text-sm text-[var(--text-secondary)]">
          <p>
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="text-[var(--accent-solid)] hover:text-[var(--accent-from)]">
              Termos de Serviço
            </a>
          </p>
          <p>
            Música sob licença Creative Commons via{" "}
            <a
              href="https://www.jamendo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-solid)] hover:text-[var(--accent-from)]"
            >
              Jamendo
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
