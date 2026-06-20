"use client";

import { useEffect, useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { TrackCard } from "@/components/tracks/track-card";
import { HorizontalScrollSkeleton } from "@/components/ui/skeleton";
import { usePlayerStore } from "@/lib/player-store";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase";
import {
  getTrendingTracks,
  getNewestTracks,
  getTracksByGenre,
} from "@/lib/jamendo";
import type { Track } from "@/types";

export default function HomePage() {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [newestTracks, setNewestTracks] = useState<Track[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
  const [topGenre, setTopGenre] = useState<string>("electronic");
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingNewest, setIsLoadingNewest] = useState(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);

  const { setCurrentTrack, setQueue, favorites, toggleFavorite } =
    usePlayerStore();
  const toast = useToast();

  // Load sections
  useEffect(() => {
    loadTrendingTracks();
    loadNewestTracks();
    loadTopGenre();
  }, []);

  // Load recommended when top genre changes
  useEffect(() => {
    if (topGenre) {
      loadRecommendedTracks();
    }
  }, [topGenre]);

  async function loadTrendingTracks() {
    try {
      setIsLoadingTrending(true);
      const tracks = await getTrendingTracks(20);
      setTrendingTracks(tracks);
    } catch (error) {
      console.error("Error loading trending tracks:", error);
      toast.error("Erro ao carregar músicas em alta");
    } finally {
      setIsLoadingTrending(false);
    }
  }

  async function loadNewestTracks() {
    try {
      setIsLoadingNewest(true);
      const tracks = await getNewestTracks(20);
      setNewestTracks(tracks);
    } catch (error) {
      console.error("Error loading newest tracks:", error);
      toast.error("Erro ao carregar novos lançamentos");
    } finally {
      setIsLoadingNewest(false);
    }
  }

  async function loadTopGenre() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setTopGenre("electronic");
        return;
      }

      // Get most favorited genre
      const { data: favorites } = await supabase
        .from("favorites")
        .select("track_id")
        .eq("user_id", session.user.id)
        .limit(50);

      // For now, default to popular genre
      // In production, you'd track genre preferences
      setTopGenre("electronic");
    } catch (error) {
      console.error("Error determining top genre:", error);
      setTopGenre("electronic");
    }
  }

  async function loadRecommendedTracks() {
    try {
      setIsLoadingRecommended(true);
      const tracks = await getTracksByGenre(topGenre, 20);
      setRecommendedTracks(tracks);
    } catch (error) {
      console.error("Error loading recommended tracks:", error);
      toast.error("Erro ao carregar recomendações");
    } finally {
      setIsLoadingRecommended(false);
    }
  }

  const handlePlayTrack = useCallback(
    (track: Track, allTracks: Track[]) => {
      setCurrentTrack(track);
      setQueue(allTracks);
      toast.success(`Reproduzindo: ${track.name}`);
    },
    [setCurrentTrack, setQueue, toast]
  );

  const handleToggleFavorite = useCallback(
    async (trackId: string) => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          toast.error("Faça login para adicionar aos favoritos");
          return;
        }

        const isFavorite = favorites.has(trackId);

        if (isFavorite) {
          // Remove from favorites
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", session.user.id)
            .eq("track_id", trackId);

          if (error) throw error;
          toggleFavorite(trackId);
          toast.success("Removido de favoritos");
        } else {
          // Add to favorites
          const { error } = await supabase
            .from("favorites")
            .insert({
              user_id: session.user.id,
              track_id: trackId,
            });

          if (error) throw error;
          toggleFavorite(trackId);
          toast.success("Adicionado aos favoritos");
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        toast.error("Erro ao atualizar favoritos");
      }
    },
    [favorites, toggleFavorite, toast]
  );

  return (
    <AppLayout>
      <div className="space-y-12 pb-48 p-6 md:p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Descobrir
          </h1>
          <p className="text-[var(--text-secondary)]">
            Explore música independente com licença Creative Commons
          </p>
        </div>

        {/* Em alta no Jamendo */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              🔥 Em alta no Jamendo
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              As músicas mais tocadas agora
            </p>
          </div>

          {isLoadingTrending ? (
            <HorizontalScrollSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {trendingTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={() => handlePlayTrack(track, trendingTracks)}
                  isFavorite={favorites.has(track.id)}
                  onFavoriteToggle={() => handleToggleFavorite(track.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Novos Lançamentos */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              ✨ Novos Lançamentos
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Músicas adicionadas recentemente
            </p>
          </div>

          {isLoadingNewest ? (
            <HorizontalScrollSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {newestTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={() => handlePlayTrack(track, newestTracks)}
                  isFavorite={favorites.has(track.id)}
                  onFavoriteToggle={() => handleToggleFavorite(track.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recomendado */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              💡 Recomendado para você
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Baseado em {topGenre}
            </p>
          </div>

          {isLoadingRecommended ? (
            <HorizontalScrollSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recommendedTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={() => handlePlayTrack(track, recommendedTracks)}
                  isFavorite={favorites.has(track.id)}
                  onFavoriteToggle={() => handleToggleFavorite(track.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
