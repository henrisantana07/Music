// User & Auth types
export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Track types (from Jamendo API)
export interface Track {
  id: string;
  name: string;
  artist_id: string;
  artist_name: string;
  album_id?: string;
  album_name?: string;
  duration: number; // in seconds
  image?: string; // album/track cover URL
  audio?: string; // streaming URL
  audiodownload?: string; // download URL
  license_ccurl?: string; // CC license URL
  license_shortname?: string; // CC license name (e.g., "CC-BY-SA")
  releasedate?: string; // YYYY-MM-DD
  tags?: string[]; // genres/tags
}

// Favorite types
export interface Favorite {
  id: string;
  user_id: string;
  track_id: string;
  created_at: string;
  track?: Track; // denormalized track data
}

// Playlist types
export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  track_count?: number;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  added_at: string;
  track?: Track; // denormalized track data
}

// Player state
export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  favorites: Set<string>; // set of favorited track IDs for quick lookup
}

// License info modal
export interface LicenseInfo {
  track: Track;
  isOpen: boolean;
}

// API Response types
export interface JamendoTracksResponse {
  results: Track[];
  headers: {
    code: number;
    error_message?: string;
    results_count: number;
  };
}

export interface SearchFilters {
  query: string;
  genres?: string[];
  artist?: string;
  duration?: "short" | "medium" | "long"; // <3min, 3-7min, >7min
  year?: number;
  page?: number;
  limit?: number;
}

// UI Component Props
export interface CardProps {
  track: Track;
  onPlay: (track: Track) => void;
  isFavorite: boolean;
  onFavoriteToggle: (trackId: string) => void;
  isLoading?: boolean;
}

export interface SkeletonProps {
  className?: string;
}

// Toast/Notification
export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  duration?: number;
}
