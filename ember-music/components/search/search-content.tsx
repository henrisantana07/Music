"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { TrackCard } from "@/components/tracks/track-card";
import { HorizontalScrollSkeleton } from "@/components/ui/skeleton";
import { usePlayerStore } from "@/lib/player-store";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase";
import { searchTracks, getGenres } from "@/lib/jamendo";
import type { Track, SearchFilters } from "@/types";
import { X } from "lucide-react";

export function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  // Filters
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<
    "short" | "medium" | "long" | ""
  >("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");

  const { setCurrentTrack, setQueue, favorites, toggleFavorite } =
    usePlayerStore();
  const toast = useToast();

  // Load genres on mount
  useEffect(() => {
    loadGenres();
  }, []);

  // Search when query or filters change
  useEffect(() => {
    if (query || selectedGenres.length || selectedDuration || selectedYear) {
      performSearch();
    }
  }, [selectedGenres, selectedDuration, selectedYear]);

  // Search on initial query
  useEffect(() => {
    if (initialQuery) {
      performSearch();
    }
  }, []);

  async function loadGenres() {
    try {
      const genreList = await getGenres();
      setGenres(genreList.slice(0, 15)); // Show top 15 genres
    } catch (error) {
      console.error("Error loading genres:", error);
    }
  }

  async function performSearch() {
    try {
      if (!query && !selectedGenres.length && !selectedDuration && !selectedYear) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      const filters: SearchFilters = {
        query,
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        duration: selectedDuration || undefined,
        year: selectedYear ? Number(selectedYear) : undefined,
        limit: 50,
      };

      const tracks = await searchTracks(filters);
      setResults(tracks);

      if (tracks.length === 0) {
        toast.info("Nenhum resultado encontrado");
      }
    } catch (error) {
      console.error("Error searching tracks:", error);
      toast.error("Erro ao buscar músicas");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePlayTrack = useCallback(
    (track: Track) => {
      setCurrentTrack(track);
      setQueue(results);
      toast.success(`Reproduzindo: ${track.name}`);
    },
    [results, setCurrentTrack, setQueue, toast]
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
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", session.user.id)
            .eq("track_id", trackId);

          if (error) throw error;
          toggleFavorite(trackId);
          toast.success("Removido de favoritos");
        } else {
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

  const handleClearFilters = () => {
    setQuery("");
    setSelectedGenres([]);
    setSelectedDuration("");
    setSelectedYear("");
    setResults([]);
    setHasSearched(false);
  };

  const handleRemoveGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre));
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 pb-48">
        {/* Search Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Buscar
          </h1>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Buscar músicas, artistas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                performSearch();
              }
            }}
            className="w-full max-w-2xl px-4 py-3 bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-disabled)] rounded-lg border border-[var(--bg-elevated)] focus:border-[var(--accent-solid)] focus:outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Gêneros
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setSelectedGenres(
                      selectedGenres.includes(genre)
                        ? selectedGenres.filter((g) => g !== genre)
                        : [...selectedGenres, genre]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedGenres.includes(genre)
                      ? "gradient-accent text-[var(--bg-base)] font-semibold"
                      : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Duração
            </h3>
            <div className="flex gap-2">
              {[
                { value: "short" as const, label: "Curtas (<3 min)" },
                { value: "medium" as const, label: "Médias (3-7 min)" },
                { value: "long" as const, label: "Longas (>7 min)" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() =>
                    setSelectedDuration(selectedDuration === value ? "" : value)
                  }
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedDuration === value
                      ? "gradient-accent text-[var(--bg-base)] font-semibold"
                      : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Ano
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as any)}
              className="px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-lg border border-[var(--bg-elevated)] focus:border-[var(--accent-solid)] focus:outline-none"
            >
              <option value="">Todos os anos</option>
              {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Clear Filters */}
          {(query ||
            selectedGenres.length > 0 ||
            selectedDuration ||
            selectedYear) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-[var(--accent-solid)] hover:text-[var(--accent-from)] transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Selected Tags */}
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genre) => (
              <div
                key={genre}
                className="px-3 py-1 rounded-full bg-[var(--accent-muted-transparent)] border border-[var(--accent-solid)] text-[var(--accent-solid)] text-sm flex items-center gap-2"
              >
                {genre}
                <button
                  onClick={() => handleRemoveGenre(genre)}
                  className="hover:text-[var(--accent-from)]"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            <HorizontalScrollSkeleton />
          ) : hasSearched ? (
            <>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado
                {results.length !== 1 ? "s" : ""}
              </h2>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {results.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      onPlay={() => handlePlayTrack(track)}
                      isFavorite={favorites.has(track.id)}
                      onFavoriteToggle={() => handleToggleFavorite(track.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <p className="text-lg text-[var(--text-secondary)]">
                    Nenhuma música encontrada
                  </p>
                  <p className="text-sm text-[var(--text-disabled)]">
                    Tente outros termos ou filtros
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 space-y-3">
              <p className="text-lg text-[var(--text-secondary)]">
                Comece a buscar
              </p>
              <p className="text-sm text-[var(--text-disabled)]">
                Procure por músicas, artistas ou gêneros
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
