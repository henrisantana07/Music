import { SkeletonProps } from "@/types";
import { clsx } from "clsx";

export function TrackCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Album cover skeleton */}
      <div className="w-full aspect-square rounded-lg bg-[var(--bg-surface)]" />

      {/* Title skeleton */}
      <div className="h-4 bg-[var(--bg-surface)] rounded w-3/4" />

      {/* Artist skeleton */}
      <div className="h-3 bg-[var(--bg-surface)] rounded w-1/2" />
    </div>
  );
}

export function PlayerSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      {/* Album cover */}
      <div className="w-16 h-16 rounded-lg bg-[var(--bg-surface)] flex-shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-[var(--bg-surface)] rounded w-3/4 mb-2" />
        <div className="h-3 bg-[var(--bg-surface)] rounded w-1/2" />
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)]" />
        <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)]" />
        <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)]" />
      </div>
    </div>
  );
}

export function HorizontalScrollSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden pb-2 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-48">
          <TrackCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx("bg-[var(--bg-surface)] animate-pulse rounded", className)} />;
}
