import { animate, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { preloadImage, randomRange, wait } from "../../utils";

const ALL_IMAGES = [
  "/assets/portrait/Portrait-FG.png",
  "/assets/portrait/Portrait-BG.png",
  "/assets/works/blender/antigravity.png",
  "/assets/works/blender/aquarium_of_life.png",
  "/assets/works/blender/bathroom_unclean.png",
  "/assets/works/blender/bathroom_woman.png",
  "/assets/works/blender/beach_bottle.png",
  "/assets/works/blender/black_hole.png",
  "/assets/works/blender/burning_butterfly.png",
  "/assets/works/blender/candy.png",
  "/assets/works/blender/car_ruins.png",
  "/assets/works/blender/cyberpunk_01.png",
  "/assets/works/blender/cyberpunk_02.png",
  "/assets/works/blender/data_cube.png",
  "/assets/works/blender/detained.png",
  "/assets/works/blender/distort.png",
  "/assets/works/blender/hallows.png",
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
    const preloadPromise = Promise.all(
      ALL_IMAGES.map((url) => preloadImage(url)),
    );

    const animationPromise = (async () => {
      await wait(1500);

      await animate(count, randomRange(30, 40), {
        duration: 0.5,
        ease: "easeInOut",
      });
      await wait(400);

      await animate(count, randomRange(50, 70), {
        duration: 0.75,
        ease: "easeInOut",
      });
      await wait(500);
    })();

    Promise.all([preloadPromise, animationPromise]).then(async () => {
      await animate(count, 100, { duration: 0.25, ease: "easeInOut" });
      await wait(250);
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
