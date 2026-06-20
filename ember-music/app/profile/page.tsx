"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";
import { Upload, LogOut, Loader } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [topGenre, setTopGenre] = useState("N/A");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      // Get profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") throw profileError;

      // Create profile if doesn't exist
      if (!profileData) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            user_id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }

      // Load stats
      const { count: favCount } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id);

      setFavoriteCount(favCount || 0);

      // TODO: Calculate top genre from favorites
      setTopGenre("Electronic");
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAvatarUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    try {
      if (!event.target.files || !profile) return;

      const file = event.target.files[0];
      if (!file) return;

      // Validate file
      if (!file.type.startsWith("image/")) {
        toast.error("Arquivo deve ser uma imagem");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem deve ter menos de 5MB");
        return;
      }

      setIsUploadingAvatar(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Upload file
      const fileName = `${session.user.id}-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("user_id", session.user.id);

      if (updateError) throw updateError;

      setProfile({
        ...profile,
        avatar_url: data.publicUrl,
      });

      toast.success("Avatar atualizado com sucesso");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Erro ao fazer upload do avatar");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      toast.success("Desconectado com sucesso");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao desconectar");
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-lg gradient-accent mx-auto animate-pulse" />
            <p className="text-[var(--text-secondary)]">Carregando perfil...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-6 md:p-8 space-y-8 pb-48">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            👤 Meu Perfil
          </h1>
          <p className="text-[var(--text-secondary)]">
            Gerencie suas informações e preferências
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[var(--bg-surface)] rounded-lg p-8 space-y-6 border border-[var(--bg-elevated)]">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  profile?.avatar_url ||
                  "https://via.placeholder.com/128?text=Avatar"
                }
                alt={profile?.full_name || "Avatar"}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-[var(--bg-elevated)]"
              />

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 p-3 gradient-accent rounded-full text-[var(--bg-base)] hover:shadow-lg transition-shadow disabled:opacity-50"
                title="Alterar avatar"
              >
                {isUploadingAvatar ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                aria-label="Upload de avatar"
              />
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                {profile?.full_name || "Usuário"}
              </h2>
              <p className="text-[var(--text-secondary)] mt-1">
                {profile?.email}
              </p>

              <div className="mt-4 flex gap-6 text-center sm:text-left">
                <div>
                  <p className="text-2xl font-bold text-[var(--accent-from)]">
                    {favoriteCount}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Favorito{favoriteCount !== 1 ? "s" : ""}
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-[var(--accent-from)]">
                    {topGenre}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Gênero favorito
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--bg-elevated)]" />

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Configurações
            </h3>

            {/* Email Notification */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded accent-[var(--accent-from)]"
                aria-label="Receber notificações por email"
              />
              <span className="text-sm text-[var(--text-primary)]">
                Receber notificações por email
              </span>
            </label>

            {/* Privacy */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded accent-[var(--accent-from)]"
                aria-label="Mostrar status de reprodução"
              />
              <span className="text-sm text-[var(--text-primary)]">
                Mostrar status de reprodução
              </span>
            </label>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--bg-elevated)]" />

          {/* Danger Zone */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--error)]">
              Zona de Risco
            </h3>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 border border-[var(--error)] text-[var(--error)] rounded-lg hover:bg-[var(--error)]/10 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-[var(--bg-surface)] rounded-lg p-6 border border-[var(--bg-elevated)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Sobre
          </h3>

          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              🎵 <span className="font-semibold">Ember Music</span> é uma plataforma
              de streaming de música com conteúdo licenciado sob Creative
              Commons.
            </p>

            <p>
              💿 Todas as músicas vêm de{" "}
              <a
                href="https://www.jamendo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-solid)] hover:text-[var(--accent-from)]"
              >
                Jamendo
              </a>
              , uma plataforma de distribuição de música independente.
            </p>

            <p>
              📜 Para informações completas sobre licenças, consulte a página
              de cada música.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
