"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { usePlayerStore } from "@/lib/player-store";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase";
import type { Track } from "@/types";
import { Play, Heart, Trash2, Download } from "lucide-react";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const {
    setCurrentTrack,
    setQueue,
    favorites: favoriteIds,
    toggleFavorite,
  } = usePlayerStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Parse tracks from stored data
      const tracks = (data || [])
        .map((fav: any) => {
          try {
            return JSON.parse(fav.track_data || "{}");
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      setFavorites(tracks);
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("Erro ao carregar favoritos");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePlayTrack = useCallback(
    (track: Track) => {
      setCurrentTrack(track);
      setQueue(favorites);
      toast.success(`Reproduzindo: ${track.name}`);
    },
    [favorites, setCurrentTrack, setQueue, toast]
  );

  const handleRemoveFavorite = useCallback(
    async (trackId: string) => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) return;

        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", session.user.id)
          .eq("track_id", trackId);

        if (error) throw error;

        setFavorites(favorites.filter((t) => t.id !== trackId));
        toggleFavorite(trackId);
        toast.success("Removido de favoritos");
      } catch (error) {
        console.error("Error removing favorite:", error);
        toast.error("Erro ao remover de favoritos");
      }
    },
    [favorites, toggleFavorite, toast]
  );

  const handleDownload = (track: Track) => {
    if (!track.audiodownload) {
      toast.error("Download não disponível para esta faixa");
      return;
    }

    const link = document.createElement("a");
    link.href = track.audiodownload;
    link.download = `${track.artist_name} - ${track.name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download iniciado");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-lg gradient-accent mx-auto animate-pulse" />
            <p className="text-[var(--text-secondary)]">Carregando favoritos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 pb-48">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            ❤️ Meus Favoritos
          </h1>
          <p className="text-[var(--text-secondary)]">
            {favorites.length} música{favorites.length !== 1 ? "s" : ""} salva
            {favorites.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <div className="space-y-3">
            {favorites.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors group"
              >
                {/* Album Cover */}
                {track.image && (
                  <img
                    src={track.image}
                    alt={track.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                )}

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-from)] transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] truncate">
                    {track.artist_name}
                  </p>
                  {track.album_name && (
                    <p className="text-xs text-[var(--text-disabled)] truncate">
                      {track.album_name}
                    </p>
                  )}
                </div>

                {/* Duration & License */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-sm text-[var(--text-disabled)]">
                    {Math.floor(track.duration / 60)}:
                    {(track.duration % 60).toString().padStart(2, "0")}
                  </span>

                  {track.license_shortname && (
                    <span className="text-xs px-2 py-1 rounded bg-[var(--accent-muted-transparent)] text-[var(--accent-solid)]">
                      {track.license_shortname}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="p-2 rounded-full hover:bg-[var(--bg-base)] transition-colors text-[var(--accent-solid)]"
                    title="Reproduzir"
                  >
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  </button>

                  <button
                    onClick={() => handleDownload(track)}
                    className="p-2 rounded-full hover:bg-[var(--bg-base)] transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-solid)]"
                    title="Baixar"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleRemoveFavorite(track.id)}
                    className="p-2 rounded-full hover:bg-[var(--bg-base)] transition-colors text-[var(--text-secondary)] hover:text-[var(--error)]"
                    title="Remover"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <Heart className="w-16 h-16 mx-auto text-[var(--text-disabled)]" />
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Sem favoritos ainda
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Explore músicas e adicione às suas favoritas
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
