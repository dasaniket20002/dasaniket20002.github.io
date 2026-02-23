"use client";

import { IconBrandBlender } from "@tabler/icons-react";
import type { MotionValue } from "motion/react";
import {
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "../utils";

/* ================================================================== */
/*  Helpers                                                           */
/* ================================================================== */

const wrapValue = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function distribute<T>(items: T[], n: number): T[][] {
  const buckets: T[][] = Array.from({ length: n }, () => []);
  items.forEach((item, i) => buckets[i % n].push(item));
  return buckets;
}

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export interface MasonryImage {
  src: string;
  alt?: string;
  name: string;
}

interface MasonryProps {
  images: MasonryImage[];
  /** Fixed column count. Omit for responsive (2 → 5 based on viewport). */
  columns?: number;
  /** Base speed – % of one column-content-height scrolled per second (default 3). */
  baseVelocity?: number;
  /** Gap between columns & images in px (default 16). */
  gap?: number;
  /** Spring damping for velocity smoothing (default 50). */
  damping?: number;
  /** Spring stiffness for velocity smoothing (default 400). */
  stiffness?: number;
  className?: string;
  columnClassName?: string;
}

/* ================================================================== */
/*  ScrollVelocityMasonry                                              */
/* ================================================================== */

export const ScrollVelocityMasonry = forwardRef<HTMLDivElement, MasonryProps>(
  (
    {
      images,
      columns: fixedCols,
      baseVelocity = 3,
      gap = 16,
      damping = 50,
      stiffness = 400,
      className,
      columnClassName,
    },
    ref,
  ) => {
    /* -------- scroll velocity pipeline -------- */

    const { scrollY } = useScroll();
    const rawVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(rawVelocity, { damping, stiffness });

    const velocityFactor = useTransform(smoothVelocity, (v) => {
      const sign = v < 0 ? -1 : 1;
      return sign * Math.min(5, (Math.abs(v) / 1000) * 5);
    });

    /* -------- responsive columns -------- */

    const [cols, setCols] = useState(fixedCols ?? 4);

    useEffect(() => {
      const onResize = () => {
        if (fixedCols != null) {
          setCols(fixedCols);
          return;
        }
        const w = window.innerWidth;
        setCols(w < 640 ? 2 : w < 1024 ? 3 : w < 1536 ? 4 : 5);
      };
      onResize();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [fixedCols]);

    /* -------- render -------- */

    const buckets = distribute(images, cols);

    return (
      <div
        ref={ref}
        className={cn("flex size-full overflow-hidden", className)}
        style={{ gap }}
      >
        {buckets.map((colImages, i) => (
          <Column
            key={`${cols}-${i}`}
            images={colImages}
            direction={i % 2 === 0 ? 1 : -1}
            baseVelocity={baseVelocity}
            gap={gap}
            velocityFactor={velocityFactor}
            columnClassName={columnClassName}
          />
        ))}
      </div>
    );
  },
);

/* ================================================================== */
/*  Column                                                             */
/* ================================================================== */

interface ColumnProps {
  images: MasonryImage[];
  direction: 1 | -1;
  baseVelocity: number;
  gap: number;
  velocityFactor: MotionValue<number>;
  columnClassName?: string;
}

function Column({
  images,
  direction,
  baseVelocity,
  gap,
  velocityFactor,
  columnClassName,
}: ColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(3);

  const baseY = useMotionValue(0);
  const unitH = useMotionValue(0);

  const hoverTarget = useMotionValue(1);
  const hoverSmooth = useSpring(hoverTarget, { damping: 40, stiffness: 300 });

  const baseDirRef = useRef(direction);
  const curDirRef = useRef(direction);

  /* -------- measure block height & decide copy count -------- */

  useEffect(() => {
    const container = containerRef.current;
    const block = blockRef.current;
    if (!container || !block) return;

    const measure = () => {
      const ch = container.offsetHeight || 0;
      const bh = block.offsetHeight || 0;
      unitH.set(bh + gap);
      const need = bh > 0 ? Math.max(3, Math.ceil(ch / bh) + 2) : 3;
      setCopies((prev) => (prev !== need ? need : prev));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(block);
    return () => ro.disconnect();
  }, [images, gap, unitH]);

  /* -------- wrap-based Y transform -------- */

  const y = useTransform([baseY, unitH], ([rawY, rawH]) => {
    const h = Number(rawH) || 1;
    return `${-wrapValue(0, h, Number(rawY) || 0)}px`;
  });

  /* -------- per-frame animation -------- */

  useAnimationFrame((_, delta) => {
    const dt = delta / 1000;
    const vf = velocityFactor.get();
    const absVf = Math.min(5, Math.abs(vf));

    const speed = 1 + absVf;

    if (absVf > 0.1) {
      curDirRef.current = (baseDirRef.current * (vf >= 0 ? 1 : -1)) as 1 | -1;
    }

    const h = unitH.get();
    if (h <= 0) return;

    const pxPerSec = (h * baseVelocity) / 100;
    const hover = hoverSmooth.get();

    baseY.set(baseY.get() + curDirRef.current * pxPerSec * speed * hover * dt);
  });

  /* -------- render -------- */

  return (
    <div
      ref={containerRef}
      className={cn("flex-1 min-w-0 overflow-hidden", columnClassName)}
      onMouseEnter={() => hoverTarget.set(0.05)}
      onMouseLeave={() => hoverTarget.set(1)}
    >
      <m.div className="flex flex-col will-change-transform" style={{ y, gap }}>
        {Array.from({ length: copies }).map((_, ci) => (
          <div
            key={ci}
            ref={ci === 0 ? blockRef : null}
            aria-hidden={ci !== 0}
            className="flex flex-col"
            style={{ gap }}
          >
            {images.map((img, ii) => (
              <ImageBlock key={ii} {...img} />
            ))}
          </div>
        ))}
      </m.div>
    </div>
  );
}

/* ================================================================== */
/*  ImageBlock                                                         */
/* ================================================================== */

function ImageBlock({
  className,
  src,
  alt,
  name,
}: { className?: string } & MasonryImage) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn("w-full transition duration-500", hovered && "scale-110")}
      >
        <img
          src={src}
          alt={alt ?? ""}
          className="h-auto w-full object-cover transition duration-250"
          loading="lazy"
          draggable={false}
        />
      </div>
      <div
        className={cn(
          "absolute -inset-0.5 bg-black/25 backdrop-blur-3xl mix-blend-screen mask-t-to-50% opacity-0 scale-95 transition duration-500",
          "flex gap-3 items-end justify-between p-6",
          hovered && "opacity-100 scale-100",
        )}
      >
        <IconBrandBlender className="size-5 stroke-dark-l" />
        <p className="text-light-l text-2xl font-width-110">{name}</p>
      </div>
    </div>
  );
}
