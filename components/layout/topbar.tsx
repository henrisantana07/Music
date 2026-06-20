"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

interface TopBarProps {
  userAvatar?: string;
  userName?: string;
}

export function TopBar({ userAvatar, userName }: TopBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[var(--bg-base)]/80 backdrop-blur-md border-b border-[var(--bg-surface)] h-16">
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar músicas, artistas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-disabled)] rounded-lg border border-[var(--bg-elevated)] focus:border-[var(--accent-solid)] focus:outline-none transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          </div>
        </form>

        {/* User Profile Link */}
        {userAvatar && (
          <Link href="/profile" className="flex items-center gap-3 group">
            <div className="flex flex-col items-end">
              <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-from)] transition-colors">
                {userName || "Usuário"}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Perfil</p>
            </div>

            <img
              src={userAvatar}
              alt={userName || "Avatar"}
              className="w-10 h-10 rounded-full object-cover border-2 border-[var(--accent-solid)] group-hover:border-[var(--accent-from)] transition-colors"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
