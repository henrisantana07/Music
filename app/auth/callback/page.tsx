"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase automatically handles OAuth callback
    // Just redirect to home
    router.push("/");
  }, [router]);

  return (
    <div className="w-screen h-screen bg-[var(--bg-base)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-lg gradient-accent mx-auto animate-pulse" />
        <p className="text-[var(--text-secondary)]">Completando login...</p>
      </div>
    </div>
  );
}
