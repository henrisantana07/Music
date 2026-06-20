import axios from "axios";
import { Track, SearchFilters, JamendoTracksResponse } from "@/types";

const JAMENDO_API_BASE = "https://api.jamendo.com/v3.0";
const JAMENDO_API_KEY = process.env.NEXT_PUBLIC_JAMENDO_API_KEY;

if (!JAMENDO_API_KEY) {
  console.warn("NEXT_PUBLIC_JAMENDO_API_KEY is not set");
}

const jamendoClient = axios.create({
  baseURL: JAMENDO_API_BASE,
  params: {
    client_id: JAMENDO_API_KEY,
  },
});

/**
 * Search tracks on Jamendo
 */
export async function searchTracks(filters: SearchFilters): Promise<Track[]> {
  try {
    const params: Record<string, any> = {
      format: "json",
      limit: filters.limit || 20,
      offset: ((filters.page || 1) - 1) * (filters.limit || 20),
    };

    if (filters.query) {
      params.search = filters.query;
    }

    if (filters.genres?.length) {
      params.tags = filters.genres.join(",");
    }

    if (filters.artist) {
      params.artist_name = filters.artist;
    }

    if (filters.year) {
      params.datebetween = `${filters.year}-01-01_${filters.year}-12-31`;
    }

    // Duration filter (convert to seconds)
    if (filters.duration) {
      if (filters.duration === "short") {
        params.durationbetween = "0_180"; // 0-3 min
      } else if (filters.duration === "medium") {
        params.durationbetween = "180_420"; // 3-7 min
      } else if (filters.duration === "long") {
        params.durationbetween = "420_999999"; // 7+ min
      }
    }

    const response = await jamendoClient.get<JamendoTracksResponse>(
      "/tracks",
      {
        params,
      }
    );

    return response.data.results || [];
  } catch (error) {
    console.error("Error searching tracks on Jamendo:", error);
    throw error;
  }
}

/**
 * Get trending/popular tracks
 */
export async function getTrendingTracks(limit: number = 20): Promise<Track[]> {
  try {
    const response = await jamendoClient.get<JamendoTracksResponse>(
      "/tracks",
      {
        params: {
          format: "json",
          limit,
          order: "popularity_total",
        },
      }
    );

    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching trending tracks:", error);
    throw error;
  }
}

/**
 * Get newest tracks
 */
export async function getNewestTracks(limit: number = 20): Promise<Track[]> {
  try {
    const response = await jamendoClient.get<JamendoTracksResponse>(
      "/tracks",
      {
        params: {
          format: "json",
          limit,
          order: "dateadded_desc",
        },
      }
    );

    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching newest tracks:", error);
    throw error;
  }
}

/**
 * Get tracks by genre
 */
export async function getTracksByGenre(
  genre: string,
  limit: number = 20
): Promise<Track[]> {
  try {
    const response = await jamendoClient.get<JamendoTracksResponse>(
      "/tracks",
      {
        params: {
          format: "json",
          limit,
          tags: genre,
          order: "popularity_total",
        },
      }
    );

    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching tracks by genre:", error);
    throw error;
  }
}

/**
 * Get available genres/tags
 */
export async function getGenres(): Promise<string[]> {
  try {
    const response = await jamendoClient.get("/metadata/genres", {
      params: {
        format: "json",
      },
    });

    return response.data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

/**
 * Get a single track by ID
 */
export async function getTrackById(trackId: string): Promise<Track | null> {
  try {
    const response = await jamendoClient.get<JamendoTracksResponse>(
      "/tracks",
      {
        params: {
          format: "json",
          id: trackId,
        },
      }
    );

    return response.data.results?.[0] || null;
  } catch (error) {
    console.error("Error fetching track:", error);
    return null;
  }
}
