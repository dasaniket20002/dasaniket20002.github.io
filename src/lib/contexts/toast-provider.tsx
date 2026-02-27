import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import IconAlertTriangle from "../components/svg/icon-alert-triangle";
import IconCheck from "../components/svg/icon-check";
import IconInfoCircle from "../components/svg/icon-info-circle";
import IconX from "../components/svg/icon-x";
import {
  ToastContext,
  type ToastData,
  type ToastOptions,
  type ToastType,
} from "./use-toast";

const MAX_TOASTS = 5;
let counter = 0;

const iconMap: Record<
  ToastType,
  React.ComponentType<{ className?: string }>
> = {
  success: IconCheck,
  error: IconX,
  info: IconInfoCircle,
  warning: IconAlertTriangle,
};

// ── ToastItem ──────────────────────────────────────────────────────────

function ToastItem({
  data,
  onDismiss,
}: {
  data: ToastData;
  onDismiss: (id: string) => void;
}) {
  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(data.duration);
  const startRef = useRef(0);

  // Pausable auto-dismiss
  useEffect(() => {
    if (paused) return;

    startRef.current = Date.now();
    const timer = setTimeout(() => onDismiss(data.id), remainingRef.current);

    return () => {
      clearTimeout(timer);
      remainingRef.current -= Date.now() - startRef.current;
    };
  }, [paused, data.id, onDismiss]);

  const Icon = iconMap[data.type];

  return (
    <m.li
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(3px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative flex items-center gap-3 px-4 py-6 rounded-lg max-h-24 w-full max-w-xl bg-dark-d border shadow-xl border-dark-l pointer-events-auto overflow-hidden cursor-default"
    >
      {/* Icon */}
      <span className="shrink-0 size-8 rounded-lg grid place-items-center stroke-dark-d">
        <Icon className="size-6 stroke-2" />
      </span>

      {/* Message */}
      <p className="flex-1 font-medium tracking-wide text-light-l">
        {data.message}
      </p>

      {/* Close */}
      <button
        onClick={() => onDismiss(data.id)}
        className="shrink-0 stroke-light-d/25 hover:stroke-light-d/75 transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <IconX className="size-4 stroke-1" />
      </button>
    </m.li>
  );
}

// ── Provider ───────────────────────────────────────────────────────────

export default function ToastProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const toast = useCallback(
    (message: string, options?: ToastOptions): string => {
      const id = `toast-${++counter}`;
      setToasts((prev) => {
        const next = [
          ...prev,
          {
            id,
            message,
            type: options?.type ?? "info",
            duration: options?.duration ?? 4000,
          },
        ];
        return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
      });
      return id;
    },
    [],
  );

  const value = useMemo(
    () => ({ toast, dismiss, dismissAll }),
    [toast, dismiss, dismissAll],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ol
        aria-label="Notifications"
        className="fixed inset-6 z-50 flex flex-col gap-2 pointer-events-none place-content-end place-items-end"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} data={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </ol>
    </ToastContext.Provider>
  );
}
