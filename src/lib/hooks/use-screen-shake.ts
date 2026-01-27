import { animate, useAnimation } from "motion/react";
import { useCallback, useRef } from "react";

export type ShakeOptions = {
  strength?: number; // px
  duration?: number; // seconds
};

export function useScreenShake(
  containerRef?: React.RefObject<HTMLElement | null>,
) {
  const controls = useAnimation();
  const isShaking = useRef(false);

  const shake = useCallback(
    async ({ strength = 3, duration = 0.25 }: ShakeOptions = {}) => {
      if (isShaking.current) return;
      isShaking.current = true;

      controls.start({
        x: [0, -strength, strength, -strength / 2, strength / 2, 0],
        y: [0, strength / 2, -strength / 2, strength / 4, -strength / 4, 0],
        rotate: [0, -0.4, 0.4, -0.2, 0.2, 0],
        transition: { duration },
      });

      const root = containerRef?.current ?? document.documentElement;
      const elements = root.querySelectorAll("[data-screen-shakable='true']");

      elements.forEach(async (el) => {
        const { x: baseX, y: baseY } = getCurrentTranslate(el);
        const returnToOrigin =
          el.getAttribute("data-return-to-origin") === "true";

        // small random drift
        const offsetX = (Math.random() * 2 - 1) * strength * 2;
        const offsetY = (Math.random() * 2 - 1) * strength * 2;

        await animate(
          el,
          {
            x: baseX + offsetX,
            y: baseY + offsetY,
          },
          {
            duration,
            ease: "backOut",
          },
        );

        if (returnToOrigin) {
          await animate(
            el,
            {
              x: baseX,
              y: baseY,
            },
            {
              type: "spring",
              stiffness: 500,
              damping: 15,
            },
          );
        }

        isShaking.current = false;
      });
    },
    [controls, containerRef],
  );

  return { controls, shake };
}

function getCurrentTranslate(el: Element) {
  const transform = getComputedStyle(el).transform;

  if (transform === "none") {
    return { x: 0, y: 0 };
  }

  const matrix = new DOMMatrixReadOnly(transform);
  return {
    x: matrix.m41,
    y: matrix.m42,
  };
}
