"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/lib/player-store";
import { useToast } from "@/components/ui/toast";
import { LicenseModal } from "@/components/modals/license-modal";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Download,
  Info,
} from "lucide-react";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const toast = useToast();

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isFavorite,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    toggleFavorite,
    playNext,
    playPrevious,
  } = usePlayerStore();

  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.audio) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Playback error:", err);
        toast.error("Erro ao reproduzir música");
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack, toast]);

  // Update current time
  const handleTimeUpdate = () => {
    if (audioRef.current && !isDraggingProgress) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Update duration
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle track end
  const handleEnded = () => {
    playNext();
  };

  // Format time
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!currentTrack?.audiodownload) {
      toast.error("Download não disponível para esta faixa");
      return;
    }

    const link = document.createElement("a");
    link.href = currentTrack.audiodownload;
    link.download = `${currentTrack.artist_name} - ${currentTrack.name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download iniciado");
  };

  if (!currentTrack) {
    return (
      <div className="h-24 bg-[var(--bg-elevated)] border-t border-[var(--bg-surface)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)] text-sm">
          Selecione uma música para começar
        </p>
      </div>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="h-24 bg-[var(--bg-elevated)] border-t border-[var(--bg-surface)] flex items-center px-4 gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-64 flex-shrink-0">
          {currentTrack.image && (
            <img
              src={currentTrack.image}
              alt={currentTrack.name}
              className="w-14 h-14 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {currentTrack.name}
            </p>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {currentTrack.artist_name}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Time Display & Progress */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] w-8">
              {formatTime(currentTime)}
            </span>

            {/* Progress Track */}
            <div
              className="flex-1 h-1 bg-[var(--bg-surface)] rounded-full cursor-pointer group"
              onClick={handleProgressClick}
              onMouseDown={() => setIsDraggingProgress(true)}
              onMouseUp={() => setIsDraggingProgress(false)}
              onMouseLeave={() => setIsDraggingProgress(false)}
              role="slider"
              aria-label="Progresso da faixa"
              aria-valuenow={Math.floor(currentTime)}
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
            >
              {/* Filled portion with gradient */}
              <div
                className="h-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                {/* Thumb */}
                <div className="float-right w-3 h-3 bg-white rounded-full -mt-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
              </div>
            </div>

            <span className="text-xs text-[var(--text-secondary)] w-8 text-right">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Previous */}
          <button
            onClick={playPrevious}
            className="p-2 hover:text-[var(--accent-solid)] transition-colors text-[var(--text-secondary)]"
            aria-label="Faixa anterior"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 gradient-accent rounded-full text-[var(--bg-base)] hover:shadow-lg transition-shadow"
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            className="p-2 hover:text-[var(--accent-solid)] transition-colors text-[var(--text-secondary)]"
            aria-label="Próxima faixa"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Favorite */}
          <button
            onClick={() => {
              toggleFavorite(currentTrack.id);
              toast.success(
                isFavorite(currentTrack.id)
                  ? "Removido de favoritos"
                  : "Adicionado aos favoritos"
              );
            }}
            className={`p-2 transition-colors ${
              isFavorite(currentTrack.id)
                ? "text-[var(--accent-from)]"
                : "text-[var(--text-secondary)] hover:text-[var(--accent-solid)]"
            }`}
            aria-label="Adicionar aos favoritos"
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorite(currentTrack.id) ? "currentColor" : "none"}
            />
          </button>

          {/* License Info */}
          <button
            onClick={() => setLicenseModalOpen(true)}
            className="p-2 hover:text-[var(--accent-solid)] transition-colors text-[var(--text-secondary)]"
            aria-label="Ver licença"
            title="Informações de licença"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-2 hover:text-[var(--accent-solid)] transition-colors text-[var(--text-secondary)]"
            aria-label="Baixar música"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 group">
            <Volume2 className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-solid)] transition-colors" />
            <div
              className="w-20 h-1 bg-[var(--bg-surface)] rounded-full cursor-pointer relative"
              onMouseDown={() => setIsDraggingVolume(true)}
              onMouseUp={() => setIsDraggingVolume(false)}
              onMouseLeave={() => setIsDraggingVolume(false)}
              role="slider"
              aria-label="Controle de volume"
              aria-valuenow={Math.floor(volume * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] rounded-full"
                style={{ width: `${volume * 100}%` }}
                onClick={(e) => {
                  const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  setVolume(Math.max(0, Math.min(1, percent)));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <LicenseModal
        track={currentTrack}
        isOpen={licenseModalOpen}
        onClose={() => setLicenseModalOpen(false)}
      />
    </>
  );
}
