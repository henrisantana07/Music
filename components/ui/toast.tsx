"use client";

import { create } from "zustand";
import { Toast } from "@/types";
import { useEffect, useRef } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastStore {
  toasts: Toast[];
  addToast: (
    message: string,
    type?: "success" | "error" | "info",
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "info", duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  useEffect(() => {
    if (toast.duration === 0) return;

    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const bgColor =
    toast.type === "success"
      ? "bg-[var(--bg-surface)] border-l-4 border-[var(--success)]"
      : toast.type === "error"
        ? "bg-[var(--bg-surface)] border-l-4 border-[var(--error)]"
        : "bg-[var(--bg-surface)] border-l-4 border-[var(--accent-solid)]";

  const Icon =
    toast.type === "success"
      ? CheckCircle
      : toast.type === "error"
        ? AlertCircle
        : Info;

  const iconColor =
    toast.type === "success"
      ? "text-[var(--success)]"
      : toast.type === "error"
        ? "text-[var(--error)]"
        : "text-[var(--accent-solid)]";

  return (
    <div
      className={`${bgColor} flex items-center gap-3 p-4 rounded-lg shadow-lg animate-in slide-in-from-right-5 fade-in duration-200`}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`${iconColor} w-5 h-5 flex-shrink-0`} />
      <p className="text-sm text-[var(--text-primary)] flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-32 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const { addToast } = useToastStore();

  return {
    success: (message: string, duration?: number) =>
      addToast(message, "success", duration),
    error: (message: string, duration?: number) =>
      addToast(message, "error", duration),
    info: (message: string, duration?: number) =>
      addToast(message, "info", duration),
  };
}
