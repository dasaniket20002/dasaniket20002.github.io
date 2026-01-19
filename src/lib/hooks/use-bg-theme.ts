import { useAnimationFrame } from "motion/react";
import { useState, type RefObject } from "react";

export function useBGTheme(element: RefObject<HTMLElement | null>) {
  const [bgTheme, setBGTheme] = useState<"light" | "dark">("dark");
  useAnimationFrame(() => {
    const elementsWithBGTheme = document.querySelectorAll("[data-bg-theme]");

    if (elementsWithBGTheme.length <= 0 || !element.current) return;

    const headerBounds = element.current.getBoundingClientRect();

    elementsWithBGTheme.forEach((el) => {
      const sectionBounds = el.getBoundingClientRect();
      if (
        !(
          headerBounds.right < sectionBounds.left ||
          headerBounds.left > sectionBounds.right ||
          headerBounds.bottom < sectionBounds.top ||
          headerBounds.top > sectionBounds.bottom
        )
      ) {
        const bgTheme = el.getAttribute("data-bg-theme");
        if (bgTheme === "light" || bgTheme === "dark") {
          setBGTheme(bgTheme);
        }
      }
    });
  });
  return bgTheme;
}
