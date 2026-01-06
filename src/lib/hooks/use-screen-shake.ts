import { animate, useAnimation } from "motion/react";
import { useCallback } from "react";

export type ShakeOptions = {
  strength?: number; // px
  duration?: number; // seconds
};

export function useScreenShake(
  containerRef?: React.RefObject<HTMLElement | null>
) {
  const controls = useAnimation();

  const shake = useCallback(
    ({ strength = 3, duration = 0.25 }: ShakeOptions = {}) => {
      controls.start({
        x: [0, -strength, strength, -strength / 2, strength / 2, 0],
        y: [0, strength / 2, -strength / 2, strength / 4, -strength / 4, 0],
        rotate: [0, -0.4, 0.4, -0.2, 0.2, 0],
        transition: { duration },
      });

      const root = containerRef?.current ?? document.documentElement;

      const elements = root.querySelectorAll("[data-screen-shakable='true']");

      elements.forEach((el) => {
        const { x: baseX, y: baseY } = getCurrentTranslate(el);

        // small random drift
        const offsetX = (Math.random() * 2 - 1) * strength * 2;
        const offsetY = (Math.random() * 2 - 1) * strength * 2;

        animate(
          el,
          {
            x: baseX + offsetX,
            y: baseY + offsetY,
          },
          {
            duration,
            ease: "backOut",
          }
        );
      });
    },
    [controls, containerRef]
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
