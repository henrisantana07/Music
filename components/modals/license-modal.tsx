"use client";

import { Track } from "@/types";
import { X, ExternalLink } from "lucide-react";

interface LicenseModalProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
}

export function LicenseModal({ track, isOpen, onClose }: LicenseModalProps) {
  if (!isOpen) return null;

  const licenseMap: Record<string, { name: string; description: string }> = {
    "CC-BY": {
      name: "Atribuição (CC-BY)",
      description:
        "Você pode usar, modificar e distribuir a obra, desde que credite o autor original.",
    },
    "CC-BY-SA": {
      name: "Atribuição - Compartilha Igual (CC-BY-SA)",
      description:
        "Você pode usar, modificar e distribuir, desde que credite o autor e compartilhe sob a mesma licença.",
    },
    "CC-BY-ND": {
      name: "Atribuição - Sem Derivadas (CC-BY-ND)",
      description:
        "Você pode distribuir a obra sem modificações, desde que credite o autor.",
    },
    "CC-BY-NC": {
      name: "Atribuição - Não Comercial (CC-BY-NC)",
      description:
        "Você pode usar para fins não comerciais, desde que credite o autor.",
    },
    "CC-BY-NC-SA": {
      name: "Atribuição - Não Comercial - Compartilha Igual",
      description:
        "Você pode usar para fins não comerciais, desde que credite o autor e compartilhe sob a mesma licença.",
    },
    "CC-BY-NC-ND": {
      name: "Atribuição - Não Comercial - Sem Derivadas",
      description:
        "Você pode distribuir para fins não comerciais, sem modificações.",
    },
    "CC0": {
      name: "Domínio Público (CC0)",
      description:
        "Você pode usar a obra livremente, sem restrições (quando possível).",
    },
  };

  const licenseShort = track.license_shortname || "CC-BY";
  const licenseInfo = licenseMap[licenseShort] || licenseMap["CC-BY"];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--bg-elevated)] rounded-lg shadow-lg max-w-md w-full animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--bg-surface)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Informações de Licença
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Track Info */}
            <div className="space-y-2">
              <p className="text-sm text-[var(--text-secondary)]">Faixa</p>
              <p className="font-semibold text-[var(--text-primary)]">
                {track.name}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {track.artist_name}
              </p>
            </div>

            {/* License Badge */}
            <div className="py-3 px-4 rounded-lg bg-[var(--accent-muted-transparent)] border border-[var(--accent-solid)]">
              <p className="text-sm font-semibold text-[var(--accent-solid)]">
                {licenseInfo.name}
              </p>
            </div>

            {/* License Description */}
            <div className="space-y-2">
              <p className="text-sm text-[var(--text-secondary)]">Termos:</p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {licenseInfo.description}
              </p>
            </div>

            {/* Link to License */}
            {track.license_ccurl && (
              <a
                href={track.license_ccurl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--accent-solid)] hover:text-[var(--accent-from)] transition-colors"
              >
                Leia a licença completa
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Attribution */}
            <div className="py-3 px-4 bg-[var(--bg-surface)] rounded-lg space-y-2">
              <p className="text-xs text-[var(--text-secondary)] uppercase font-semibold">
                Como atribuir
              </p>
              <p className="text-sm text-[var(--text-primary)]">
                "{track.name}" por{" "}
                <span className="font-semibold">{track.artist_name}</span>
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Licença: {licenseShort} | Obtido em: Ember Music / Jamendo
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--bg-surface)] flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
