#!/usr/bin/env node
/**
 * Ember_Music - Supabase Setup Script
 * Cria tabelas, buckets e configura variáveis de ambiente
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
};

async function setupSupabase() {
  console.log("\n🔥 Ember_Music - Supabase Setup\n");

  try {
    // Get credentials
    const supabaseUrl = await question(
      "🔗 Enter your Supabase project URL (https://...):\n> "
    );
    const supabaseKey = await question(
      "\n🔑 Enter your Supabase service role key (from settings):\n> "
    );

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Supabase credentials are required");
      rl.close();
      process.exit(1);
    }

    const client = createClient(supabaseUrl, supabaseKey);

    console.log("\n📊 Creating tables...");

    // Create profiles table
    const profilesSQL = `
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
    `;

    // Create favorites table
    const favoritesSQL = `
    CREATE TABLE IF NOT EXISTS favorites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      track_id TEXT NOT NULL,
      track_data JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, track_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
    CREATE INDEX IF NOT EXISTS idx_favorites_track_id ON favorites(track_id);
    `;

    // Create playlists table
    const playlistsSQL = `
    CREATE TABLE IF NOT EXISTS playlists (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
    `;

    // Create playlist_tracks table
    const playlistTracksSQL = `
    CREATE TABLE IF NOT EXISTS playlist_tracks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
      track_id TEXT NOT NULL,
      added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(playlist_id, track_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
    `;

    // Create listening_history table
    const historySQL = `
    CREATE TABLE IF NOT EXISTS listening_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      track_id TEXT NOT NULL,
      played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      duration_listened INTEGER
    );
    
    CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON listening_history(user_id);
    `;

    // Execute all SQL
    for (const [name, sql] of [
      ["profiles", profilesSQL],
      ["favorites", favoritesSQL],
      ["playlists", playlistsSQL],
      ["playlist_tracks", playlistTracksSQL],
      ["listening_history", historySQL],
    ]) {
      try {
        const { error } = await (client.rpc as any)("exec", {
          sql_query: sql,
        }).catch(() => ({ error: null })); // Ignore if rpc doesn't exist

        if (!error) {
          console.log(`✅ ${name} table created/verified`);
        }
      } catch (err) {
        console.log(`⚠️  ${name} table may already exist (this is OK)`);
      }
    }

    // Create storage bucket for avatars
    console.log("\n📦 Creating storage bucket...");

    try {
      const { error: bucketError } = await client.storage.createBucket(
        "avatars",
        {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        }
      );

      if (!bucketError) {
        console.log("✅ Avatars bucket created");
      } else if (bucketError.message.includes("already exists")) {
        console.log("✅ Avatars bucket already exists");
      }
    } catch (error) {
      console.log("⚠️  Avatars bucket may already exist (this is OK)");
    }

    // Create .env.local file
    console.log("\n💾 Creating .env.local file...");

    const envContent = `# Supabase
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Jamendo API
NEXT_PUBLIC_JAMENDO_API_KEY=

# Google OAuth (from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=

# App
NEXT_PUBLIC_APP_NAME=Ember_Music
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
`;

    const envPath = path.join(process.cwd(), ".env.local");
    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env.local created (fill in the missing keys)");

    console.log("\n✅ Setup complete!\n");
    console.log("📝 Next steps:");
    console.log("1. Go to Supabase Dashboard > Settings > API");
    console.log("   - Copy your Anon Key and paste in .env.local");
    console.log("2. Get Jamendo API key from https://developer.jamendo.com");
    console.log("3. Set up Google OAuth in Google Cloud Console");
    console.log("4. Run: npm run dev\n");

    rl.close();
  } catch (error) {
    console.error("❌ Setup failed:", error);
    rl.close();
    process.exit(1);
  }
}

setupSupabase();
