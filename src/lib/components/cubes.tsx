// import {
//   motion,
//   MotionValue,
//   useAnimate,
//   useMotionValue,
//   useSpring,
//   useTransform,
// } from "motion/react";
// import React, {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
// } from "react";
// import { cn } from "../utils";

// interface Gap {
//   row: number;
//   col: number;
// }

// export interface CubesProps {
//   gridSize?: number;
//   cubeSize?: number;
//   maxAngle?: number;
//   radius?: number;
//   cellGap?: number | Gap;
//   borderStyle?: string;
//   faceColor?: string;
//   shadow?: boolean | string;
//   autoAnimate?: boolean;
//   rippleOnClick?: boolean;
//   rippleColor?: string;
//   rippleSpeed?: number;
//   className?: string;
// }

// // Internal Cube Component for individual logic
// const Cube = forwardRef<
//   HTMLDivElement,
//   {
//     r: number;
//     c: number;
//     mouseX: MotionValue<number>;
//     mouseY: MotionValue<number>;
//     maxAngle: number;
//     radius: number;
//     faceColor: string;
//     borderStyle: string;
//     shadowValue: string;
//   }
// >(
//   (
//     {
//       r,
//       c,
//       mouseX,
//       mouseY,
//       maxAngle,
//       radius,
//       faceColor,
//       borderStyle,
//       shadowValue,
//     },
//     ref
//   ) => {
//     // Transform logic: Calculate rotation based on distance from the MotionValue coordinates
//     const rotateX = useTransform([mouseX, mouseY], ([x, y]) => {
//       const dist = Math.hypot(r - (y as number), c - (x as number));
//       if (dist <= radius) {
//         const pct = 1 - dist / radius;
//         return -pct * maxAngle;
//       }
//       return 0;
//     });

//     const rotateY = useTransform([mouseX, mouseY], ([x, y]) => {
//       const dist = Math.hypot(r - (y as number), c - (x as number));
//       if (dist <= radius) {
//         const pct = 1 - dist / radius;
//         return pct * maxAngle;
//       }
//       return 0;
//     });

//     const commonFaceStyle = {
//       backgroundColor: faceColor, // We use backgroundColor here so it can be overridden by the ripple animation
//       border: borderStyle,
//       boxShadow: shadowValue,
//     };

//     return (
//       <motion.div
//         ref={ref}
//         className="cube relative w-full h-full aspect-square transform-3d"
//         style={{ rotateX, rotateY }}
//         // Store coordinates in dataset for potential debugging, though now unused by logic
//         data-row={r}
//         data-col={c}
//       >
//         <span className="absolute pointer-events-none -inset-9" />

//         {/* Faces */}
//         <motion.div
//           className="cube-face absolute inset-0 flex items-center justify-center"
//           style={{
//             ...commonFaceStyle,
//             transform: "translateY(-50%) rotateX(90deg)",
//           }}
//         />
//         <motion.div
//           className="cube-face absolute inset-0 flex items-center justify-center"
//           style={{
//             ...commonFaceStyle,
//             transform: "translateY(50%) rotateX(-90deg)",
//           }}
//         />
//         <motion.div
//           className="cube-face absolute inset-0 flex items-center justify-center"
//           style={{
//             ...commonFaceStyle,
//             transform: "translateX(-50%) rotateY(-90deg)",
//           }}
//         />
//         <motion.div
//           className="cube-face absolute inset-0 flex items-center justify-center"
//           style={{
//             ...commonFaceStyle,
//             transform: "translateX(50%) rotateY(90deg)",
//           }}
//         />
//         <motion.div
//           className="cube-face absolute inset-0 flex items-center justify-center"
//           style={{
//             ...commonFaceStyle,
//             transform: "rotateY(-90deg) translateX(50%) rotateY(90deg)",
//           }}
//         />
//         <motion.div
//           className="cube-face absolute inset-0 flex items-center justify-center"
//           style={{
//             ...commonFaceStyle,
//             transform: "rotateY(90deg) translateX(-50%) rotateY(-90deg)",
//           }}
//         />
//       </motion.div>
//     );
//   }
// );

// const Cubes = forwardRef<HTMLDivElement, CubesProps>(
//   (
//     {
//       gridSize = 10,
//       cubeSize,
//       maxAngle = 60,
//       radius = 4,
//       cellGap,
//       borderStyle = "1px dashed var(--color-dark-1)",
//       faceColor = "var(--color-dark-2)",
//       shadow = true,
//       autoAnimate = true,
//       rippleOnClick = true,
//       rippleColor = "var(--color-light-1)",
//       rippleSpeed = 2,
//       className,
//     },
//     ref
//   ) => {
//     // Animation Scope for the ripple effect
//     const [scope, animate] = useAnimate<HTMLDivElement>();

//     // Motion Values for the "Focus" point (can be mouse or auto-animation)
//     const rawMouseX = useMotionValue(-100);
//     const rawMouseY = useMotionValue(-100);

//     // Spring physics for smooth movement (replaces GSAP ease/duration)
//     const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
//     const smoothMouseX = useSpring(rawMouseX, springConfig);
//     const smoothMouseY = useSpring(rawMouseY, springConfig);

//     // Refs for logic
//     const userActiveRef = useRef(false);
//     const idleTimerRef = useRef<number | null>(null);
//     const simPosRef = useRef({ x: gridSize / 2, y: gridSize / 2 });
//     const simTargetRef = useRef({ x: gridSize / 2, y: gridSize / 2 });
//     const simRafRef = useRef<number | null>(null);

//     // CSS Grid Calculations
//     const colGap =
//       typeof cellGap === "number"
//         ? `${cellGap}px`
//         : (cellGap as Gap)?.col !== undefined
//         ? `${(cellGap as Gap).col}px`
//         : "5%";

//     const rowGap =
//       typeof cellGap === "number"
//         ? `${cellGap}px`
//         : (cellGap as Gap)?.row !== undefined
//         ? `${(cellGap as Gap).row}px`
//         : "5%";

//     const sceneStyle: React.CSSProperties = {
//       gridTemplateColumns: cubeSize
//         ? `repeat(${gridSize}, ${cubeSize}px)`
//         : `repeat(${gridSize}, 1fr)`,
//       gridTemplateRows: cubeSize
//         ? `repeat(${gridSize}, ${cubeSize}px)`
//         : `repeat(${gridSize}, 1fr)`,
//       columnGap: colGap,
//       rowGap: rowGap,
//       perspective: "99999999px",
//       gridAutoRows: "1fr",
//     };

//     const wrapperStyle = useMemo(() => {
//       return {
//         ...(cubeSize
//           ? {
//               width: `${gridSize * cubeSize}px`,
//               height: `${gridSize * cubeSize}px`,
//             }
//           : {}),
//       } as React.CSSProperties;
//     }, [cubeSize, gridSize]);

//     const shadowValue =
//       shadow === true ? "0 0 6px rgba(0,0,0,.5)" : (shadow as string) || "none";

//     // --- Interaction Handlers ---

//     const handlePointerMove = useCallback(
//       (e: React.PointerEvent) => {
//         userActiveRef.current = true;
//         if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

//         if (!scope.current) return;
//         const rect = scope.current.getBoundingClientRect();

//         // Normalize mouse position to grid coordinates
//         const cellW = rect.width / gridSize;
//         const cellH = rect.height / gridSize;
//         const x = (e.clientX - rect.left) / cellW;
//         const y = (e.clientY - rect.top) / cellH;

//         rawMouseX.set(x);
//         rawMouseY.set(y);

//         idleTimerRef.current = setTimeout(() => {
//           userActiveRef.current = false;
//         }, 3000);
//       },
//       [gridSize, rawMouseX, rawMouseY, scope]
//     );

//     const handlePointerLeave = useCallback(() => {
//       // Set to the exact center of the grid
//       const center = (gridSize - 1) / 2;
//       rawMouseX.set(center);
//       rawMouseY.set(center);
//     }, [gridSize, rawMouseX, rawMouseY]);

//     const handleClick = useCallback(
//       (e: React.MouseEvent | React.TouchEvent) => {
//         if (!rippleOnClick || !scope.current) return;

//         const rect = scope.current.getBoundingClientRect();
//         const clientX =
//           (e as React.MouseEvent).clientX ||
//           (e as React.TouchEvent).touches?.[0]?.clientX;
//         const clientY =
//           (e as React.MouseEvent).clientY ||
//           (e as React.TouchEvent).touches?.[0]?.clientY;

//         const cellW = rect.width / gridSize;
//         const cellH = rect.height / gridSize;
//         const colHit = Math.floor((clientX - rect.left) / cellW);
//         const rowHit = Math.floor((clientY - rect.top) / cellH);

//         // Dynamic delay calculation for wave effect
//         // Framer Motion's `delay` function receives (index, total), NOT the element.
//         // We calculate the row/col from the index.
//         const staggerDelay = (i: number) => {
//           // There are 6 faces per cube.
//           const cubeIndex = Math.floor(i / 6);
//           const r = Math.floor(cubeIndex / gridSize);
//           const c = cubeIndex % gridSize;

//           const dist = Math.hypot(r - rowHit, c - colHit);

//           const baseRingDelay = 0.15;
//           const spreadDelay = baseRingDelay / rippleSpeed;

//           return dist * spreadDelay;
//         };

//         // Trigger the ripple using Framer's imperative animate
//         animate(
//           ".cube-face",
//           {
//             backgroundColor: [faceColor, rippleColor, faceColor],
//           },
//           {
//             delay: staggerDelay,
//             duration: 0.3 / rippleSpeed,
//             ease: "easeOut",
//           }
//         );
//       },
//       [
//         rippleOnClick,
//         scope,
//         gridSize,
//         faceColor,
//         rippleColor,
//         rippleSpeed,
//         animate,
//       ]
//     );

//     // --- Auto Animation Loop ---

//     useEffect(() => {
//       if (!autoAnimate) return;

//       const speed = 0.02;

//       const loop = () => {
//         if (!userActiveRef.current) {
//           const pos = simPosRef.current;
//           const tgt = simTargetRef.current;

//           // Linear interpolation for simulation position
//           pos.x += (tgt.x - pos.x) * speed;
//           pos.y += (tgt.y - pos.y) * speed;

//           // Update MotionValues directly
//           rawMouseX.set(pos.x);
//           rawMouseY.set(pos.y);

//           // Pick new target if close
//           if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
//             simTargetRef.current = {
//               x: Math.random() * gridSize,
//               y: Math.random() * gridSize,
//             };
//           }
//         }
//         simRafRef.current = requestAnimationFrame(loop);
//       };

//       simRafRef.current = requestAnimationFrame(loop);

//       return () => {
//         if (simRafRef.current) cancelAnimationFrame(simRafRef.current);
//       };
//     }, [autoAnimate, gridSize, rawMouseX, rawMouseY]);

//     // --- Render ---

//     const cells = Array.from({ length: gridSize });

//     return (
//       <div
//         className={cn("relative w-1/2 max-md:w-11/12", className)}
//         style={wrapperStyle}
//         ref={ref}
//       >
//         <div
//           ref={scope}
//           className="grid w-full h-full"
//           style={sceneStyle}
//           onPointerMove={handlePointerMove}
//           onPointerLeave={handlePointerLeave}
//           onClick={handleClick}
//         >
//           {cells.map((_, r) =>
//             cells.map((__, c) => (
//               <Cube
//                 key={`${r}-${c}`}
//                 r={r}
//                 c={c}
//                 mouseX={smoothMouseX}
//                 mouseY={smoothMouseY}
//                 maxAngle={maxAngle}
//                 radius={radius}
//                 faceColor={faceColor}
//                 borderStyle={borderStyle}
//                 shadowValue={shadowValue}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     );
//   }
// );

// export default Cubes;

import {
  motion,
  MotionValue,
  useAnimate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { cn } from "../utils";
import { useElementSize } from "../hooks/use-element-size";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Gap {
  row: number;
  col: number;
}

export interface CubesProps {
  layout?: "fixed" | "responsive";
  rows?: number;
  cols?: number;
  cubeSize?: number;
  maxAngle?: number;
  radius?: number;
  cellGap?: number | Gap;
  borderStyle?: string;
  faceColor?: string;
  shadow?: boolean | string;
  autoAnimate?: boolean;
  rippleOnClick?: boolean;
  rippleColor?: string;
  rippleSpeed?: number;
  className?: string;
  parentContainerRef?: RefObject<HTMLElement | null>;
}

/* -------------------------------------------------------------------------- */
/* Cube (single cell)                                                         */
/* -------------------------------------------------------------------------- */

interface CubeProps {
  r: number;
  c: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  maxAngle: number;
  radius: number;
  faceColor: string;
  borderStyle: string;
  shadowValue: string;
}

const Cube = forwardRef<HTMLDivElement, CubeProps>(
  (
    {
      r,
      c,
      mouseX,
      mouseY,
      maxAngle,
      radius,
      faceColor,
      borderStyle,
      shadowValue,
    },
    ref
  ) => {
    const rotateX = useTransform([mouseX, mouseY], ([x, y]) => {
      const dist = Math.hypot(r - (y as number), c - (x as number));
      if (dist <= radius) {
        const pct = 1 - dist / radius;
        return -pct * maxAngle;
      }
      return 0;
    });

    const rotateY = useTransform([mouseX, mouseY], ([x, y]) => {
      const dist = Math.hypot(r - (y as number), c - (x as number));
      if (dist <= radius) {
        const pct = 1 - dist / radius;
        return pct * maxAngle;
      }
      return 0;
    });

    const faceStyle = {
      backgroundColor: faceColor,
      border: borderStyle,
      boxShadow: shadowValue,
    };

    return (
      <motion.div
        ref={ref}
        className="cube relative w-full h-full aspect-square transform-3d"
        style={{ rotateX, rotateY }}
      >
        <span className="absolute pointer-events-none -inset-9" />

        {/* Top */}
        <motion.div
          className="cube-face absolute inset-0"
          style={{ ...faceStyle, transform: "translateY(-50%) rotateX(90deg)" }}
        />
        {/* Bottom */}
        <motion.div
          className="cube-face absolute inset-0"
          style={{ ...faceStyle, transform: "translateY(50%) rotateX(-90deg)" }}
        />
        {/* Left */}
        <motion.div
          className="cube-face absolute inset-0"
          style={{
            ...faceStyle,
            transform: "translateX(-50%) rotateY(-90deg)",
          }}
        />
        {/* Right */}
        <motion.div
          className="cube-face absolute inset-0"
          style={{ ...faceStyle, transform: "translateX(50%) rotateY(90deg)" }}
        />
        {/* Front */}
        <motion.div
          className="cube-face absolute inset-0"
          style={{
            ...faceStyle,
            transform: "rotateY(-90deg) translateX(50%) rotateY(90deg)",
          }}
        />
        {/* Back */}
        <motion.div
          className="cube-face absolute inset-0"
          style={{
            ...faceStyle,
            transform: "rotateY(90deg) translateX(-50%) rotateY(-90deg)",
          }}
        />
      </motion.div>
    );
  }
);

Cube.displayName = "Cube";

/* -------------------------------------------------------------------------- */
/* Cubes (grid)                                                               */
/* -------------------------------------------------------------------------- */

const Cubes = forwardRef<HTMLDivElement, CubesProps>(
  (
    {
      layout = "responsive",
      rows = 10,
      cols = 10,
      cubeSize = 128,
      maxAngle = 45,
      radius = 4,
      cellGap = 64,
      borderStyle = "1px dashed var(--color-dark-1)",
      faceColor = "var(--color-dark-2)",
      shadow = false,
      autoAnimate = true,
      rippleOnClick = true,
      rippleColor = "var(--color-light-1)",
      rippleSpeed = 2,
      className,
      parentContainerRef,
    },
    forwardedRef
  ) => {
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerSize = useElementSize(parentContainerRef ?? wrapperRef);

    useImperativeHandle(
      forwardedRef,
      () => wrapperRef.current as HTMLDivElement
    );

    /* ---------------- Calculations ---------------- */

    function calcCount(container: number, cube: number, gap: number) {
      return Math.max(1, Math.floor((container + gap) / (cube + gap)));
    }

    const gapX = useMemo(
      () => (typeof cellGap === "number" ? cellGap : cellGap.col),
      [cellGap]
    );
    const gapY = useMemo(
      () => (typeof cellGap === "number" ? cellGap : cellGap.row),
      [cellGap]
    );

    const derivedCols = useMemo(
      () =>
        layout === "responsive" && cubeSize
          ? calcCount(containerSize.width, cubeSize, gapX)
          : cols,
      [cols, containerSize, cubeSize, gapX, layout]
    );
    const derivedRows = useMemo(
      () =>
        layout === "responsive" && cubeSize
          ? calcCount(containerSize.height, cubeSize, gapY)
          : rows,
      [containerSize, cubeSize, gapY, layout, rows]
    );

    // useEffect(() => {
    //   console.log(containerSize, cubeSize);
    //   console.log("cols", derivedCols, containerSize.width / cubeSize);
    //   console.log("rows", derivedRows, containerSize.height / cubeSize);
    // }, [containerSize, derivedCols, derivedRows, cubeSize]);

    /* ---------------- Motion values ---------------- */

    const rawMouseX = useMotionValue(-100);
    const rawMouseY = useMotionValue(-100);

    const smoothMouseX = useSpring(rawMouseX, {
      damping: 20,
      stiffness: 100,
      mass: 0.5,
    });
    const smoothMouseY = useSpring(rawMouseY, {
      damping: 20,
      stiffness: 100,
      mass: 0.5,
    });

    /* ---------------- Refs ---------------- */

    const userActiveRef = useRef(false);
    const idleTimerRef = useRef<number | null>(null);
    const simPosRef = useRef({ x: derivedCols / 2, y: derivedRows / 2 });
    const simTargetRef = useRef({ x: derivedCols / 2, y: derivedRows / 2 });
    const rafRef = useRef<number | null>(null);

    /* ---------------- Grid styles ---------------- */

    const sceneStyle: React.CSSProperties = {
      gridTemplateColumns: `repeat(${derivedCols}, ${cubeSize}px)`,
      gridTemplateRows: `repeat(${derivedRows}, ${cubeSize}px)`,
      columnGap: `${gapX}px`,
      rowGap: `${gapY}px`,
      perspective: "99999999px",
    };

    const wrapperStyle: React.CSSProperties = useMemo(() => {
      if (!cubeSize || layout === "responsive") return {};
      return {
        width: `${derivedCols * cubeSize}px`,
        height: `${derivedRows * cubeSize}px`,
      };
    }, [cubeSize, derivedCols, derivedRows, layout]);

    const shadowValue =
      shadow === true ? "0 0 6px rgba(0,0,0,.5)" : shadow || "none";

    /* ---------------- Interaction ---------------- */

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        userActiveRef.current = true;
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

        if (!scope.current) return;
        const rect = scope.current.getBoundingClientRect();

        // const cellW = rect.width / derivedCols;
        // const cellH = rect.height / derivedRows;

        // rawMouseX.set((e.clientX - rect.left) / cellW);
        // rawMouseY.set((e.clientY - rect.top) / cellH);

        const totalGapX = (derivedCols - 1) * gapX;
        const totalGapY = (derivedRows - 1) * gapY;

        const usableW = rect.width - totalGapX;
        const usableH = rect.height - totalGapY;

        const cellW = usableW / derivedCols;
        const cellH = usableH / derivedRows;

        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        // position inside grid including gaps
        const col = Math.floor(relX / (cellW + gapX));
        const row = Math.floor(relY / (cellH + gapY));

        // ignore pointer if it's inside a gap
        const insideGapX = relX % (cellW + gapX) > cellW;
        const insideGapY = relY % (cellH + gapY) > cellH;

        if (!insideGapX && !insideGapY) {
          rawMouseX.set(col);
          rawMouseY.set(row);
        }

        idleTimerRef.current = window.setTimeout(() => {
          userActiveRef.current = false;
        }, 3000);
      },
      [derivedCols, derivedRows, gapX, gapY, rawMouseX, rawMouseY, scope]
    );

    const handlePointerLeave = useCallback(() => {
      rawMouseX.set((derivedCols - 1) / 2);
      rawMouseY.set((derivedRows - 1) / 2);
    }, [derivedCols, derivedRows, rawMouseX, rawMouseY]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!rippleOnClick || !scope.current) return;

        const rect = scope.current.getBoundingClientRect();
        const cellW = rect.width / derivedCols;
        const cellH = rect.height / derivedRows;

        const colHit = Math.floor((e.clientX - rect.left) / cellW);
        const rowHit = Math.floor((e.clientY - rect.top) / cellH);

        animate(
          ".cube-face",
          {
            backgroundColor: [faceColor, rippleColor, faceColor],
          },
          {
            delay: (i) => {
              const cubeIndex = Math.floor(i / 6);
              const r = Math.floor(cubeIndex / derivedCols);
              const c = cubeIndex % derivedCols;
              return Math.hypot(r - rowHit, c - colHit) * (0.15 / rippleSpeed);
            },
            duration: 0.3 / rippleSpeed,
            ease: "easeOut",
          }
        );
      },
      [
        rippleOnClick,
        scope,
        derivedCols,
        derivedRows,
        animate,
        faceColor,
        rippleColor,
        rippleSpeed,
      ]
    );

    /* ---------------- Auto animation ---------------- */

    useEffect(() => {
      if (!autoAnimate) return;

      const speed = 0.02;

      const loop = () => {
        if (!userActiveRef.current) {
          const pos = simPosRef.current;
          const tgt = simTargetRef.current;

          pos.x += (tgt.x - pos.x) * speed;
          pos.y += (tgt.y - pos.y) * speed;

          rawMouseX.set(pos.x);
          rawMouseY.set(pos.y);

          if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
            simTargetRef.current = {
              x: Math.random() * derivedCols,
              y: Math.random() * derivedRows,
            };
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [autoAnimate, derivedCols, derivedRows, rawMouseX, rawMouseY]);

    /* ---------------- Render ---------------- */

    return (
      <div
        ref={wrapperRef}
        className={cn(
          "relative place-content-center place-items-center",
          className
        )}
        style={wrapperStyle}
      >
        <div
          ref={scope}
          className="grid"
          style={sceneStyle}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          {Array.from({ length: derivedRows }).map((_, r) =>
            Array.from({ length: derivedCols }).map((__, c) => (
              <Cube
                key={`${r}-${c}`}
                r={r}
                c={c}
                mouseX={smoothMouseX}
                mouseY={smoothMouseY}
                maxAngle={maxAngle}
                radius={radius}
                faceColor={faceColor}
                borderStyle={borderStyle}
                shadowValue={shadowValue}
              />
            ))
          )}
        </div>
      </div>
    );
  }
);

Cubes.displayName = "Cubes";

export default Cubes;
