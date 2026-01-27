import { useCallback, useEffect, useRef } from "react";

export type MaybeEvent =
  | React.PointerEvent
  | React.MouseEvent
  | React.TouchEvent
  | React.KeyboardEvent;

/** Options for the hook */
export type UseLongPressOptions<T extends Element = HTMLElement> = {
  onClick?: (e: React.MouseEvent<T> | React.KeyboardEvent<T>) => void;
  /** Called once when long-press threshold is reached (and before repeat calls) */
  onLongPressStart?: (e: MaybeEvent) => void;
  /** Called when threshold is reached and then repeated every `repeatInterval` ms if > 0 */
  onLongPress?: (e: MaybeEvent) => void;
  /** Called when press ends (pointer up / cancel / unmount / keyboard up) if long-press was active */
  onLongPressEnd?: (e?: MaybeEvent) => void;
  /** Delay (ms) to consider a press "long". Default 500ms */
  delay?: number;
  /** If > 0, call onLongPress repeatedly every repeatInterval while holding. Default 0 (no repeat) */
  repeatInterval?: number;
  /** If true, prevent context menu and native selection while calculating long press. Default true */
  shouldPreventDefault?: boolean;
};

/**
 * Returns props to spread on an element: supports pointer + keyboard (space/enter).
 *
 * Usage:
 * const bind = useLongPress({ onClick, onLongPressStart, onLongPress, onLongPressEnd, delay: 600 });
 * <button {...bind}>Press me</button>
 */
export function useLongPress<T extends HTMLElement = HTMLElement>({
  onClick,
  onLongPressStart,
  onLongPress,
  onLongPressEnd,
  delay = 500,
  repeatInterval = 0,
  shouldPreventDefault = true,
}: UseLongPressOptions<T>) {
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const longPressedRef = useRef(false);
  const targetRef = useRef<EventTarget | null>(null);

  // clear timers and optionally call end callback
  const clear = useCallback(
    (ev?: MaybeEvent, callEnd = true) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (longPressedRef.current) {
        longPressedRef.current = false;
        if (callEnd && onLongPressEnd) onLongPressEnd(ev);
      }
      targetRef.current = null;
    },
    [onLongPressEnd],
  );

  // start the long-press timer
  //   const startPress = useCallback(
  //     (ev: MaybeEvent) => {
  //       // store the target so end can get access if needed
  //       targetRef.current = ev.currentTarget ?? ev.target ?? null;

  //       if (shouldPreventDefault && ev && "preventDefault" in ev) {
  //         // prevent selection / context menu while detecting long press
  //         // note: we don't prevent pointer events (so that pointer capture still works)
  //         try {
  //           ev.preventDefault();
  //         } catch {
  //           /* ignore */
  //         }
  //       }

  //       if (timerRef.current) {
  //         window.clearTimeout(timerRef.current);
  //         timerRef.current = null;
  //       }
  //       if (intervalRef.current) {
  //         window.clearInterval(intervalRef.current);
  //         intervalRef.current = null;
  //       }

  //       timerRef.current = window.setTimeout(() => {
  //         // threshold reached
  //         longPressedRef.current = true;
  //         if (onLongPressStart) onLongPressStart(ev);
  //         if (onLongPress) onLongPress(ev);

  //         // optional repeating calls while holding
  //         if (repeatInterval && repeatInterval > 0) {
  //           intervalRef.current = window.setInterval(() => {
  //             if (onLongPress) onLongPress(ev);
  //           }, repeatInterval);
  //         }
  //       }, delay);
  //     },
  //     [
  //       delay,
  //       onLongPress,
  //       onLongPressStart,
  //       repeatInterval,
  //       shouldPreventDefault,
  //     ],
  //   );
  const startPress = useCallback(
    (ev: MaybeEvent) => {
      longPressedRef.current = false;

      timerRef.current = window.setTimeout(() => {
        longPressedRef.current = true;
        onLongPressStart?.(ev);
        onLongPress?.(ev);

        if (repeatInterval > 0) {
          intervalRef.current = window.setInterval(() => {
            onLongPress?.(ev);
          }, repeatInterval);
        }
      }, delay);
    },
    [delay, onLongPress, onLongPressStart, repeatInterval],
  );

  // pointer handlers (works for mouse + touch)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<T>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      startPress(e);
    },
    [startPress],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<T>) => {
      clearTimeout(timerRef.current!);

      if (longPressedRef.current) {
        onLongPressEnd?.(e);
      }

      clear(e);
    },
    [onLongPressEnd, clear],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<T>) => {
      clear(e, true);
    },
    [clear],
  );

  // mouse move could cancel if it moves too far — optional. For simplicity we won't cancel on move.
  //   const handlePointerMove = useCallback((_: React.PointerEvent<T>) => {
  //     // no-op (could cancel if moving out of bounds)
  //   }, []);

  // click handler: suppress if long press happened
  const handleClick = useCallback(
    (e: React.MouseEvent<T>) => {
      if (longPressedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        longPressedRef.current = false;
        return;
      }
      onClick?.(e);
    },
    [onClick],
  );

  // Keyboard support (Space / Enter)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<T>) => {
      if (e.key === " " || e.key === "Enter") {
        // prevent scrolling on space
        if (e.key === " ") e.preventDefault();
        // begin timer.
        startPress(e);
      }
    },
    [startPress],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<T>) => {
      if (e.key === " " || e.key === "Enter") {
        if (longPressedRef.current) {
          clear(e, true);
        } else {
          clear(e, false);
          // Treat as click for keyboard (if not long press)
          if (onClick) onClick(e);
        }
      }
    },
    [clear, onClick],
  );

  // context menu suppression while timer is running (optional)
  const handleContextMenu = useCallback(
    (e: React.MouseEvent<T>) => {
      if (shouldPreventDefault && timerRef.current) {
        e.preventDefault();
      }
    },
    [shouldPreventDefault],
  );

  // clear on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (longPressedRef.current && onLongPressEnd) {
        onLongPressEnd();
      }
      longPressedRef.current = false;
    };
  }, [onLongPressEnd]);

  // return a binder object to spread into an element
  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    // onPointerMove: handlePointerMove,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onContextMenu: handleContextMenu,
    // accessibility hint: role / tabIndex should be applied by the caller when needed
  };
}

export default useLongPress;
