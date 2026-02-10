import { useEffect, useRef, useMemo, useCallback } from "react";
import { useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "../utils";

interface TextPressureProps {
  text?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
  writingMode?: "horizontal-tb" | "vertical-lr" | "vertical-rl";
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (
  distance: number,
  maxDist: number,
  minVal: number,
  maxVal: number,
) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const TextPressure: React.FC<TextPressureProps> = ({
  text = "Compressa",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#FFFFFF",
  strokeColor = "#FF0000",
  strokeWidth = 2,
  className = "",
  minFontSize = 24,
  writingMode = "horizontal-tb",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const fontSizeMV = useMotionValue(minFontSize);
  const scaleXMV = useMotionValue(1);
  const scaleYMV = useMotionValue(1);
  const lineHeightMV = useMotionValue(1);

  const fontSizePx = useTransform(fontSizeMV, (v) => `${v}px`);

  const isVertical = writingMode !== "horizontal-tb";
  const chars = useMemo(() => text.split(""), [text]);

  const transformOrigin = isVertical
    ? writingMode === "vertical-rl"
      ? "right center"
      : "left center"
    : "center top";

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set(cx);
      mouseY.set(cy);
      cursorX.set(cx);
      cursorY.set(cy);
    }
  }, [mouseX, mouseY, cursorX, cursorY]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorX.set(t.clientX);
      cursorY.set(t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [cursorX, cursorY]);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const primaryDimension = isVertical
      ? containerRect.height
      : containerRect.width;

    let newFontSize = primaryDimension / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    fontSizeMV.set(newFontSize);
    scaleXMV.set(1);
    scaleYMV.set(1);
    lineHeightMV.set(1);

    requestAnimationFrame(() => {
      if (!titleRef.current || !containerRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();
      const cRect = containerRef.current.getBoundingClientRect();

      if (scale) {
        if (isVertical && textRect.width > 0) {
          scaleXMV.set(cRect.width / textRect.width);
        } else if (!isVertical && textRect.height > 0) {
          const ratio = cRect.height / textRect.height;
          scaleYMV.set(ratio);
          lineHeightMV.set(ratio);
        }
      }
    });
  }, [
    chars.length,
    minFontSize,
    scale,
    isVertical,
    fontSizeMV,
    scaleXMV,
    scaleYMV,
    lineHeightMV,
  ]);

  useEffect(() => {
    setSize();
    let tid: number;
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(setSize, 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(tid);
    };
  }, [setSize]);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      mouseX.set(mouseX.get() + (cursorX.get() - mouseX.get()) / 15);
      mouseY.set(mouseY.get() + (cursorY.get() - mouseY.get()) / 15);

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = Math.max(
          isVertical ? titleRect.height / 2 : titleRect.width / 2,
          1,
        );

        const mx = mouseX.get();
        const my = mouseY.get();

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };
          const d = dist({ x: mx, y: my }, charCenter);

          const wdth = width ? Math.floor(getAttr(d, maxDist, 75, 125)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : "0";
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : "1";

          const fvs = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (span.style.fontVariationSettings !== fvs) {
            span.style.fontVariationSettings = fvs;
          }
          if (alpha && span.style.opacity !== alphaVal) {
            span.style.opacity = alphaVal;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [
    width,
    weight,
    italic,
    alpha,
    isVertical,
    mouseX,
    mouseY,
    cursorX,
    cursorY,
  ]);

  const styleElement = useMemo(
    () => (
      <style>{`
        .text-pressure-stroke span {
          position: relative;
          color: var(--tp-text-color);
        }
        .text-pressure-stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: var(--tp-stroke-width);
          -webkit-text-stroke-color: var(--tp-stroke-color);
        }
      `}</style>
    ),
    [],
  );

  return (
    <div
      ref={containerRef}
      className="relative size-full overflow-hidden bg-transparent"
    >
      {styleElement}
      <m.h1
        ref={titleRef}
        className={cn(
          "text-pressure-title m-0 font-thin uppercase text-center",
          "text-(length:--tp-font-size)",
          "leading-(--tp-line-height)",
          "origin-(--tp-transform-origin)",
          writingMode === "horizontal-tb" && "[writing-mode:horizontal-tb]",
          writingMode === "vertical-lr" && "[writing-mode:vertical-lr]",
          writingMode === "vertical-rl" && "[writing-mode:vertical-rl]",
          flex && "flex justify-between",
          stroke && "text-pressure-stroke",
          !stroke && "text-(--tp-text-color)",
          isVertical && "h-full",
          className,
        )}
        style={
          {
            "--tp-font-size": fontSizePx,
            "--tp-line-height": lineHeightMV,
            "--tp-transform-origin": transformOrigin,
            "--tp-text-color": textColor,
            "--tp-stroke-color": strokeColor,
            "--tp-stroke-width": `${strokeWidth}px`,
            scaleX: scaleXMV,
            scaleY: scaleYMV,
          } as React.CSSProperties
        }
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            className="inline-block"
          >
            {char}
          </span>
        ))}
      </m.h1>
    </div>
  );
};

export default TextPressure;
