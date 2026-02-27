// use-toast.ts
import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastData = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
};

export type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

export type ToastContextValue = {
  toast: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
