"use client";

import { Track, CardProps } from "@/types";
import { Play, Heart } from "lucide-react";
import { TrackCardSkeleton } from "@/components/ui/skeleton";

export function TrackCard({
  track,
  onPlay,
  isFavorite,
  onFavoriteToggle,
  isLoading = false,
}: CardProps) {
  if (isLoading) {
    return <TrackCardSkeleton />;
  }

  return (
    <div className="group flex flex-col gap-3 cursor-pointer">
      {/* Album Cover */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[var(--bg-surface)] shadow-sm">
        {track.image && (
          <img
            src={track.image}
            alt={track.name}
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay & Play Button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(track);
            }}
            className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-75 transition-all duration-200 p-3 rounded-full gradient-accent text-[var(--bg-base)] shadow-lg hover:shadow-xl"
            aria-label={`Reproduzir ${track.name}`}
          >
            <Play className="w-6 h-6 ml-0.5" />
          </button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(track.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
            isFavorite
              ? "bg-[var(--accent-from)] text-white shadow-lg"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
          aria-label={isFavorite ? "Remover de favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            className="w-4 h-4"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Track Info */}
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-from)] transition-colors">
          {track.name}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] truncate">
          {track.artist_name}
        </p>
        {track.album_name && (
          <p className="text-xs text-[var(--text-disabled)] truncate">
            {track.album_name}
          </p>
        )}
      </div>

      {/* Duration & License */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-disabled)]">
          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
        </span>
        {track.license_shortname && (
          <span className="text-xs px-2 py-1 rounded bg-[var(--accent-muted-transparent)] text-[var(--accent-solid)]">
            {track.license_shortname}
          </span>
        )}
      </div>
    </div>
  );
}
