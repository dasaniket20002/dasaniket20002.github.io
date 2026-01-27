import { animate, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { preloadImage, wait } from "../../utils";

const ALL_IMAGES = [
  "/assets/portrait/Portrait-FG.png",
  "/assets/portrait/Portrait-BG.png",
  "/assets/works/blender/antigravity.png",
  "/assets/works/blender/aquarium_of_life.png",
  "/assets/works/blender/bathroom_woman.png",
  "/assets/works/blender/black_hole.png",
  "/assets/works/blender/car_ruins.png",
  "/assets/works/blender/cyberpunk_01.png",
  "/assets/works/blender/cyberpunk_02.png",
  "/assets/works/blender/detained.png",
  "/assets/works/blender/hand_and_rose.png",
  "/assets/works/blender/life_support.png",
  "/assets/works/blender/lost_01.png",
  "/assets/works/blender/lost_02.png",
  "/assets/works/blender/lost_03.png",
  "/assets/works/blender/omw.png",
  "/assets/works/blender/piano_ruins.png",
  "/assets/works/blender/sunken.png",
  "/assets/works/blender/the_door.png",
];

export default function Counter({ onComplete }: { onComplete: () => void }) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      let counter = 0;
      const increment = 100 / ALL_IMAGES.length;
      for (const imgSrc of ALL_IMAGES) {
        await preloadImage(imgSrc);
        counter += increment;
        animate(count, counter, {
          duration: 0.25,
          ease: "easeInOut",
        });
      }
    };

    sequence().then(async () => {
      await wait(500);
      onComplete();
    });
  }, [count, onComplete]);

  count.on("change", (latest) => {
    setDisplay(Math.round(latest));
  });

  return (
    <p className="w-full font-think-loved text-5xl text-center">{display}</p>
  );
}
