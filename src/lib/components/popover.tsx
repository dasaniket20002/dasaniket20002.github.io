import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Portal from "./portal";

type Placement = "above" | "below";

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  gap?: number;
}

export default function Popover({
  open,
  onClose,
  anchorRef,
  children,
  gap = 6,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const placementRef = useRef<Placement>("below");
  const [positionStyles, setPositionStyles] = useState<CSSProperties>({});

  // Recompute coordinates from current anchor rect + cached placement
  const updateCoords = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const left = rect.left + rect.width / 2;
    const next: CSSProperties = { left };

    if (placementRef.current === "below") {
      next.top = rect.bottom + gap;
    } else {
      next.bottom = window.innerHeight - rect.top + gap;
    }

    setPositionStyles(next);
  }, [anchorRef, gap]);

  // Determine placement on open, then position
  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    placementRef.current = spaceBelow >= spaceAbove ? "below" : "above";
    updateCoords();
  }, [open, anchorRef, updateCoords]);

  // Track scroll / resize while open
  useEffect(() => {
    if (!open) return;

    window.addEventListener("scroll", updateCoords, true);
    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [open, updateCoords]);

  // Close on pointer-down outside both anchor and popover
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const inPopover = popoverRef.current?.contains(target) ?? false;
      const inAnchor = anchorRef.current?.contains(target) ?? false;

      if (!inPopover && !inAnchor) onClose();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onClose, anchorRef]);

  return (
    <Portal>
      <div
        ref={popoverRef}
        style={{
          position: "fixed",
          ...positionStyles,
          transform: "translateX(-50%)",
          zIndex: 50,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {children}
      </div>
    </Portal>
  );
}
