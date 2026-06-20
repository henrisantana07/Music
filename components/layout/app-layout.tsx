"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { Player } from "@/components/player/player";
import { ToastContainer } from "@/components/ui/toast";
import { usePlayerStore } from "@/lib/player-store";
import { supabase } from "@/lib/supabase";
import type { AuthChangeEvent } from "@supabase/supabase-js";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [userEmail, setUserEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [userAvatar, setUserAvatar] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const { setFavorites } = usePlayerStore();

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    loadUserData();
    loadFavorites();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: any) => {
        if (session?.user) {
          loadUserData();
          loadFavorites();
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function loadUserData() {
    try {
      if (!supabase) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      setUserEmail(session.user.email);
      setUserName(session.user.user_metadata?.full_name);
      setUserAvatar(session.user.user_metadata?.avatar_url);

      // Fetch profile from database
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profile?.avatar_url) {
        setUserAvatar(profile.avatar_url);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadFavorites() {
    try {
      if (!supabase) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data: favorites } = await supabase
        .from("favorites")
        .select("track_id")
        .eq("user_id", session.user.id);

      if (favorites) {
        setFavorites(favorites.map((f: any) => f.track_id));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-lg gradient-accent mx-auto animate-pulse" />
          <p className="text-[var(--text-secondary)]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg-base)]">
      {/* Sidebar */}
      <Sidebar userEmail={userEmail} userName={userName} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* TopBar */}
        <TopBar userAvatar={userAvatar} userName={userName} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Player */}
        <Player />
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
