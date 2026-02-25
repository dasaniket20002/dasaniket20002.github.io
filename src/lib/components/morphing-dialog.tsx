import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  MotionConfig,
  type Transition,
  type Variant,
} from "motion/react";
import * as m from "motion/react-m";
import { createPortal } from "react-dom";
import { cn } from "../utils";
import { useStickySnap } from "../contexts/use-sticky-snap";
import { useClickOutside } from "../hooks/use-click-outside";
import IconX from "./svg/icon-x";

export type MorphingDialogContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const MorphingDialogContext =
  React.createContext<MorphingDialogContextType | null>(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error(
      "useMorphingDialog must be used within a MorphingDialogProvider",
    );
  }
  return context;
}

export type MorphingDialogProviderProps = {
  children: React.ReactNode;
  transition?: Transition;
};

function MorphingDialogProvider({
  children,
  transition,
}: MorphingDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null!);

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      uniqueId,
      triggerRef,
    }),
    [isOpen, uniqueId],
  );

  return (
    <MorphingDialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

export type MorphingDialogProps = {
  children: React.ReactNode;
  transition?: Transition;
};

function MorphingDialog({ children, transition }: MorphingDialogProps) {
  return <MorphingDialogProvider transition={transition} children={children} />;
}

export type MorphingDialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  triggerRef?: React.RefObject<HTMLButtonElement>;
  disableLayoutAnimation?: boolean;
};

function MorphingDialogTrigger({
  children,
  className,
  style,
  triggerRef,
  disableLayoutAnimation,
}: MorphingDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId } = useMorphingDialog();

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    },
    [isOpen, setIsOpen],
  );

  return (
    <m.button
      ref={triggerRef}
      layoutId={disableLayoutAnimation ? undefined : `dialog-${uniqueId}`}
      className={cn("relative cursor-pointer", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`motion-ui-morphing-dialog-content-${uniqueId}`}
      aria-label={`Open dialog ${uniqueId}`}
      type="button"
    >
      {children}
    </m.button>
  );
}

export type MorphingDialogContentProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogContent({
  children,
  className,
  style,
}: MorphingDialogContentProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog();
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFocusableElement = useRef<HTMLElement>(null);
  const lastFocusableElement = useRef<HTMLElement>(null);

  const { lockScroll, unlockScroll } = useStickySnap();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      if (event.key === "Tab") {
        if (!firstFocusableElement || !lastFocusableElement) return;

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement.current) {
            event.preventDefault();
            lastFocusableElement.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement.current) {
            event.preventDefault();
            firstFocusableElement.current?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  // Synchronous before paint — locks before Lenis's next RAF tick
  useLayoutEffect(() => {
    if (isOpen) {
      lockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isOpen, lockScroll, unlockScroll]);

  // After paint — focus management
  useEffect(() => {
    if (isOpen) {
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusableElements && focusableElements.length > 0) {
        firstFocusableElement.current = focusableElements[0] as HTMLElement;
        lastFocusableElement.current = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;
        firstFocusableElement.current.focus();
      }
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <m.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("overflow-hidden", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`motion-ui-morphing-dialog-title-${uniqueId}`}
      aria-describedby={`motion-ui-morphing-dialog-description-${uniqueId}`}
    >
      {children}
    </m.div>
  );
}

export type MorphingDialogContainerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogContainer({ children }: MorphingDialogContainerProps) {
  const { isOpen, uniqueId } = useMorphingDialog();

  return createPortal(
    <AnimatePresence initial={false} mode="wait">
      {isOpen && (
        <>
          <m.div
            key={`backdrop-${uniqueId}`}
            // className="fixed inset-0 h-full w-full z-9998 bg-dark-2/40 backdrop-blur-xs"
            className="fixed inset-0 z-99 bg-size-[4px_4px] backdrop-blur-xs bg-[radial-gradient(transparent_1px,var(--color-dark-d)_1px)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 z-99 flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export type MorphingDialogTitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disableLayoutAnimation?: boolean;
};

function MorphingDialogTitle({
  children,
  className,
  style,
  disableLayoutAnimation,
}: MorphingDialogTitleProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <m.h1
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-title-container-${uniqueId}`
      }
      className={className}
      style={style}
      layout
    >
      {children}
    </m.h1>
  );
}

export type MorphingDialogSubtitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disableLayoutAnimation?: boolean;
};

function MorphingDialogSubtitle({
  children,
  className,
  style,
  disableLayoutAnimation,
}: MorphingDialogSubtitleProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <m.p
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-subtitle-container-${uniqueId}`
      }
      className={className}
      style={style}
    >
      {children}
    </m.p>
  );
}

export type MorphingDialogSpanProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disableLayoutAnimation?: boolean;
  identifier: string | number;
};

function MorphingDialogSpan({
  children,
  className,
  style,
  disableLayoutAnimation,
  identifier,
}: MorphingDialogSpanProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <m.span
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-title-container-${identifier}-${uniqueId}`
      }
      className={className}
      style={style}
      layout
    >
      {children}
    </m.span>
  );
}

export type MorphingDialogDescriptionProps = {
  children: React.ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
  transition?: Transition;
};

function MorphingDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
  transition,
}: MorphingDialogDescriptionProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <m.div
      key={`dialog-description-${uniqueId}`}
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`dialog-description-${uniqueId}`}
      transition={transition}
    >
      {children}
    </m.div>
  );
}

export type MorphingDialogImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogImage({
  src,
  alt,
  className,
  style,
}: MorphingDialogImageProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <m.div
      className={className}
      layoutId={`dialog-img-container-${uniqueId}`}
      style={style}
    >
      <m.img
        src={src}
        alt={alt}
        layoutId={`dialog-img-${uniqueId}`}
        className="size-full object-contain"
      />
    </m.div>
  );
}

export type MorphingDialogCloseProps = {
  children?: React.ReactNode;
  className?: string;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
};

function MorphingDialogClose({
  children,
  className,
  variants,
}: MorphingDialogCloseProps) {
  const { setIsOpen, uniqueId } = useMorphingDialog();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <m.button
      onClick={handleClose}
      type="button"
      aria-label="Close dialog"
      key={`dialog-close-${uniqueId}`}
      className={cn("absolute top-6 right-6", className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children || <IconX className="size-5" />}
    </m.button>
  );
}

export {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogSpan,
  MorphingDialogDescription,
  MorphingDialogImage,
};
