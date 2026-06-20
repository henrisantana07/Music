"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Search,
  Heart,
  Music,
  LogOut,
  Menu,
  X,
  Settings,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast";
import type { Playlist } from "@/types";

interface SidebarProps {
  userEmail?: string;
  userName?: string;
}

export function Sidebar({ userEmail, userName }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const toast = useToast();

  // Fetch playlists on mount
  useEffect(() => {
    fetchPlaylists();
  }, []);

  async function fetchPlaylists() {
    try {
      setIsLoadingPlaylists(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setIsLoadingPlaylists(false);
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      toast.success("Desconectado com sucesso");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao desconectar");
    }
  }

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/search", label: "Buscar", icon: Search },
    { href: "/favorites", label: "Favoritos", icon: Heart },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 text-[var(--text-primary)] hover:text-[var(--accent-solid)] transition-colors"
        aria-label="Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Backdrop (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[var(--bg-surface)] border-r border-[var(--bg-elevated)] z-40 transition-transform duration-200 md:translate-x-0 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[var(--bg-elevated)]">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center text-[var(--bg-base)] font-bold text-lg">
                🔥
              </div>
              <h1 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-from)] transition-colors">
                Ember
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative ${
                  isActive(href)
                    ? "text-[var(--accent-from)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{label}</span>

                {/* Active indicator */}
                {isActive(href) && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l gradient-accent" />
                )}
              </Link>
            ))}
          </nav>

          {/* Playlists Section */}
          {userEmail && (
            <div className="border-t border-[var(--bg-elevated)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[var(--text-secondary)]" />
                  <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Playlists
                  </h3>
                </div>
                <button
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--accent-solid)] transition-colors"
                  title="Nova playlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 max-h-40 overflow-y-auto">
                {isLoadingPlaylists ? (
                  <p className="text-xs text-[var(--text-disabled)]">Carregando...</p>
                ) : playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <Link
                      key={playlist.id}
                      href={`/playlists/${playlist.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-2 py-1.5 rounded text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors group"
                    >
                      <span className="truncate">{playlist.name}</span>
                      <MoreHorizontal className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-[var(--text-disabled)]">
                    Nenhuma playlist
                  </p>
                )}
              </div>
            </div>
          )}

          {/* User Section */}
          {userEmail && (
            <div className="border-t border-[var(--bg-elevated)] p-4 space-y-3">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-solid)] transition-colors"
              >
                <Settings className="w-4 h-4" />
                Perfil
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}
