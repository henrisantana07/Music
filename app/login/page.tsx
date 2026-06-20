"use client";

import { Suspense } from "react";
import { LoginContent } from "@/components/auth/login-content";

function LoginPageContent() {
  return <LoginContent />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-lg gradient-accent mx-auto animate-pulse" />
            <p className="text-[var(--text-secondary)]">Carregando...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
